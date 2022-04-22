from typing import Optional
from pydantic import BaseModel

"""
Account Schemas
"""

class AccountBase(BaseModel):
    username: Optional[str] = None

class AccountCreate(AccountBase):
    username: str
    password: str

class AccountUpdate(AccountBase):
    password: Optional[str] = None
    
class Account(AccountBase):
    id: Optional[int] = None
    
    class Config:
        orm_mode = True
        