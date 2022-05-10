import os
from envReader import read, getValue
from postgres import initPostgres
from vector_search import initVectorSearch
from server import run_server
import pathlib


read(str(pathlib.Path(__file__).parent.resolve()) + '/files/config/.env.local')
initPostgres()
initVectorSearch()
run_server(int(getValue('PORT')))