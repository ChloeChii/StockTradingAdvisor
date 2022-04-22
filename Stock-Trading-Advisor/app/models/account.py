from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base

"""
Account ORM model
"""

class Account(Base):
    __tablename__ = 'account'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    
    portfolios = relationship("Portfolio", back_populates="owner")