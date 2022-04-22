from datetime import date
from pydantic import BaseModel

"""
Price Schemas
"""

class Price(BaseModel):
    timestamp: date
    symbol: str
    open: float
    high: float
    low: float
    close: float
    adjusted_close: float
    volume: float
    dividend_amount: float
    split_coefficient: float
    class Config:
        orm_mode = True
        

# class PriceIn(Price):
#     timestamp: date