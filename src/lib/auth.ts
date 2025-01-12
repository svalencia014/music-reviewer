import { prisma } from "./db";
import type { User, Session } from '@prisma/client';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import type { RequestEvent } from "@sveltejs/kit";
import { sha256 } from "@oslojs/crypto/sha2";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }
  await prisma.session.create({
    data: session
  })
  return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId
    },
    include: {
      user: true
    }
  });
  if (result === null) {
    return { session: null, user: null };
  }
  const { user, ...session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({
      where: {
        id: sessionId
      }
    })
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: {
      id: sessionId
    }
  })
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
  event.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    expires: expiresAt,
    path: "/"
  })
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
  event.cookies.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  })
}

export type SessionValidationResult = 
  | { session: Session; user: User }
  | { session: null; user: null };

