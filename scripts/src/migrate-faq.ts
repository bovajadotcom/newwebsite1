import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

async function migrate() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS faq_items (
      id SERIAL PRIMARY KEY,
      question_en TEXT NOT NULL DEFAULT '',
      question_pl TEXT NOT NULL DEFAULT '',
      question_ru TEXT NOT NULL DEFAULT '',
      question_lt TEXT NOT NULL DEFAULT '',
      answer_en TEXT NOT NULL DEFAULT '',
      answer_pl TEXT NOT NULL DEFAULT '',
      answer_ru TEXT NOT NULL DEFAULT '',
      answer_lt TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  console.log("faq_items table ready.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
