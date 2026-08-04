import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask

from .extensions import bcrypt, db, jwt, ma, migrate


def create_app():
    app = Flask(__name__)
    # SQLite makes the project work out of the box. Set DATABASE_URL to a
    # PostgreSQL connection string when deploying or when PostgreSQL is ready.
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///hotel_booking.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-this-secret-before-production")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)

    from . import models
    from .routes import api
    app.register_blueprint(api)

    @app.get("/")
    def home():
        return {"message": "Aurum Reserve Hotel Booking API is running"}

    @app.cli.command("seed")
    def seed_command():
        from .seed import seed_database
        seed_database()
        print("Aurum Reserve catalogue seeded.")

    # A fresh project database should be usable as soon as the server starts.
    # The seeder is idempotent, so the development reloader will not duplicate data.
    if os.getenv("AUTO_SEED", "false").lower() == "true":
        with app.app_context():
            from .seed import seed_database
            seed_database()

    return app
