import os
import secrets
from dotenv import dotenv_values

"""
Configs
"""

config = {
    **dotenv_values(".env"),  # load sensitive variables
}

class DBconfig:
    host = config.get("HOST")
    username = config.get('USERNAME')
    password = config.get('PASSWORD')

class Settings:
    DATABASE_URL = f"postgresql://{DBconfig.username}:{DBconfig.password}@{DBconfig.host}/postgres"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    API_V1_STR: str = "/api/v1"

settings = Settings()