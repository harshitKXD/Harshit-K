import { z } from "zod";
import { eq, sql, desc } from "drizzle-orm";
import { createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { toys, orders } from "@db/schema";

export const adminRouter = createRouter({
  toy: createRouter({
    list: adminQuery
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        }).optional()
      )
      .query(async ({ input }) => {
        const db = getDb();
        const params = input || { limit: 50, offset: 0 };
        
        const items = await db
          .select()
          .from(toys)
          .limit(params.limit)
          .offset(params.offset)
          .orderBy(desc(toys.createdAt));

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(toys);

        return { items, total: countResult[0]?.count || 0 };
      }),

    create: adminQuery
      .input(
        z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().min(1),
          price: z.string().min(1),
          comparePrice: z.string().optional(),
          imageUrl: z.string().min(1),
          hoverImageUrl: z.string().optional(),
          categoryId: z.number().optional(),
          featured: z.boolean().default(false),
          inStock: z.boolean().default(true),
          ageRange: z.string().optional(),
          material: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const result = await db.insert(toys).values(input).$returningId();
        const toy = await db.select().from(toys).where(eq(toys.id, result[0].id)).limit(1);
        return toy[0];
      }),

    update: adminQuery
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          comparePrice: z.string().optional(),
          imageUrl: z.string().optional(),
          hoverImageUrl: z.string().optional(),
          categoryId: z.number().optional(),
          featured: z.boolean().optional(),
          inStock: z.boolean().optional(),
          ageRange: z.string().optional(),
          material: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const { id, ...data } = input;
        await db
          .update(toys)
          .set(data)
          .where(eq(toys.id, id));
        const toy = await db.select().from(toys).where(eq(toys.id, id)).limit(1);
        return toy[0];
      }),

    delete: adminQuery
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.delete(toys).where(eq(toys.id, input.id));
        return { success: true };
      }),
  }),

  order: createRouter({
    list: adminQuery
      .input(
        z.object({
          status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]).optional(),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        }).optional()
      )
      .query(async ({ input }) => {
        const db = getDb();
        const params = input || { limit: 50, offset: 0 };

        let query = db.select().from(orders);
        
        if (params.status) {
          query = query.where(eq(orders.status, params.status)) as typeof query;
        }

        const items = await query
          .limit(params.limit)
          .offset(params.offset)
          .orderBy(desc(orders.createdAt));

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(orders);

        return { items, total: countResult[0]?.count || 0 };
      }),

    updateStatus: adminQuery
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        await db
          .update(orders)
          .set({ status: input.status })
          .where(eq(orders.id, input.orderId));
        const order = await db.select().from(orders).where(eq(orders.id, input.orderId)).limit(1);
        return order[0];
      }),
  }),

  stats: adminQuery.query(async () => {
    const db = getDb();

    const totalSalesResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` })
      .from(orders)
      .where(eq(orders.status, "paid"));

    const totalOrdersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    const totalToysResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(toys);

    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    return {
      totalSales: Number(totalSalesResult[0]?.total || 0),
      totalOrders: totalOrdersResult[0]?.count || 0,
      totalToys: totalToysResult[0]?.count || 0,
      recentOrders,
    };
  }),
});
