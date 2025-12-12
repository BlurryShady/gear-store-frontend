
# e-Commerce Gear Store 

Frontend web application for the Gear Store project.

---

 **Live site:** [store.blurryshady.dev](https://store.blurryshady.dev)

---

## About the Project

Gear Store Web is a modern, responsive e-commerce frontend built with **React** and **Vite**, designed to consume a production-ready Django REST API.

**Key Features:**

-  Product listing & detail pages
-  Category filtering
-  Shopping cart functionality
-  Order creation flow (no real payments)
-  API-driven data rendering
-  Clean UI with modern styling

>  **No authentication or payment gateway by design.**
> The goal is to showcase full-stack integration and frontend engineering skills.

---

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- JavaScript (ES6+)
- [Tailwind CSS](https://tailwindcss.com/)
- Context API (state management)
- REST API integration
- API consumption via environment-based configuration


**Backend:**
- Django REST Framework (deployed separately on Render)

---

## Project Structure

```text
frontend/
├── public/               # Static assets (icons, preview)
├── src/
│   ├── api/              # API client & requests
│   ├── assets/           # Images & static UI assets
│   ├── components/       # Reusable UI components
│   ├── context/          # Cart context & global state
│   ├── pages/            # Page-level components
│   ├── utils/            # Helpers & utilities
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Environment Variables

This project uses [Vite environment variables](https://vitejs.dev/guide/env-and-mode.html).

1. Copy `.env.example` to `.env` in the `frontend/` directory.
2. Set your API URL:

```env
VITE_API_URL=https://gear-store-api.onrender.com
```

>  `.env` files are **not committed**. In production, the variable is configured via Netlify environment settings.

---

## Local Development

```bash
npm install
npm run dev
```

The app will run at: [http://localhost:5173](http://localhost:5173)

> Make sure the backend API is running or reachable.

---

## Backend Integration

The frontend consumes a live REST API deployed on Render.

**Example endpoints:**

- `/api/products/`
- `/api/products/:slug/`
- `/api/categories/`
- `/api/orders/`

All API requests are made via:

```js
import.meta.env.VITE_API_URL
```

This allows seamless switching between local and production APIs.

---

## Deployment (Netlify)

**Build command:**

```bash
npm run build
```

**Publish directory:**

```
dist
```

**Environment variable set in Netlify:**

```env
VITE_API_URL=https://gear-store-api.onrender.com
```

**Custom domain:**

```
store.blurryshady.dev
```

---

## Not Included

- Authentication
- User accounts
- Payment processing

Orders are created for demonstration purposes only.

> Focus is on frontend logic, API usage, and UI quality.

---

## Author

Built by **Blurry Shady** as part of a full-stack developer portfolio. The backend API for this project is available as a separate repository on my profile.
