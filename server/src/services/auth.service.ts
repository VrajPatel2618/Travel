import { AuthTokenType } from "@prisma/client";

import { env } from "../config/env";
import { sendTransactionalEmail } from "../lib/email";
import { prisma } from "../lib/prisma";
import {
  hashPassword,
  hashToken,
  issueSession,
  randomToken,
  verifyPassword,
  verifyRefreshToken
} from "../lib/security";
import { ApiError } from "../utils/api-error";

export function sanitizeUser<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

async function createOneTimeToken(userId: string, type: AuthTokenType, ttlMinutes: number) {
  const token = randomToken();
  await prisma.authToken.create({
    data: {
      userId,
      type,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + ttlMinutes * 60_000)
    }
  });
  return token;
}

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ApiError(409, "An account already exists for this email");

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password)
      }
    });

    const emailVerificationToken = await createOneTimeToken(
      user.id,
      "EMAIL_VERIFICATION",
      60 * 24
    );

    await sendTransactionalEmail({
      to: user.email,
      subject: "Verify your Traveloop account",
      previewText: `Verification token: ${emailVerificationToken}`
    });

    return {
      user: sanitizeUser(user),
      session: await issueSession(user),
      emailVerificationToken: env.NODE_ENV === "production" ? undefined : emailVerificationToken
    };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user) throw new ApiError(401, "Invalid email or password");

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid email or password");

    return {
      user: sanitizeUser(user),
      session: await issueSession(user)
    };
  },

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const stored = await prisma.authToken.findUnique({
      where: { tokenHash: hashToken(refreshToken) },
      include: { user: true }
    });

    if (
      !stored ||
      stored.userId !== payload.sub ||
      stored.revokedAt ||
      stored.usedAt ||
      stored.expiresAt < new Date()
    ) {
      throw new ApiError(401, "Invalid refresh token");
    }

    await prisma.authToken.update({
      where: { id: stored.id },
      data: { usedAt: new Date(), revokedAt: new Date() }
    });

    return {
      user: sanitizeUser(stored.user),
      session: await issueSession(stored.user)
    };
  },

  async logout(refreshToken?: string) {
    if (!refreshToken) return;
    await prisma.authToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), type: "REFRESH" },
      data: { revokedAt: new Date() }
    });
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return { resetToken: undefined };

    const resetToken = await createOneTimeToken(user.id, "PASSWORD_RESET", 30);
    await sendTransactionalEmail({
      to: user.email,
      subject: "Reset your Traveloop password",
      previewText: `Reset token: ${resetToken}`
    });

    return { resetToken: env.NODE_ENV === "production" ? undefined : resetToken };
  },

  async resetPassword(input: { token: string; password: string }) {
    const tokenHash = hashToken(input.token);
    const token = await prisma.authToken.findUnique({ where: { tokenHash } });
    if (!token || token.type !== "PASSWORD_RESET" || token.usedAt || token.expiresAt < new Date()) {
      throw new ApiError(400, "Password reset token is invalid or expired");
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: token.userId },
        data: { passwordHash: await hashPassword(input.password) }
      }),
      prisma.authToken.update({
        where: { id: token.id },
        data: { usedAt: new Date() }
      }),
      prisma.authToken.updateMany({
        where: { userId: token.userId, type: "REFRESH", revokedAt: null },
        data: { revokedAt: new Date() }
      })
    ]);
  },

  async verifyEmail(tokenValue: string) {
    const token = await prisma.authToken.findUnique({
      where: { tokenHash: hashToken(tokenValue) }
    });
    if (!token || token.type !== "EMAIL_VERIFICATION" || token.usedAt || token.expiresAt < new Date()) {
      throw new ApiError(400, "Email verification token is invalid or expired");
    }

    const user = await prisma.user.update({
      where: { id: token.userId },
      data: { emailVerifiedAt: new Date() }
    });
    await prisma.authToken.update({ where: { id: token.id }, data: { usedAt: new Date() } });
    return sanitizeUser(user);
  }
};
