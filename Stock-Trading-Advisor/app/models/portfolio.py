from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

"""
Portfolio and Portfolio's Stock ORM model
"""

class Portfolio(Base):
    __tablename__ = "portfolio"
    
    id = Column(Integer, primary_key=True, index=True)
    portfolioName = Column(String, index=True)
    createDate = Column(DateTime, server_default=func.now())
    
    ownerId = Column(Integer, ForeignKey("account.id"), nullable=False, index=True)
    owner = relationship("Account", back_populates="portfolios")
    stocks = relationship("PortfolioStock", back_populates="owner", cascade="all, delete-orphan")
    
class PortfolioStock(Base):
    __tablename__ = "portfolio_stock"
    
    stockSymbol = Column(String, primary_key=True, index=True)
    addDate = Column(DateTime, server_default=func.now())
    
    portfolioId = Column(Integer, ForeignKey("portfolio.id"), primary_key=True, index=True)
    owner = relationship("Portfolio", back_populates="stocks")