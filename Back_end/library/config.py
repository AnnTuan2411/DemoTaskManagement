import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.environ.get("KEY")
SQLALCHEMY_DATABASE_URI = 'mssql+pyodbc://sa:123@5MVU\\ANHTUAN/EmployeeTask?driver=ODBC+Driver+17+for+SQL+Server'
SQLALCHEMY_TRACK_MODIFICATIONS = False