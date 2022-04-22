from fastapi import APIRouter
from app.api.api_v1.endpoints import accounts, portfolios, login, screeners

"""
Include all of your routers in this file
"""
api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
# Portfolio is under accounts routes
api_router.include_router(portfolios.router, prefix="/accounts", tags=["portfolios"])
api_router.include_router(screeners.router, prefix="/screeners", tags=["screeners"])
