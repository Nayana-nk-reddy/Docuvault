from datetime import timedelta
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'docvault-dev-secret-key-456'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/docvault'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'docvault-production-ready-super-long-stable-secret-key-for-sha256-security'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max-limit
