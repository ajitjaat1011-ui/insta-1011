import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  profileData: jsonb("profile_data"),
  searchedAt: timestamp("searched_at").defaultNow().notNull(),
});

export const analysisCache = pgTable("analysis_cache", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  profileData: jsonb("profile_data"),
  analysisData: jsonb("analysis_data"),
  cachedAt: timestamp("cached_at").defaultNow().notNull(),
  hitCount: integer("hit_count").default(1),
});
