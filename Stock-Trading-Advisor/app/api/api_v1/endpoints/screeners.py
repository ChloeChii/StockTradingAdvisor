from typing import Any, List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps

router = APIRouter()

@router.get("/prices_by_date", response_model=List[schemas.Price])
def get_price_by_date(
    db: Session = Depends(deps.get_db),
    date: date = date(2021, 8, 9),
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
    date: date = date(2021, 8, 10),
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
            else:
                column += elements[j]
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