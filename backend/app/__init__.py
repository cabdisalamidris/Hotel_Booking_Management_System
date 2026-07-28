from flask import Flask

from .extensions import (
    db,
    migrate,
    jwt,
    bcrypt,
    ma
)


def create_app():

    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://localhost/hotel_db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "super-secret-key"

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)

    # Import models so Flask-Migrate can detect them
    from . import models

    @app.route("/")
    def home():
        return {
            "message": "Hotel Booking API is running"
        }

    return app