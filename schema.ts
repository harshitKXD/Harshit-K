import { relations } from "drizzle-orm";
import { toys, categories, cartItems, orders, orderItems } from "./schema";

export const categoriesRelations = relations(categories, ({ many }) => ({
  toys: many(toys),
}));

export const toysRelations = relations(toys, ({ one, many }) => ({
  category: one(categories, {
    fields: [toys.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  toy: one(toys, {
    fields: [cartItems.toyId],
    references: [toys.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  toy: one(toys, {
    fields: [orderItems.toyId],
    references: [toys.id],
  }),
}));
