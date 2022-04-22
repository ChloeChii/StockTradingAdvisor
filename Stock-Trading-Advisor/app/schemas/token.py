from typing import Optional

from pydantic import BaseModel

"""
JWT Token Schemas
"""

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None