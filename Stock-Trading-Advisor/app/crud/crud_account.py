from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


class CRUDUser(CRUDBase[Account, AccountCreate, AccountUpdate]):
    """
    User CRUD class
    """
    def get_by_username(self, db: Session, *, username: str) -> Optional[Account]:
        return db.query(Account).filter(Account.username == username).first()

    def create(self, db: Session, *, obj_in: AccountCreate) -> Account:
        db_obj = Account(
            username=obj_in.username,
            password=get_password_hash(obj_in.password),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


    def authenticate(self, db: Session, *, username: str, password: str) -> Optional[Account]:
        account = self.get_by_username(db, username=username)
        if not account:
            return None
        if not verify_password(password, account.password):
            return None
        return account


account = CRUDUser(Account)