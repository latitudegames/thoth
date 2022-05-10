import psycopg2
import os
from datetime import datetime
from json import dumps
from envReader import getValue

postgres_con = ''
cur = ''

def initPostgres():
    print('initializing postgres')
    postgres_con = psycopg2.connect(host=getValue('PGHOST'), database=getValue('PGDATABASE'), user=getValue('PGUSER'), password=getValue('PGPASSWORD'))
    cur = postgres_con.cursor
    
def getDocuments():
    documents = []

    query = 'SELECT * FROM documents'
    cur.execute(query)
    rows = cur.fetchall()
    for row in rows:
        documents.append(row['1'])

    print(documents)
    return documents