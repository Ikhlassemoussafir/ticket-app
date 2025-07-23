import pyodbc
import os

def get_connection():
    server = os.getenv('DB_SERVER', 'host.docker.internal')
    database = os.getenv('DB_NAME', 'TicketDB')
    username = os.getenv('DB_USER', 'sa')
    password = os.getenv('DB_PASSWORD', 'ikhlasse')
    driver = '{ODBC Driver 17 for SQL Server}'

    conn_str = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
    return pyodbc.connect(conn_str)
