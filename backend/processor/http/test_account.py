# from fastapi.testclient import TestClient
# import pytest
# import decorator
#
# from main import app
#
# from persistence.database import pool_handler
# from . import account
# from config import db_config
#
#
# client = TestClient(app)
#
#
# class DBClient:
#     def __init__(self):
#         pass
#
#     async def __aenter__(self):
#         await pool_handler.initialize(db_config)
#
#     async def __aexit__(self, exc_type, exc_val, exc_tb):
#         await pool_handler.close()
#
#
# @pytest.mark.asyncio
# async def test_search_account():
#     async with DBClient():
#         res = await account.search_account("Amber")
#         print(res)
#         assert type(res) == dict
