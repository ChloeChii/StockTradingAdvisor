from datetime import date
from typing import Any, List

from app import crud, schemas
from app.api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()

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
    # preprocess filter
    # PERatio > 10 / Sector = 'TECHNOLOGY' 
    # => WHERE "PERatio" > 10 / WHERE "Sector" = 'TECHNOLOGY'
    # custom filter must be seperated by spaces
    formated_filter = []
    i = 0
    while(i < len(filter)):
        column, symbol = filter[i], filter[i+1]
        elements = column.split(" ")
        column = "" 
        for j in range(len(elements)):
            if elements[j].isnumeric(): #pure number
                column += elements[j]
            elif elements[j].isalnum(): #number mix alphabets or pure alphabets
                column += '"{}"'.format(elements[j])
            else: #all alphabet, 
                column += elements[j]  #colum =close
            if j != len(elements)-1:
                column += " " 
        if symbol.lower() == "between":
            value1, value2 = filter[i+2], filter[i+3]
            formated_filter.append('{} {} {} AND {}'.format(column, symbol, value1, value2))
            i += 4
        else:
            value = filter[i+2]
            if symbol == "=" :
                value = "'{}'".format(value)
            formated_filter.append('{} {} {}'.format(column, symbol, value))
            i += 3
    print(formated_filter)    
    prices = crud.price.get_prices_by_filter(db=db, date=date, filter=formated_filter, sortby=sortby, order=order)
    return prices


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


@router.post("/backtest", response_model=List[schemas.BacktestPrice])
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
    # preprocess filter
    # PERatio > 10 / Sector = 'TECHNOLOGY'
    # => WHERE "PERatio" > 10 / WHERE "Sector" = 'TECHNOLOGY'
    # custom filter must be seperated by spaces
    formated_filter = []
    i = 0
    while(i < len(filter)):
        column, symbol = filter[i], filter[i+1]
        elements = column.split(" ")
        column = ""
        for j in range(len(elements)):
            if elements[j].isnumeric(): #pure number
                column += elements[j]
            elif elements[j].isalnum(): #number mix alphabets or pure alphabets
                column += '"{}"'.format(elements[j])
            else: #all alphabet,
                column += elements[j]  #colum =close
            if j != len(elements)-1:
                column += " "
        if symbol.lower() == "between":
            value1, value2 = filter[i+2], filter[i+3]
            formated_filter.append('{} {} {} AND {}'.format(column, symbol, value1, value2))
            i += 4
        else:
            value = filter[i+2]
            if symbol == "=" :
                value = "'{}'".format(value)
            formated_filter.append('{} {} {}'.format(column, symbol, value))
            i += 3
            
    print(formated_filter)
    
    pricesIn = crud.price.get_prices_by_filter(db=db, date=dateIn, filter=formated_filter, sortby=sortby, order=order)
    pricesOut = crud.price.get_prices_by_date(db=db, date=dateOut, sortby=sortby, order=order)
    
    symbolToIndexOut = {}
    for i in range(len(pricesOut)):
        symbolToIndexOut[pricesOut[i]["symbol"]] = i
    
    newPricesIn = []
    for i in range(len(pricesIn)):
        d = dict(pricesIn[i])
        newPricesIn.append(d)
        
        inPrice = pricesIn[i]["adjusted_close"]
        if(pricesIn[i]["symbol"] not in symbolToIndexOut):
            newPricesIn[-1]["profit"] = 0.0
            continue
        outPrice = pricesOut[symbolToIndexOut[pricesIn[i]["symbol"]]]["adjusted_close"]
                
        newPricesIn[-1]["profit"] = (outPrice - inPrice) / inPrice
    
    return newPricesIn
