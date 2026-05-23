# Amazone Clone

Full-stack Amazon-style storefront: **React (Vite)** frontend, **Django REST** backend, **MySQL** (or SQLite for quick local dev).

## Features

- Home page with hero carousel, category boxes, product deals
- **Sign in / Sign up** (token auth)
- **Add to cart** with hover overlay on products + toast notification
- **Cart** and **Checkout** with payment method picker (UPI, Card, Net Banking, Wallet, COD)
- **Orders** page for logged-in users
- **Product detail** page (`/product/:slug`)
- **Search** with category filters (navbar search bar)
- **Admin panel** (`/admin`) — manage products (staff only) + Django admin link
- Navbar hover effects, sticky header, footer

## Quick start (SQLite — no MySQL needed)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API: `http://127.0.0.1:8000/api/health/`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

## MySQL setup

1. Install MySQL and create a database:

```sql
CREATE DATABASE amazone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy env file and edit credentials:

```bash
cd backend
copy .env.example .env
```

Set in `.env`:

```
DB_ENGINE=mysql
DB_NAME=amazone_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

3. Run migrations:

```bash
python manage.py migrate
python manage.py runserver
```

## Project structure

```
frontend/     React app (Vite)
backend/      Django + DRF API
  api/        Products, orders, auth
```

## API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products/` | Product list |
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Sign in |
| GET/POST | `/api/orders/` | Orders (auth required) |

## Admin panel

Create a staff superuser (one time):

```bash
cd backend
python manage.py createsuperuser
```

Sign in on the site with that account → header shows **Admin** → open `/admin` to add/edit/delete products.

Django built-in admin: `http://127.0.0.1:8000/admin/`

## Demo flow

1. Browse home → hover a product → **Add to cart** (or click for product page)
2. Use **search bar** in header to find products
3. Open **Cart** → **Proceed to checkout** (sign in if needed)
4. Pick payment method → **Pay**
5. View order on **Returns & Orders**

## New routes

| Path | Page |
|------|------|
| `/search?q=...&category=...` | Search results |
| `/product/wireless-headphones` | Product detail |
| `/admin` | Staff admin panel |
