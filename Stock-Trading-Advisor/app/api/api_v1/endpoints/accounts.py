from telnetlib import STATUS
from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException, status
from app import crud, models, schemas
from app.api import deps

from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/signup")
def sign_up(
    *,
    db: Session = Depends(deps.get_db),
    username: str = Body(...),
    password: str = Body(...),
    ) -> Any:
    """
    Sign up new account.
    """
    account = crud.account.get_by_username(db, username=username)
    if account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The account with this username already exists in the system.",
        )
        
    account_in = schemas.AccountCreate(username=username, password=password)
    print(account_in)
    account = crud.account.create(db, obj_in=account_in)
    return {"success": True}

@router.get("/me", response_model=schemas.Account)
def read_user_me(
    db: Session = Depends(deps.get_db),
    current_account: models.Account = Depends(deps.get_current_account),
) -> Any:
    """
    Get current account. For testing
    """
    return current_account