from __future__ import print_function
import sys
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
from flask_jsglue import JSGlue
import urllib
import re


app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'test'
COLLECTION_NAME = 'diabetes'
FIELDS = {'PATIENT_NUM': True, 'SEX_CD':True, 'NAME_CHAR':True, 'AGE_IN_YEARS_NUM':True, 'START_DATE':True, 'END_DATE': True, 'RACE_CD':True, 'CONCEPT_CD_1':True, 'RELIGION_CD':True, 'MARITAL_STATUS_CD': True, '_id':False}


app = Flask(__name__)
jsglue = JSGlue(app)


@app.route("/")
def index():
    return render_template("front_page.html")



@app.route("/dashboard")
def dashboard():

    #respone = donorschoose_projects()

    #print(respone, file=sys.stderr)

    #print(respone)

    return render_template("index.html")


@app.route("/test/diabetes/<string:query>")
def donorschoose_projects(query):

   

    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    #projects = collection.find({"CONCEPT_CD_1" : "ICD9:250.00"})
    #projects = collection.find(projection=FIELDS, limit=100000)




    #result = urllib.parse.unquote(query)

    #print(result, file=sys.stderr)

    #print(query)

    projects = collection.find(json.loads(query))
    #projects = collection.find(query)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

  

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)