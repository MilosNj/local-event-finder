# 🎟 Local Event Finder

A **SEO‑friendly, responsive web app** built with the **T3 Stack** to help users discover local events, concerts, meetups and festivals. Built with TypeScript, Next.js (App Router), tRPC, Prisma and PostgreSQL.

---

## ✨ Quick overview

**Core idea:** searchable, filterable event listings by city with detail pages, a map view, and local favorites (stored in `localStorage`).

**Goals:** portfolio‑ready, deployable to Vercel, good SEO, and clean code with TypeScript end‑to‑end via tRPC.

---

## 🧩 Features

- 📍 City pages: `/events/[city]`
- 🔎 Search & filters: category, date range, price / free
- 🗺 Map view: Leaflet + OpenStreetMap markers for venues
- ❤️ Favorites stored in `localStorage` (no auth)
- ⚡ SEO: server components, `generateMetadata`, OG tags
- 🗄 PostgreSQL + Prisma with seed data
- 🖼 `next/image` for optimized images
- 🧪 Basic unit + E2E test setup (Vitest / Playwright)

---

## 🛠 Tech stack

- **Next.js (App Router)**
- **TypeScript**
- **tRPC** (typed client/server)
- **Prisma** + **PostgreSQL**
- **TailwindCSS**
- **ESLint + Prettier**
- **Leaflet + OpenStreetMap**
- **Vercel** for deployment

---

## 📂 Suggested project structure

```
src/
  app/
    page.tsx                 # Home feed
    events/
      [city]/page.tsx        # City listings
      [city]/[slug]/page.tsx # Event detail
    favorites/page.tsx       # Local favorites
  components/                # EventCard, Filters, Map, Layout...
  server/
    trpc/
      routers/
        events.ts            # events.list, events.bySlug, cities.list
    db.ts                   # Prisma client wrapper
  prisma/
    schema.prisma
    seed.ts
public/
  screenshots/
  images/

```

---

## 🚀 Getting started (dev)

> These commands assume `npm`.

### 1. Clone

```bash
git clone https://github.com/yourusername/local-event-finder.git
cd local-event-finder
```

### 2. Install

```bash
npm install
```

### 3. Environment

Create a `.env` file in the repo root (example values):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/local_event_finder"
NEXT_PUBLIC_APP_NAME="Local Event Finder"
# Add other env vars you need (e.g. analytics keys). Leaflet+OSM needs no key.
```

### 4. Start Postgres (quick with Docker)

Simple `docker run`:

```bash
docker run --name event-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=local_event_finder -p 5432:5432 -d postgres:15
```

Or using `docker-compose.yml`:

```yaml
version: "3.8"
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: local_event_finder
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

### 5. Prisma migrations & seed

```bash
npm run prisma migrate dev --name init
npm run prisma db seed
```

> `prisma/seed.ts` should create \~30 realistic events across multiple cities so the UI looks full.

### 6. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄 Seeding

Place a `prisma/seed.ts` that creates venues and events (with different dates/categories/cities). Use `faker` or handcrafted data. Seed should include images (local `public/images/` or remote image URLs) so UI looks polished.

---

## 🧪 Tests

- Unit tests: Vitest or Jest for components and helper functions
- E2E: Playwright for a smoke flow: search → open event → favorite

Example commands (adjust to your scripts):

```bash
npm run test
npm run test:e2e
```

---

## 📦 Deployment (Vercel)

1. Push to GitHub.

2. Create a new project in Vercel and connect the repo.

3. Add `DATABASE_URL` to Vercel Environment Variables.

4. In Vercel build step, ensure Prisma migrations run:
   - Option A: Run migrations during build step with `pnpm prisma migrate deploy`.
   - Option B: Run a separate migration pipeline (recommended for production DB safety).

5. Deploy.

> Note: For preview or production databases, prefer managed Postgres (PlanetScale, Neon, Supabase, Railway) and set proper connection pooling.

---

## 📸 Screenshots

<img width="1440" height="788" alt="image" src="https://github.com/user-attachments/assets/e47dc6da-6252-4050-96f9-19151e440b57" />
<img width="1440" height="790" alt="image" src="https://github.com/user-attachments/assets/f8bdcd91-ed75-4332-92c8-062b9e799408" />
<img width="1440" height="790" alt="image" src="https://github.com/user-attachments/assets/f8db2d62-8b20-457d-9b41-6a4a4a4c17f8" />
![Screen Recording](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXRmdzFvamg2am1idDBlZWhlY2xjMmNxdHRhdWs4dnVlbmVlMjMycCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8dNrliJysUItzR1fbw/giphy.gif)

---

## 🗺 Roadmap / Next steps

- [ ] Admin event creation + moderation
- [ ] Import events from Eventbrite/Ticketmaster
- [ ] i18n (Serbian/English)
- [ ] Dynamic OG images per event
- [ ] Analytics & simple A/B testing

---

## 🏗 Architecture notes

- **Rendering:**
  - City & Home: prefer **SSG** with ISR (`revalidate`) for speed and SEO.
  - Event detail: **SSR** when you want always-fresh details (or SSG + short ISR if content is mostly static).

- **Data flow:** Prisma <-> PostgreSQL, typed tRPC routers, client calls tRPC hooks in React components.
- **Maps:** Leaflet client component — server components cannot access `window`.

---

## 📝 Contributing

If you want to extend this project locally:

1. Fork & clone
2. Follow **Getting started** above
3. Open a branch, add features/tests, open a PR

---

## 🔒 License

This project is licensed under the [MIT License](./LICENSE).

© 2025 Milos Njegovanovic

---
