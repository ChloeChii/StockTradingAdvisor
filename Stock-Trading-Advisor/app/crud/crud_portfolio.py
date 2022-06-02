from typing import Any, Dict, Optional, Union

import psycopg2
from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.portfolio import Portfolio, PortfolioStock
from app.schemas.portfolio import (PortfolioCreate, PortfolioStockCreate,
                                   PortfolioUpdate)
from psycopg2 import errors
from sqlalchemy.orm import Session

################## 
# Portfolio Stocks
##################

class CRUDPortfolioStock(CRUDBase[PortfolioStock, PortfolioStockCreate, Any]):
    """
    Portfolio's Stock CRUD class
    """
    # Disable update function
    def update(
        self,
        db: Session,
    ) -> None:
        return None
    
    def remove(
        self,
        db: Session,
        portfolioId: int,
        symbol: str,
    ) -> None:
        obj = db.query(self.model).filter(
                    self.model.stockSymbol == symbol,
                    self.model.portfolioId == portfolioId,                 
                ).first()
        db.delete(obj)
        db.commit()
        return obj
    
    
portfolio_stock = CRUDPortfolioStock(PortfolioStock)

################## 
# Portfolio
##################

class CRUDPortfolio(CRUDBase[Portfolio, PortfolioCreate, PortfolioUpdate]):
    """
    Portfolio CRUD class
    """
    def add_stock(self, db: Session, *, portfolio: Portfolio, symbol: str) -> Optional[Portfolio]:
        try:
            stock_to_add = PortfolioStockCreate(stockSymbol=symbol.upper(), portfolioId=portfolio.id)
            add_stock_obj = portfolio_stock.create(db, obj_in=stock_to_add)
            portfolio.stocks.append(add_stock_obj)
            db.commit()
            db.refresh(portfolio)
            return portfolio
        except Exception as err:
            return None

    def remove_stock_by_symbol(self, db: Session, portfolio: Portfolio, symbol: str) -> Optional[Portfolio]:
        try:
            portfolio_stock.remove(db, portfolioId=portfolio.id, symbol=symbol)
            db.commit()
            db.refresh(portfolio)
            return portfolio
        except Exception as err:
            return None
    
    
    def clean_all(self, db: Session, portfolio: Portfolio) -> Optional[Portfolio]:
        portfolio.stocks = []
        db.commit()
        db.refresh(portfolio)
        return portfolio

portfolio = CRUDPortfolio(Portfolio)
