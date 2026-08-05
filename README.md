# Aurum Reserve — Hotel Booking Management System

A full-stack luxury hotel booking experience. Guests can explore a collection of 12 exceptional residences, view signature dining, reserve hotel stays, and arrange protected chauffeur transfers. Authenticated administrators can add and remove properties from the live collection.

## Features

- User Registration
- User Login (JWT Authentication)
- Curated catalogue of 12 seeded luxury hotels with pricing, location, amenities, rating, images, and signature meals
- Hotel stay booking and private chauffeur booking with executive protection detail
- JWT-protected customer account and booking APIs
- Admin studio to add or remove hotels (with protected backend admin endpoints)
- Responsive React interface with API-driven data

## Technologies

### Backend

- Flask
- Flask REST API
- PostgreSQL
- SQLAlchemy
- Marshmallow
- JWT Authentication
- Flask-Migrate

### Frontend

- React
- Vite
- Axios
- React Router

## Project Structure

Hotel_Booking_Management_System/

- `backend/` — Flask, SQLAlchemy, PostgreSQL, JWT API
- `client/` — React/Vite application

## Installation

### Backend

```bash
cd backend
pipenv install

pipenv run flask --app run.py run --debug
```

On first start the API automatically creates a local SQLite database and loads the initial 12 hotels, three chauffeur services, and the administrator account. You can repeat the seed manually with `pipenv run flask --app run.py seed`; it never duplicates the starter catalogue.

The backend reads `DATABASE_URL` and `JWT_SECRET_KEY` from the environment. It uses a local SQLite database by default. To use PostgreSQL, set `DATABASE_URL` before starting the server, for example:

```bash
export DATABASE_URL='postgresql://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost/hotel_db'
```

Set a secure `JWT_SECRET_KEY` and PostgreSQL credentials before deployment.

### Frontend

```bash
cd client
npm install
npm run dev
```

The Vite development server proxies `/api` to the Flask server at `http://127.0.0.1:5000`.

## Deployment

This repository is ready for a Git-connected deployment:

1. In Render, create a new **Blueprint** service from this repository. It reads `render.yaml`, installs the backend dependencies, starts Gunicorn, and seeds the catalogue.
2. In Vercel, import this repository. The included `vercel.json` builds the React client and keeps direct links working.
3. In Vercel's environment variables, set `VITE_API_URL` to the Render service URL (for example, `https://aurum-reserve-api.onrender.com`), then redeploy Vercel.

The Render configuration accepts requests from the Vercel site and generates a production JWT secret. For a long-running deployment, attach a PostgreSQL database in Render and set its `DATABASE_URL` environment variable.

## First administrator

The seed command creates this development-only administrator account:

- Email: `admin@aurumreserve.com`
- Password: `AurumAdmin2026!`

Sign in with it to reveal **Admin studio** in the navigation. Change this account's password and the JWT secret before any deployment.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/hotels`, `GET /api/cars`
- `POST /api/bookings`, `POST /api/car-bookings` (JWT required)
- `GET|POST /api/admin/hotels`, `PATCH|DELETE /api/admin/hotels/:id` (administrator only)

## Author

Abdisalam Abdi
