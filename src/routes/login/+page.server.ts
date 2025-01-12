import { google } from "$lib/oauth";
import { redirect } from "@sveltejs/kit";
import { generateCodeVerifier, generateState } from "arctic";

export async function load(event) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "email", "profile"]);

  event.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    maxAge: 60*10,
    path: "/",
    sameSite: "lax"
  });

  event.cookies.set("google_code_verifier", codeVerifier, {
    httpOnly: true,
    maxAge: 60*10,
    path: "/",
    sameSite: "lax"
  });

  redirect(302, url.toString());
}