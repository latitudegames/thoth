import json
import os
from flask import Flask, session, request
from postgres import getDocuments
from vector_search import trainModel, getNumberOfTpocis
from utils import *

def run_server(port):
    app = Flask('thoth')
    
    @app.route('/', methods=['GET', 'POST'])
    def main_page():
        if request.method == 'GET':
            html = read_file(os.getcwd() + '/files/utils/main.html')
            html += '</body></html>'
            return html
        elif request.method =='POST':
            return json.dumps({"status": "not_supported"})
    
    @app.route('/search', methods=['GET', 'POST'])
    def search_page():
        if request.method == 'GET':
            data = request.args.get('query')
            return json.dumps({"status": data})
        elif request.method == 'POST':
            _json = request.get_json()
            data = _json['query']
            return  json.dumps({"status": data})
    
    @app.route('/update_search_model')
    def update_search_model_page():
        if request.method == 'GET':
            documents = getDocuments()
            try:
                trainModel(documents=documents)
                return json.dumbs({"status": "ok"})
            except Exception as e:
                return json.dumps({"status": "error", "message": str(e)})
    
    @app.route('/number_of_topics')
    def get_number_of_topics_page():
        if request.method == 'GET':
            num = getNumberOfTpocis()
            return json.dumps({"status": "ok", "count": num})
    
    app.secret_key = 'KJDFSIJ34534(*%&#)kjfdskfd'
    app.run(host='0.0.0.0', port=port)