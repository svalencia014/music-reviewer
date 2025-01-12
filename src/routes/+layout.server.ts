import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/auth";
import { canSeeAdmin } from "$lib/db";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const token = event.cookies.get("session") ?? null;
  if (token === null) {
    return {}
  }
  const { session, user } = await validateSessionToken(token);
  if (session === null) {
    deleteSessionTokenCookie(event);
    return {}
  }
  setSessionTokenCookie(event, token, session.expiresAt);
  const admin: boolean = await canSeeAdmin(user.id);
  return { "session": {...session, user }, "canViewAdmin": admin}
}