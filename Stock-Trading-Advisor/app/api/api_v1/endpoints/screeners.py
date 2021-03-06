from datetime import date
from typing import Any, List

from app import crud, schemas
from app.api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()

attributesPrice = ["timestamp", "open", "high", "low", "close", "adjusted_close", "volume", "dividend_amount", "split_coefficient", "symbol"]
attributesOverview = ["symbol", "assettype", "name", "description", "exchange", "currency", "country", "sector", "industry", "address", "fiscalyearend", "latestquarter", "marketcapitalization", "peratio", "pegratio", "bookvalue", "dividendpershare", "dividendyield", "eps", "revenuepersharettm", "profitmargin", "operatingmarginttm", "returnonassetsttm", "returnonequityttm", "revenuettm", "grossprofitttm", "dilutedepsttm", "quarterlyearningsgrowthyoy", "quarterlyrevenuegrowthyoy", "analysttargetprice", "trailingpe", "forwardpe", "pricetosalesratiottm", "pricetobookratio", "evtorevenue", "evtoebitda", "beta", "52weekhigh", "52weeklow", "50daymovingaverage", "200daymovingaverage", "sharesoutstanding", "dividenddate", "exdividenddate", "ebitda", "cik"]

def isFormulaSatisfied(stock, overview, formula, comparison, value1, value2):
    if(stock["symbol"] != overview["Symbol"]):
        print("symbol not right")
        return False
    value1 = float(value1)
    value2 = float(value2)
    
    for key in stock.keys():
        if(key == "timestamp" or key == "symbol"):
            continue
        variable = key.lower()
        exec("%s = stock[\"%s\"]" % (variable, key))

    for key in overview.keys():
        if(key == "Symbol"):
            continue
        variable = key.lower()
        if(variable[0] == '2' or variable[0] == '5'):
            variable = "d" + variable
        exec("%s = overview[\"%s\"]" % (variable, key))
    
    formula = formula.lower()
    formula = formula.replace("52weekhigh", "d52weekhigh").replace("52weeklow", "d52weeklow").replace("50daymovingaverage", "d50daymovingaverage").replace("200daymovingaverage", "d200daymovingaverage")
    
    try:
        formulaValue = eval(formula)
        if(comparison == "between"):
            return (min(value1, value2) <= formulaValue and formulaValue <= max(value1, value2), formula, formulaValue)
        else:
            comparison = comparison.replace("=", "==")
#            print(stock["symbol"])
#            print(str(formulaValue) + comparison + str(value1))
#            print(eval(str(formulaValue) + comparison + str(value1)))
            return (eval(str(formulaValue) + comparison + str(value1)), formula, formulaValue)
            
    except TypeError: # Return false if any value not exist, or divide by zero, or etc.
        return (False, 0, 0)
    except ZeroDivisionError:
        return (False, 0, 0)
        
def filtering(db, date, filter, sortby, order, attributes = []):
    stocks = crud.price.get_prices_by_date(db=db, date=date, sortby=sortby, order=order)
    overview = crud.price.get_overview_by_date(db=db, date=date, sortby=sortby, order=order)
    newStocks = []
    
    print(filter)
    print("total %d stocks" % len(stocks))
    
    symbolToIndexOverview = {}
    for i in range(len(overview)):
        symbolToIndexOverview[overview[i]["Symbol"]] = i
    
    for i in range(len(stocks)):
        satisfied = True
        j = 0
        attributesToAdd = {}
        while j < len(filter):
            if(filter[j + 1].lower() == "between"):
                sat = isFormulaSatisfied(stocks[i], overview[symbolToIndexOverview[stocks[i]["symbol"]]], filter[j], "between", filter[j + 2], filter[j + 3])
                satisfied = satisfied and sat[0]
                attributesToAdd[sat[1]] = sat[2]
                j = j + 4
            else:
                sat = isFormulaSatisfied(stocks[i], overview[symbolToIndexOverview[stocks[i]["symbol"]]], filter[j], filter[j + 1], filter[j + 2], 0)
                satisfied = satisfied and sat[0]
                attributesToAdd[sat[1]] = sat[2]
                j = j + 3
            if(not satisfied):
                break
        if(satisfied):
            if(len(attributes) > 0):
                d = {}
                for key in stocks[i].keys():
                    if(key.lower() in attributes):
                        d[key.lower()] = stocks[i][key]
                for key in overview[symbolToIndexOverview[stocks[i]["symbol"]]].keys():
                    if(key.lower() in attributes):
                        d[key.lower()] = overview[symbolToIndexOverview[stocks[i]["symbol"]]][key]
                
                # add custom formula to attributes
                for key in attributesToAdd.keys():
                    d[key] = round(attributesToAdd[key], 2)
                
                newStocks.append(d)
            else:
                newStocks.append(stocks[i])
    
    print("new filtered %d stocks" % len(newStocks))
    return newStocks

