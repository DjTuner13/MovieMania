from flask import Flask
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Load environment variables from your .env file
load_dotenv()

# Get MongoDB credentials from environment variables in .env file (place in same folder as app.py for now)
username = quote_plus(os.getenv("MONGODB_USERNAME"))
password = quote_plus(os.getenv("MONGODB_PASSWORD"))
host = "cluster0.btmgkac.mongodb.net"
app_name = "Cluster0"

# Constructs the URI
uri = f"mongodb+srv://{username}:{password}@{host}/?appName={app_name}"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# successful connection test for mongoDB
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

#server starting from home / path
@app.route('/')
def hello():
    return 'Welcome To Movie Mania!'

if __name__ == '__main__':
    app.run(debug=True)
