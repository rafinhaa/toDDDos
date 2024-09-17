import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { randomUUID } from "node:crypto"

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const tasks = pgTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text("title").notNull(),
  status: integer("status").notNull().default(0),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
})
