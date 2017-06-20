from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = '10.163.100.96'
MONGODB_PORT = 27017
DBS_NAME = 'test'
COLLECTION_NAME = 'diabetes'
FIELDS = {'PATIENT_NUM': True, 'SEX_CD':True, 'NAME_CHAR':True, 'AGE_IN_YEARS_NUM':True, 'START_DATE':True, 'END_DATE': True, 'RACE_CD':True, '_id':False}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/test/diabetes")
def donorschoose_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS, limit=100000)
    #projects = collection.find(projection=FIELDS)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)