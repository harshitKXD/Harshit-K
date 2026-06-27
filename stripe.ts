import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { categories } from "@db/schema";
import { asc } from "drizzle-orm";

export const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));
  }),
});
