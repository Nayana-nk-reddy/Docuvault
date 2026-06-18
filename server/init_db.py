from app import create_app, bcrypt
from app.models.user import User
import os

app = create_app()

def init_db():
    with app.app_context():
        # Check if admin already exists
        admin_email = "admin@docvault.com"
        if User.find_by_email(admin_email):
            print("Admin user already exists.")
            return

        # Create admin user
        User.create_user(
            username="Admin",
            email=admin_email,
            password="adminpassword123",
            role="admin"
        )
        print("Admin user created successfully!")
        print(f"Email: {admin_email}")
        print("Password: adminpassword123")

if __name__ == "__main__":
    init_db()
