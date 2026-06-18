from pymongo import MongoClient
import os

class Database:
    _client = None
    _db = None

    @classmethod
    def initialize(cls, uri):
        if cls._client is None:
            cls._client = MongoClient(uri)
            # Extract database name from URI or use default
            db_name = uri.split('/')[-1] if '/' in uri else 'docvault'
            cls._db = cls._client[db_name]
        return cls._db

    @classmethod
    def get_db(cls):
        if cls._db is None:
            # Fallback to env var if not initialized via create_app
            uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/docvault')
            cls.initialize(uri)
        return cls._db
