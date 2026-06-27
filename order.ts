import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { cartItems, toys } from "@db/schema";
import { TRPCError } from "@trpc/server";

export const cartRouter = createRouter({
  get: publicQuery.query(async ({ ctx }) => {
    const db = getDb();
    const sessionId = ctx.sessionId;
    
    if (!sessionId) {
      return { items: [], total: 0 };
    }

    const items = await db
      .select({
        id: cartItems.id,
        sessionId: cartItems.sessionId,
        toyId: cartItems.toyId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        toyName: toys.name,
        toySlug: toys.slug,
        toyPrice: toys.price,
        toyImageUrl: toys.imageUrl,
        toyInStock: toys.inStock,
      })
      .from(cartItems)
      .innerJoin(toys, eq(cartItems.toyId, toys.id))
      .where(eq(cartItems.sessionId, sessionId));

    const total = items.reduce((sum, item) => {
      return sum + Number(item.toyPrice) * item.quantity;
    }, 0);

    return { items, total: Number(total.toFixed(2)) };
  }),

  add: publicQuery
    .input(
      z.object({
        toyId: z.number(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const sessionId = ctx.sessionId;

      if (!sessionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session ID required",
        });
      }

      // Check if item already in cart
      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.sessionId, sessionId),
            eq(cartItems.toyId, input.toyId)
          )
        )
        .limit(1);

      if (existing[0]) {
        const newQuantity = existing[0].quantity + input.quantity;
        await db
          .update(cartItems)
          .set({ quantity: newQuantity })
          .where(eq(cartItems.id, existing[0].id));
        return { ...existing[0], quantity: newQuantity };
      }

      const result = await db.insert(cartItems).values({
        sessionId,
        toyId: input.toyId,
        quantity: input.quantity,
      }).$returningId();

      return { id: result[0].id, sessionId, toyId: input.toyId, quantity: input.quantity };
    }),

  update: publicQuery
    .input(
      z.object({
        itemId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const sessionId = ctx.sessionId;

      if (!sessionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session ID required",
        });
      }

      await db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(
          and(
            eq(cartItems.id, input.itemId),
            eq(cartItems.sessionId, sessionId)
          )
        );

      return { id: input.itemId, quantity: input.quantity };
    }),

  remove: publicQuery
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const sessionId = ctx.sessionId;

      if (!sessionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session ID required",
        });
      }

      await db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.id, input.itemId),
            eq(cartItems.sessionId, sessionId)
          )
        );

      return { success: true };
    }),

  clear: publicQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const sessionId = ctx.sessionId;

    if (!sessionId) {
      return { success: true };
    }

    await db
      .delete(cartItems)
      .where(eq(cartItems.sessionId, sessionId));

    return { success: true };
  }),
});
