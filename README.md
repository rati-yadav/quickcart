# QuickCart

Full-stack e-commerce storefront: **React (Vite)** frontend, **Django REST** backend, **SQLite** database.

# Images 
## Homepage
<img width="1920" height="1080" alt="Screenshot (482)" src="https://github.com/user-attachments/assets/6d18a637-459c-4bea-8d95-06d1a9e6d782" />

## Products 
<img width="1920" height="1080" alt="Screenshot (483)" src="https://github.com/user-attachments/assets/dc53911c-36d4-4d5c-b679-e97fb7016dc7" />

## Cart
<img width="1920" height="1080" alt="Screenshot (486)" src="https://github.com/user-attachments/assets/e9ec4010-85ec-4f78-b6a9-f0207c211573" />

## Orders
<img width="1920" height="1080" alt="Screenshot (485)" src="https://github.com/user-attachments/assets/e82549f3-6203-4e31-80bc-55951da3edba" />


## Features

- Home page with hero carousel, category boxes, product deals
- **Sign in / Sign up** (token authentication)
- **Add to cart** with hover overlay on products + toast notification
- **Cart** and **Checkout** with payment method picker (UPI, Card, Net Banking, Wallet, COD)
- **Orders** page for logged-in users
- **Product detail** page (`/product/:slug`)
- **Search** with category filters (navbar search bar)
- **Admin panel** (`/admin`) — manage products (staff only) + Django admin link
- **Wishlist** feature for authenticated users
- **Image fallback handling** - shows placeholder if images fail to load
- Navbar hover effects, sticky header, footer
- **Multi-language support** (English & Hindi)

## Quick start

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

## Project structure

```
QuickCart/
├── frontend/          React app (Vite)
│   ├── src/
│   │   ├── components/  Reusable UI components (ProductCard, HeroCarousel, etc.)
│   │   ├── pages/       Page components (HomePage, CartPage, etc.)
│   │   ├── context/     React context for auth, cart, wishlist, language
│   │   ├── api/         API client for backend communication
│   │   └── utils/       Utility functions (Razorpay integration)
│   └── package.json
└── backend/           Django + DRF API
    ├── api/           Products, orders, auth, wishlist, addresses
    ├── config/        Django settings and URL configuration
    └── requirements.txt
```

## API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/` | API root with endpoints info |
| GET | `/api/health/` | Health check |
| GET | `/api/products/` | Product list with search/filter |
| GET | `/api/products/:slug/` | Product detail |
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Sign in |
| GET/POST | `/api/orders/` | Orders (auth required) |
| GET/POST | `/api/wishlist/` | Wishlist (auth required) |
| DELETE | `/api/wishlist/:id/` | Remove from wishlist |
| GET/POST | `/api/addresses/` | User addresses (auth required) |
| POST | `/api/payments/razorpay/create/` | Create Razorpay order |
| GET | `/api/payments/razorpay/config/` | Razorpay configuration status |

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
4. Pick payment method → **Pay** (demo mode available for testing)
5. View order on **Returns & Orders**

## New routes

| Path | Page |
|------|------|
| `/search?q=...&category=...` | Search results |
| `/product/wireless-headphones` | Product detail |
| `/admin` | Staff admin panel |
| `/wishlist` | User wishlist |
| `/account` | User account settings |

## Image Handling

The application uses external image URLs (Unsplash) for products and banners. If images fail to load, a fallback placeholder is automatically displayed. This ensures the UI remains functional even if image sources are unavailable.

## Payment Integration

- **Razorpay** integration for real payments (requires API keys in `.env`)
- **Demo mode** available for testing without real payment
- Supports COD, UPI, Card, Net Banking, and Wallet payment methods

## Technology Stack

- **Frontend**: React 18, Vite, React Router, FontAwesome
- **Backend**: Django 5.2, Django REST Framework, Token Authentication
- **Database**: SQLite (default)
- **Payment**: Razorpay (with demo mode)

## Troubleshooting

- **Images not loading**: Check your internet connection (images are loaded from Unsplash CDN)
- **CORS errors**: Ensure backend is running on `http://127.0.0.1:8000`
- **Database errors**: For SQLite, delete `db.sqlite3` and run `python manage.py migrate` again
- **Frontend build errors**: Delete `node_modules` and run `npm install` again
- **Port already in use**: Change the port in `vite.config.js` or kill the process using the port
