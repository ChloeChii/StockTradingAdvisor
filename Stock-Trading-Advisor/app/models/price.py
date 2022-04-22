from xmlrpc.client import DateTime
from sqlalchemy import Column, Integer, String, Date, Float
from sqlalchemy.orm import relationship

from app.db.base_class import Base

"""
Price ORM model(Unused)
"""

class Price(Base):
    timestamp = Column(Date, primary_key=True)
    symbol = Column(String, primary_key=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    adjusted_close = Column(Float)
    volume = Column(Float)
    dividend_amount = Column(Float)
    split_coefficient = Column(Float)