@router.get("/prices_by_date", response_model=List[schemas.Price])
def get_price_by_date(
    db: Session = Depends(deps.get_db),
    date: date = date(2022, 2, 8),
    sortby: str = "volume * close",
    order: str = "DESC",
) -> Any:
    """
    Retrieve prices by a date.
    """
    prices = crud.price.get_prices_by_date(db=db, date=date, sortby=sortby, order=order)
    return prices

@router.post("/prices_by_filters", response_model=List[schemas.Price])
def get_price_by_filters(
    *,
    db: Session = Depends(deps.get_db),
    date: date = date(2022, 2, 8),
    filter: List[str] = ["EPS", "BETWEEN", "0", "100", "1 / PERatio", ">", "10"],
    sortby: str = "volume * close",
    order: str = "DESC",
) -> Any:
    """
    Retrieve prices by filters.
    """

    filteredStocks = filtering(db=db, date=date, filter=filter, sortby=sortby, order=order)
    
    return filteredStocks
    
    # preprocess filter
    # PERatio > 10 / Sector = 'TECHNOLOGY'
    # => WHERE "PERatio" > 10 / WHERE "Sector" = 'TECHNOLOGY'
    # custom filter must be seperated by spaces
#    formated_filter = []
#    i = 0
#    while(i < len(filter)):
#        column, symbol = filter[i], filter[i+1]
#        elements = column.split(" ")
#        column = ""
#        for j in range(len(elements)):
#            if elements[j].isnumeric(): #pure number
#                column += elements[j]
#            elif elements[j].isalnum(): #number mix alphabets or pure alphabets
#                column += '"{}"'.format(elements[j])
#            else: #all alphabet,
#                column += elements[j]  #colum =close
#            if j != len(elements)-1:
#                column += " "
#        if symbol.lower() == "between":
#            value1, value2 = filter[i+2], filter[i+3]
#            formated_filter.append('{} {} {} AND {}'.format(column, symbol, value1, value2))
#            i += 4
#        else:
#            value = filter[i+2]
#            if symbol == "=" :
#                value = "'{}'".format(value)
#            formated_filter.append('{} {} {}'.format(column, symbol, value))
#            i += 3
#    print(formated_filter)
#    prices = crud.price.get_prices_by_filter(db=db, date=date, filter=formated_filter, sortby=sortby, order=order)
#
#    print("old filtered %d stocks" % len(prices))
    
#    return prices


