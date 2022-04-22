from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

"""
Portfolio and Portfolio's Stock Schemas
"""
 
################## 
# Portfolio Stocks
##################

class PortfolioStockBase(BaseModel):
    stockSymbol: Optional[str] = None
    addDate: Optional[datetime] = None
    portfolioId: Optional[int] = None

class PortfolioStockCreate(PortfolioStockBase):
    stockSymbol: str
    portfolioId: int
    
class PortfolioStock(PortfolioStockBase):
    
    class Config:
        orm_mode = True
        
################## 
# Portfolio
##################

class PortfolioBase(BaseModel):
    portfolioName: Optional[str] = None


class PortfolioCreate(PortfolioBase):
    ownerId: int
    portfolioName: str

class PortfolioUpdate(PortfolioBase):
    portfolioName: Optional[str] = None
    
class PortfolioWithStocks(PortfolioBase):
    id: Optional[int] = None
    createDate: Optional[datetime] = None
    stocks: Optional[List[PortfolioStock]] = []
    
    class Config:
        orm_mode = True
        
class Portfolio(PortfolioBase):
    id: Optional[int] = None
    createDate: Optional[datetime] = None
    
    class Config:
        orm_mode = True