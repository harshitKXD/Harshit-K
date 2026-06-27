import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { toyRouter } from "./routers/toy";
import { categoryRouter } from "./routers/category";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";
import { stripeRouter } from "./routers/stripe";
import { adminRouter } from "./routers/admin";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  toy: toyRouter,
  category: categoryRouter,
  cart: cartRouter,
  order: orderRouter,
  stripe: stripeRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
