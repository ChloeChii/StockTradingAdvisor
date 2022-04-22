from typing import List, Any
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.filter import Filter
# from app.models.filter import Category


class CRUDItem(CRUDBase[Filter, Any, Any]):
    """
    Filter CRUD class
    """
    def get_filter_all(
        self, db: Session) -> List[Filter]:
        cur = db.execute('SELECT * FROM filter')
        return (
            cur.all()
        )
    def get_category_by_filter(
        self, db: Session, filter: str) -> Any:
        cur = db.execute('SELECT * FROM filter_category \
            WHERE filter_name={}'.format( "'{}'".format(filter)))
        return (
            cur.all()
        )
filter = CRUDItem(Filter)

