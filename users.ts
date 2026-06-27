import { z } from "zod";
import { eq, and, like, sql } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { toys, categories } from "@db/schema";

export const toyRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        categorySlug: z.string().optional(),
        featured: z.boolean().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const params = input || {};
      const { categorySlug, featured, search, limit, offset } = {
        categorySlug: undefined,
        featured: undefined,
        search: undefined,
        limit: 20,
        offset: 0,
        ...params,
      };

      const conditions = [];
      
      if (featured !== undefined) {
        conditions.push(eq(toys.featured, featured));
      }
      
      if (search) {
        conditions.push(like(toys.name, `%${search}%`));
      }

      let query = db.select().from(toys);
      
      if (categorySlug) {
        const category = await db.select().from(categories).where(eq(categories.slug, categorySlug)).limit(1);
        if (category[0]) {
          conditions.push(eq(toys.categoryId, category[0].id));
        }
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      
      const items = await query
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(toys)
        .where(whereClause);

      return {
        items,
        total: countResult[0]?.count || 0,
      };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(toys)
        .where(eq(toys.slug, input.slug))
        .limit(1);
      return result[0] || null;
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(toys)
      .where(eq(toys.featured, true))
      .limit(8);
  }),
});
