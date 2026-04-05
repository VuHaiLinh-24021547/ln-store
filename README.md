# LN Store

Light novel shop front-end built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Product and user data are served from a mock REST API powered by **json-server** and `db.json`.

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended) — includes `npm`

## Setup

```bash
npm install
```

## Running locally

You need **two** terminals: one for the API, one for the Vite dev server.

1. **Mock API** (reads/writes `db.json` on port 3001):

   ```bash
   npm run api
   ```

2. **Web app** (default: [http://localhost:5173](http://localhost:5173)):

   ```bash
   npm run dev
   ```

The dev server proxies `/api` to `http://localhost:3001`, so the storefront and admin UI talk to json-server through `/api/...`.

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm run dev`    | Start Vite dev server                |
| `npm run api`    | Start json-server watching `db.json` |
| `npm run build`  | Typecheck + production build         |
| `npm run preview`| Preview the production build locally |
| `npm run lint`   | Run ESLint                           |

## Main routes

- **Store:** `/` — home, product detail `/product/:id`, cart, checkout, genres, etc.
- **Admin:** `/admin` — dashboard, `/admin/products` (CRUD books), `/admin/customers` (ban/unban users), placeholders for statistics.

## Project layout

- `src/` — React app (pages, components, cart context, API clients)
- `db.json` — mock database (products, genres, users)
- `vite.config.ts` — `/api` proxy to json-server

## License

Private / educational use.
