import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  boolean,
  int,
  bigint,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Categories for toys
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;

// Toys / Products
export const toys = mysqlTable("toys", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal("comparePrice", { precision: 10, scale: 2 }),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  hoverImageUrl: varchar("hoverImageUrl", { length: 500 }),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true }).references(() => categories.id),
  featured: boolean("featured").default(false),
  inStock: boolean("inStock").default(true),
  ageRange: varchar("ageRange", { length: 50 }),
  material: varchar("material", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Toy = typeof toys.$inferSelect;

// Cart items for guest users
export const cartItems = mysqlTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  toyId: bigint("toyId", { mode: "number", unsigned: true }).notNull().references(() => toys.id),
  quantity: int("quantity").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CartItem = typeof cartItems.$inferSelect;

// Orders
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
  customerEmail: varchar("customerEmail", { length: 255 }).notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  shippingAddress: json("shippingAddress").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Order = typeof orders.$inferSelect;
export type OrderStatus = Order["status"];

// Order items
export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull().references(() => orders.id),
  toyId: bigint("toyId", { mode: "number", unsigned: true }).notNull().references(() => toys.id),
  toyName: varchar("toyName", { length: 255 }).notNull(),
  toyImageUrl: varchar("toyImageUrl", { length: 500 }).notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
