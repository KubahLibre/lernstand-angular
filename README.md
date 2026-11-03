# Lernstand — Angular frontend for the Lernstand API

My second take on the database website: same backend
(FastAPI + PostgreSQL, see the repo `api-postgres`), but the
frontend is now built with Angular — components instead of
hand-training every element in plain HTML/CSS/JavaScript.

## What the UI does

- Shows topics from the database as cards (title, status, category, note)
- Creates new topics (POST), edits them (PUT) and deletes them (DELETE with confirmation)
- Changes the status per card, filters the list by status
- Manages categories (create/delete) — the server rejects duplicates
  and categories still in use (409), and the UI displays those responses

## Getting started (two services)

Backend (port 8001, in the api-postgres repo):

    docker compose up -d --build

Frontend (port 4200, in this repo):

    npm install
    ng serve

Browser: http://localhost:4200

## Why CORS in the backend?

Angular (:4200) and FastAPI (:8001) are different origins as far as
the browser is concerned, so the backend explicitly allows :4200
(CORSMiddleware in asgi.py).

## The learning path in the commit history

Read from the bottom up: types + service → first list → create (POST)
→ filter + status change (PUT) → edit/delete → error banner
→ category management → CSS. One commit per layer.