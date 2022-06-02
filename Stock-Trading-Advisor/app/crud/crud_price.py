from typing import Any, List

from app.crud.base import CRUDBase
from app.models.price import Price
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session


class CRUDItem(CRUDBase[Price, Any, Any]):
    """
    Price CRUD class
    """
    def get_prices_by_date(
        self, db: Session, date, sortby, order) -> List[Price]:
        cur = db.execute('SELECT * FROM price \
            WHERE timestamp = {} \
            ORDER BY {} {}'.format( "'{}'".format(date), sortby, order))
        return (
            cur.all()
        )
    
    def get_prices_by_symbol(
        self, db: Session, date, symbol, sortby, order) -> List[Price]:
        cur = db.execute('SELECT * FROM price \
            WHERE symbol = {} and timestamp = {} \
            ORDER BY {} {}'.format(  "'{}'".format(symbol), "'{}'".format(date), sortby, order))
        return (
            cur.all()
        )
        
        
    def get_overview_by_date(
        self, db: Session, date, sortby, order) -> List[Price]:
        cur = db.execute('SELECT * FROM overview')
        return (
            cur.all()
        )
        
    def get_prices_by_filter(
        self, db: Session, date, filter, sortby, order) -> List[Price]:
        cond_sql = ' AND '.join(filter)
        # 0422 add Open,Close,High,Low indices
        # purpose: deal with open/close/high/low price
        filt = filter[0].split()[0]
        # filt2 = filter[0].split()[2]

        if "open" in filt or "close" in filt or "high" in filt or "low" in filt:
            sql = 'SELECT * FROM ( \
            WITH s AS(SELECT * FROM overview) \
            SELECT * FROM price \
            right JOIN s \
            ON price.symbol = s."Symbol" \
            WHERE timestamp = {} \
            ORDER BY {} {} \
            ) as x where {} \
            '.format("'{}'".format(date),  sortby, order, cond_sql)    
        # 0429 JHCHI 
        # purpose: enable EPS / close, two attributes in different table
        # change 13 lines start from next line
        else:
            #sql = 'WITH s AS(SELECT "Symbol" FROM overview WHERE {}) \
            #SELECT * FROM price \
            #right JOIN s \
            #ON price.symbol = s."Symbol" \
            #WHERE timestamp = {} \
            #ORDER BY {} {}'.format(cond_sql, "'{}'".format(date), sortby, order)
            sql = 'WITH s AS(SELECT * FROM overview ) \
            SELECT * FROM price \
            right JOIN s \
            ON price.symbol = s."Symbol" \
            WHERE {} and timestamp = {} \
            ORDER BY {} {}'.format(cond_sql, "'{}'".format(date), sortby, order)

        # print(sql)
        cur = db.execute(sql)
        return (
            cur.all()
        )

price = CRUDItem(Price)
