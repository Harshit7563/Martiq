# Martiq

React (Vite) frontend + Node.js (Express) backend for an e‑commerce storefront demo.

## Run locally

### Backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API

- `GET /health`
- `GET /api/categories`
- `GET /api/products`

# Martiq — Modern Fashion Ecommerce (Product-First)

Inspired by Banana Club’s clean aesthetic, but **not banner-heavy**. The homepage focuses on **more products visible** with Men/Women tabs, category chips, and multiple product sections.

## Tech

- **Frontend**: React + Vite + Tailwind v4
- **Backend**: Node.js + Express
- **DB**: PostgreSQL

## Run locally

### 1) Database

Create a database (example `martiq`) and set `DATABASE_URL` in `backend/.env`.
On macOS, avoid hardcoding a `postgres` role unless you created it—`postgres://localhost:5432/martiq` is usually the easiest default.

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Run schema + seed:

```bash
npm run db:setup -w backend
```

### 2) Start backend

```bash
npm run dev -w backend
```

Backend runs on `http://localhost:4000`.

### 3) Start frontend

```bash
npm run dev -w frontend
```

Frontend runs on `http://localhost:5173`.

## Homepage features

- Sticky navbar with search, wishlist, cart, login icon
- Men/Women tabs + horizontal category filter chips
- Dense product grid: **4 per row desktop**, **2 per row mobile**
- Sections: New Arrivals, Best Sellers, Men’s, Women’s, Trending, Offers, Recently viewed
- Product cards: image, name, price + discount, rating, wishlist, quick add, sizes on hover

