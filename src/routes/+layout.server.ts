
import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from '$lib/auth';
import type {LayoutServerLoad} from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.user
  }
}