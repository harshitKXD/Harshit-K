import { z } from "zod";
import Stripe from "stripe";
import { createRouter, publicQuery } from "../middleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia",
});

export const stripeRouter = createRouter({
  getPublicKey: publicQuery.query(() => {
    return {
      key: process.env.STRIPE_PUBLISHABLE_KEY || "",
    };
  }),

  createPaymentIntent: publicQuery
    .input(
      z.object({
        amount: z.number().min(1),
        orderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(input.amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: String(input.orderId),
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    }),
});
