from genericpath import exists
import os
from envReader import read
from top2vec import Top2Vec
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.datasets import fetch_20newsgroups
import pathlib

model_path = str(pathlib.Path(__file__).parent.resolve()) + '/files/data/vector_search_model'
data_path = str(pathlib.Path(__file__).parent.resolve()) + '/files/training_data/vector_search_data.txt'

model = ''
prevDocuments = []

def initVectorSearch():
    if exists(model_path):
        global model
        model = Top2Vec.load(model_path)
    else:
        trainModel(documents=[])



def trainModel(documents, addDefault: bool = True):
    global model
    global prevDocuments
    #avoid re-training model with same documents
    if documents == prevDocuments or (addDefault == False and len(documents) == 0):
        return

    if addDefault==True:
        dD = []
        with open(data_path) as f:
            dD = f.readlines()
        
        dD = [x.strip() for x in documents]
        while("" in documents) :
            dD.remove("")
        
        for x in dD:
            documents.append(x)
        
    model = Top2Vec(documents=documents, speed='learn', workers=8, min_count=2)
    if exists(model_path):
        os.remove(model_path)
        
    model.save(model_path)
    prevDocuments = documents

def getNumberOfTpocis() -> int:
    if (model == ''):
        return 0

    return model.get_num_topics()

'''
model = Top2Vec.load('model_name')
print('model loaded')

documents = []
with open(os.getcwd() + '/documents.txt') as f:
    documents = f.readlines();

print('length:', len(documents))
model = Top2Vec(documents=documents, speed='learn', workers=8, min_count=2)

model.save('model_name')
topic_words, word_scores, topic_scores, topic_nums = model.search_topics(keywords=["earth"], num_topics=1)
documents, document_scores, document_ids = model.search_documents_by_topic(topic_num=1, num_docs=2)
for doc, score, doc_id in zip(documents, document_scores, document_ids):
    print(f"Document: {doc_id}, Score: {score}")
    print("-----------")
    print(doc)
    print("-----------")
    print()
documents, document_scores, document_ids = model.search_documents_by_keywords(keywords=["earth", "ocean"], num_docs=2)
for doc, score, doc_id in zip(documents, document_scores, document_ids):
    print(f"Document: {doc_id}, Score: {score}")
    print("-----------")
    print(doc)
    print("-----------")
    print()
words, word_scores = model.similar_words(keywords=["space"], keywords_neg=[], num_words=20)
for word, score in zip(words, word_scores):
    print(f"{word} {score}")
    
#model = Top2Vec.locad('model_name')
'''