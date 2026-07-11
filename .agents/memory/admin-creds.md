---
name: Admin panel credentials
description: Default admin login and how to re-seed
---
Default: username=admin, password=admin123.
Seeded by running: pnpm --filter @workspace/scripts run seed
The seed script truncates all tables and re-inserts everything — do not run on production.
**Why:** Reminder for development resets.
**How to apply:** If DB is wiped, re-run seed.
