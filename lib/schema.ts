// @ts-ignore
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  uniqueIndex,
  date,
  decimal,
  integer // Ensure integer is imported from drizzle-orm/pg-core
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    first_name: varchar("first_name"),
    last_name: varchar("last_name"),
    grade_level: varchar("grade_level"),
    location: varchar("location"),
    birthday: date("birthday"),
    gender: varchar("gender"),
    sport: varchar("sport"),
    team: varchar("team"),
    position: varchar("position"),
    number: varchar("number"),
    email: varchar("email").notNull().unique(),
    image: text("image"),
    password: text("password").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("users_unique_idx").on(users.email), // Renamed index for users
    };
  }
);

// Coaches table
export const coaches = pgTable(
  "coaches",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("firstName"),
    lastName: varchar("lastName"),
    email: varchar("email"),
    phoneNumber: varchar("phoneNumber"),
    gender: varchar("gender"),
    location: varchar("location"),
    sport: varchar("sport"),
    clubName: varchar("clubName"),
    qualifications: text("qualifications"),
    expectedCharge: decimal("expectedCharge", { precision: 10, scale: 2 }), // Decimal type with precision and scale
    image: text("image"),
    slug: text("slug"),
    password: text("password").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (coaches) => {
    return {
      uniqueIdx: uniqueIndex("coaches_unique_idx").on(coaches.email), // Renamed index for coaches
    };
  }
);

// Player Evaluation table
export const playerEvaluation = pgTable(
  "player_evaluation",
  {
    id: serial("id").primaryKey(),
    player_id: integer("player_id").notNull(), 
    coach_id: integer("coach_id").notNull(),
    review_title: varchar("review_title").notNull(),
    primary_video_link: text("primary_video_link").notNull(),
    video_link_two: text("video_link_two"),
    video_link_three: text("video_link_three"),
    video_description: text("video_description").notNull(),
    evaluation_status: varchar("evaluation_status").default("Requested").notNull(),
    payment_status: varchar("payment_status"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (playerEvaluation) => {
    return {
      uniqueIdx: uniqueIndex("player_evaluation_unique_idx").on(playerEvaluation.player_id, playerEvaluation.review_title),
    };
  }
);

// Payments table
export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    player_id: varchar("player_id").notNull(),
    coach_id: varchar("coach_id").notNull(),
    evaluation_id: varchar("evaluation_id").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status").notNull(),
    payment_info: text("payment_info"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    description: text("description"),
  },
  (payments) => {
    return {
      uniqueIdx: uniqueIndex("payments_unique_idx").on(payments.player_id, payments.coach_id, payments.evaluation_id),
    };
  }
);

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  sessionToken: text('session_token').notNull().unique(),
  userId: serial('user_id').notNull(),
  expires: timestamp('expires').notNull(),
});
