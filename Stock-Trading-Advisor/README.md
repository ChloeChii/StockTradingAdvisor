# Stock Trading Advisor Backend

## Requirements

**Note!! You should have a running postgre SQL server before run this backend.** 

When you are ready:

**Docker**
1. Modify the values in `.env` to link to your database.
2. Then you can build docker image and run it directly.

**Python 3.9**
1. Modify the values in `.env` to link to your database.
2. Install requirements by `pip install -r requirements.txt`.
3. Make sure [uvicorn and fastapi libraries]("https://fastapi.tiangolo.com/tutorial/") are installed.
4. Run the server with `uvicorn app.main:app --reload`
5. You can open your browser and go to `127.0.0.1:8000/docs` to check whether the server is running.

## Folder structure

This folder structure refers to the [Fastapi Official Example]("https://github.com/tiangolo/full-stack-fastapi-postgresql/tree/master/%7B%7Bcookiecutter.project_slug%7D%7D/backend/app/app")

- app - All backend code inside this folder
    - api - Put All API endpoints inside this
        - api_v1 - Separate by version
            - endpoints - Separate by different api routers
            - api.py - Include all routers into a file
        - deps.py - FastAPI dependency
    - core - Put some config and utils files
    - crud - Put Database CRUD operations, if you don't like ORM you can use plain SQL too. For more details, please refers to the screeners API.
    - db - Put Database session settings and configuration.
    - models - SQLAlchemy ORM models
    - schemas - Pydantic schemas

## Main Library
- [FastAPI]("https://fastapi.tiangolo.com/tutorial/") 

