import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .default("postgresql://postgres:postgres@localhost:5432/traveloop?schema=public"),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  JWT_ACCESS_SECRET: z
    .string()
    .min(24, "JWT_ACCESS_SECRET must be at least 24 chars")
    .default("dev-access-secret-change-me-please"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(24, "JWT_REFRESH_SECRET must be at least 24 chars")
    .default("dev-refresh-secret-change-me-please"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  COOKIE_DOMAIN: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SMTP_FROM: z.string().email().optional()
});

export const env = envSchema.parse(process.env);
