---
name: Auth/Session setup
description: bcryptjs replaces bcrypt (native addon fails), session config details
---
Use bcryptjs (not bcrypt) — bcrypt's native .node addon is not pre-built in this environment and always fails with MODULE_NOT_FOUND.
Session: express-session + connect-pg-simple; createTableIfMissing: true; SESSION_SECRET env var already set.
**Why:** bcrypt requires pnpm approve-builds and native compilation which doesn't work here.
**How to apply:** Any future auth work should use bcryptjs.
