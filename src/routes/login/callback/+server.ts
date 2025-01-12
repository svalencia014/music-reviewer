import { prisma } from "$lib/db";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/auth";
import type { RequestEvent } from "@sveltejs/kit";
import { type User } from "@prisma/client";
import { google } from "$lib/oauth";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { ObjectParser } from "@pilcrowjs/object-parser";

export async function GET(event: RequestEvent) {
  const storedState = event.cookies.get("google_oauth_state") ?? null;
  const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");

  if (storedState === null || codeVerifier === null || code === null || state === null) {
    return new Response("Please restart the process.", {
      status: 400
    })
  }
  if (storedState !== state) {
    return new Response("Please restart the process.", {
      status: 400
    })
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    return new Response("Please restart the process.", {
      status: 400
    })
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);
  
  const googleId = claimsParser.getString("sub");
  const name = claimsParser.getString("name");
  const email = claimsParser.getString("email");

  await prisma.user.upsert({
    where: {
      id: googleId
    },
    update: {
      name: name,
      email: email
    },
    create: {
      id: googleId,
      name: name,
      email: email
    }
  })

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, googleId);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      "Location": "/"
    }
  })
}