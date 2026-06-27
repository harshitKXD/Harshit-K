import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { orders, orderItems, cartItems, toys } from "@db/schema";
import { TRPCError } from "@trpc/server";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        customerEmail: z.string().email(),
        customerName: z.string().min(1),
        shippingAddress: z.object({
          line1: z.string(),
          line2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        sessionId: z.string(),
        paymentIntentId: z.string(),
        totalAmount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Get cart items for this session
      const cart = await db
        .select({
          cartItemId: cartItems.id,
          toyId: cartItems.toyId,
          quantity: cartItems.quantity,
        })
        .from(cartItems)
        .where(eq(cartItems.sessionId, input.sessionId));

      if (cart.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty",
        });
      }

      // Create order
      const orderResult = await db.insert(orders).values({
        stripePaymentIntentId: input.paymentIntentId,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        shippingAddress: input.shippingAddress,
        totalAmount: String(input.totalAmount),
        status: "pending",
      }).$returningId();

      const orderId = orderResult[0].id;

      // Create order items
      for (const item of cart) {
        const toy = await db
          .select()
          .from(toys)
          .where(eq(toys.id, item.toyId))
          .limit(1);

        if (toy[0]) {
          await db.insert(orderItems).values({
            orderId,
            toyId: item.toyId,
            toyName: toy[0].name,
            toyImageUrl: toy[0].imageUrl,
            quantity: item.quantity,
            unitPrice: toy[0].price,
          });
        }
      }

      // Clear cart
      await db
        .delete(cartItems)
        .where(eq(cartItems.sessionId, input.sessionId));

      return { orderId };
    }),

  getByPaymentIntent: publicQuery
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.stripePaymentIntentId, input.paymentIntentId))
        .limit(1);

      if (!result[0]) return null;

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, result[0].id));

      return { ...result[0], items };
    }),
});
