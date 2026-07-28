from .extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(100), unique=True, nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(20), nullable=False, default="customer")

    bookings = db.relationship(
        "Booking",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User {self.username}>"


class Hotel(db.Model):
    __tablename__ = "hotels"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(150), nullable=False)

    location = db.Column(db.String(150), nullable=False)

    description = db.Column(db.Text)

    price_per_night = db.Column(db.Float, nullable=False)

    available_rooms = db.Column(db.Integer, nullable=False, default=0)

    bookings = db.relationship(
        "Booking",
        back_populates="hotel",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Hotel {self.name}>"


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)

    check_in = db.Column(db.Date, nullable=False)

    check_out = db.Column(db.Date, nullable=False)

    number_of_guests = db.Column(db.Integer, nullable=False)

    booking_status = db.Column(
        db.String(20),
        nullable=False,
        default="Pending"
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    hotel_id = db.Column(
        db.Integer,
        db.ForeignKey("hotels.id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="bookings"
    )

    hotel = db.relationship(
        "Hotel",
        back_populates="bookings"
    )

    def __repr__(self):
        return (
            f"<Booking {self.id}: "
            f"User {self.user_id} -> Hotel {self.hotel_id}>"
        )