import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from .extensions import bcrypt, db, jwt, ma, migrate

load_dotenv()


def create_app():
    app = Flask(__name__)

    # App configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "sqlite:///hotel_booking.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "change-this-secret-before-production"
    )

    # CORS configuration
    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    frontend_url,
                    "http://127.0.0.1:5173"
                ]
            }
        },
        supports_credentials=True,
    )

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)

    # Register models and routes
    from . import models
    from .routes import api

    app.register_blueprint(api)

    @app.get("/")
    def home():
        return {
            "message": "Aurum Reserve Hotel Booking API is running"
        }

    @app.cli.command("seed")
    def seed_command():
        from .seed import seed_database

        seed_database()
        print("Aurum Reserve catalogue seeded.")

    if os.getenv("AUTO_SEED", "false").lower() == "true":
        with app.app_context():
            from .seed import seed_database

            seed_database()

    return app