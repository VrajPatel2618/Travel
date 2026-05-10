import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { User, UserRole } from "@prisma/client";

import { env } from "../config/env";
import { prisma } from "./prisma";

type AccessPayload = {
  sub: string;
  role: UserRole;
  email: string;
};

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function signAccessToken(user: Pick<User, "id" | "role" | "email">) {
  const payload: AccessPayload = {
    sub: user.id,
    role: user.role,
    email: user.email
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN
  } as SignOptions);
}

export async function issueSession(user: Pick<User, "id" | "role" | "email">) {
  const jti = randomToken(18);
  const refreshToken = jwt.sign(
    { sub: user.id, jti },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as SignOptions
  );
  const decoded = jwt.decode(refreshToken) as { exp?: number } | null;

  await prisma.authToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      type: "REFRESH",
      expiresAt: new Date((decoded?.exp ?? Math.floor(Date.now() / 1000) + 2592000) * 1000)
    }
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken
  };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; jti: string };
}
