# Untitled — Simple Task Manager

A small example task manager built with Next.js (app router), Prisma and Tailwind CSS. It provides a minimal UI and API to create, read, update and delete tasks (implemented as "tickets" in the codebase).

This README explains how to run the project locally, where configuration lives, and a short overview of the code structure.

- Tech: Next.js (app router), React, TypeScript, Prisma (PostgreSQL), Tailwind CSS

## Project overview

This repository implements a tiny task manager (tasks = tickets) with:
- A Next.js front-end (app directory) and API routes under `app/api/tickets`.
- A Prisma schema and generated client in `prisma/` and `app/generated/prisma`.
- Basic CRUD for tasks (create, list, read, update, delete) via the API and UI.

Use cases:
- Track tasks/tickets with a title, description and status.
- Simple API endpoints to integrate with other services or tests.

## Requirements

- Node 18+ (or the Node version compatible with Next.js 16)
- npm or pnpm
- A PostgreSQL database (or adjust Prisma to use SQLite for local testing)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Copy or create a `.env` file in the project root and set `DATABASE_URL` to a PostgreSQL connection string. Example (do NOT commit secrets):

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

The repository already includes a `.env` file example (remove or replace any real credentials before committing).

3. Generate the Prisma client

```bash
npx prisma generate
```

4. Apply Prisma migrations (local development)

If you're working locally and want to apply the migrations included in `prisma/migrations`:

```bash
npx prisma migrate dev
```

For a production deployment (apply already-created migrations):

```bash
npx prisma migrate deploy
```

If you prefer not to run migrations and just sync the schema to the database you can use:

```bash
npx prisma db push
```

5. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Available npm scripts

- `npm run dev` — start Next.js in development mode
- `npm run build` — build the app for production
- `npm start` — run the production server (after `npm run build`)
- `npm run lint` — run ESLint

These scripts are defined in `package.json`.

## API

The app exposes simple REST endpoints under `app/api/tickets`:
- `GET /api/tickets` — list tasks
- `POST /api/tickets` — create a task
- `GET /api/tickets/{id}` — read a specific task
- `PUT /api/tickets/{id}` — update a task
- `DELETE /api/tickets/{id}` — delete a task

Use these endpoints from the UI (the `app/tickets` page) or from external clients.

## Project structure (high level)

- `app/` — Next.js app routes, pages and API routes
  - `app/api/tickets` — API handlers for tickets
  - `app/tickets` — UI pages for managing tasks
  - `app/generated/prisma` — generated Prisma client/browser bindings
- `prisma/` — Prisma schema and migrations
- `lib/prisma.ts` — Prisma client instantiation helper
- `public/` — static assets

## Security & secrets

- Do not commit secrets (database credentials, API keys) to version control. The provided `.env` file in this repository is an example; replace it with your own values.
- If you commit to a public repository, consider using environment variables on your deployment platform instead (Vercel, Railway, etc.).

## Development notes & next steps

Some suggestions you might want to implement next:
- Add authentication (who can create/edit tasks).
- Add validation and improved UI for task statuses.
- Add unit and integration tests for API routes.
- Convert to a more feature-rich task model (assignees, due dates, labels).

## Contributing

Small bugs and improvements are welcome. Open a PR that includes a short description and, when relevant, a tiny test.

## License

This repository is provided as-is. Add a license file if you plan to share publicly.


---

If you want, I can also:
- Add a short Getting Started script in `package.json` (e.g. `setup` that runs `npm install && npx prisma generate && npx prisma migrate dev`).
- Add a minimal seed script for demo data.

Tell me which of those you'd like and I will implement it.
