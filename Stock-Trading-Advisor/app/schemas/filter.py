from pydantic import BaseModel

"""
Filter Schemas
"""
class Filter(BaseModel):
    filter_name: str
    type: str
    table_name: str
    class Config:
        orm_mode = True
        
class Category(BaseModel):
    filter_name: str
    category_value: str