@router.get("/filters", response_model=List[schemas.Filter])
def get_filter_all(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve filters.
    """
    filters = crud.filter.get_filter_all(db=db)
    return filters

@router.get("/filter_category", response_model=List[schemas.Category])
def get_category_by_filter(
    *,
    db: Session = Depends(deps.get_db),
    filter: str,
) -> Any:
    """
    Retrieve categories by a filter.
    """
    categories = crud.filter.get_category_by_filter(db=db, filter=filter)
    return categories


@router.post("/backtest")
def get_backtest_result(
    *,
    db: Session = Depends(deps.get_db),
    dateIn: date = date(2021, 7, 15),
    dateOut: date = date(2022, 2, 8),
    filter: List[str] = ["EPS", "BETWEEN", "0", "100", "1 / PERatio", ">", "10"],
    sortby: str = "volume * close",
    order: str = "DESC",
) -> Any:
    """
    Retrieve prices by filters.
    """
    
    desiredAttributes = ["symbol", "close"]
    for f in filter:
        if(f.lower() in attributesPrice):
            desiredAttributes.append(f.lower())
        elif(f.lower() in attributesOverview):
            desiredAttributes.append(f.lower())
    
    pricesIn = filtering(db, dateIn, filter, sortby, order, desiredAttributes)
    
    pricesOut = crud.price.get_prices_by_date(db=db, date=dateOut, sortby=sortby, order=order)
    
    symbolToIndexOut = {}
    for i in range(len(pricesOut)):
        symbolToIndexOut[pricesOut[i]["symbol"]] = i
    
    newPricesIn = []
    for i in range(len(pricesIn)):
        d = dict(pricesIn[i])
        newPricesIn.append(d)
        
        inPrice = pricesIn[i]["close"]
        if(pricesIn[i]["symbol"] not in symbolToIndexOut):
            newPricesIn[-1]["profit"] = 0.0
            continue
        outPrice = pricesOut[symbolToIndexOut[pricesIn[i]["symbol"]]]["close"]
        
        newPricesIn[-1]["buy price"] = inPrice
        newPricesIn[-1]["sell price"] = outPrice
        newPricesIn[-1]["profit (%)"] = round((outPrice - inPrice) * 100 / inPrice, 2)
        del newPricesIn[-1]["close"]
        
    return newPricesIn

    # preprocess filter
    # PERatio > 10 / Sector = 'TECHNOLOGY'
    # => WHERE "PERatio" > 10 / WHERE "Sector" = 'TECHNOLOGY'
    # custom filter must be seperated by spaces
#    formated_filter = []
#    i = 0
#    while(i < len(filter)):
#        column, symbol = filter[i], filter[i+1]
#        elements = column.split(" ")
#        column = ""
#        for j in range(len(elements)):
#            if elements[j].isnumeric(): #pure number
#                column += elements[j]
#            elif elements[j].isalnum(): #number mix alphabets or pure alphabets
#                column += '"{}"'.format(elements[j])
#            else: #all alphabet,
#                column += elements[j]  #colum =close
#            if j != len(elements)-1:
#                column += " "
#        if symbol.lower() == "between":
#            value1, value2 = filter[i+2], filter[i+3]
#            formated_filter.append('{} {} {} AND {}'.format(column, symbol, value1, value2))
#            i += 4
#        else:
#            value = filter[i+2]
#            if symbol == "=" :
#                value = "'{}'".format(value)
#            formated_filter.append('{} {} {}'.format(column, symbol, value))
#            i += 3
#
#    print(formated_filter)
#        inPrice = pricesIn[i]["close"]
#        if(pricesIn[i]["symbol"] not in symbolToIndexOut):
#            newPricesIn[-1]["profit"] = 0.0
#            continue
#        outPrice = pricesOut[symbolToIndexOut[pricesIn[i]["symbol"]]]["close"]
#
#        newPricesIn[-1]["profit"] = (outPrice - inPrice) / inPrice
#
#    return newPricesIn

    # preprocess filter
    # PERatio > 10 / Sector = 'TECHNOLOGY'
    # => WHERE "PERatio" > 10 / WHERE "Sector" = 'TECHNOLOGY'
    # custom filter must be seperated by spaces
#    formated_filter = []
#    i = 0
#    while(i < len(filter)):
#        column, symbol = filter[i], filter[i+1]
#        elements = column.split(" ")
#        column = ""
#        for j in range(len(elements)):
#            if elements[j].isnumeric(): #pure number
#                column += elements[j]
#            elif elements[j].isalnum(): #number mix alphabets or pure alphabets
#                column += '"{}"'.format(elements[j])
#            else: #all alphabet,
#                column += elements[j]  #colum =close
#            if j != len(elements)-1:
#                column += " "
#        if symbol.lower() == "between":
#            value1, value2 = filter[i+2], filter[i+3]
#            formated_filter.append('{} {} {} AND {}'.format(column, symbol, value1, value2))
#            i += 4
#        else:
#            value = filter[i+2]
#            if symbol == "=" :
#                value = "'{}'".format(value)
#            formated_filter.append('{} {} {}'.format(column, symbol, value))
#            i += 3
#
#    print(formated_filter)
