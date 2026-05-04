/**
 * Optional auth cookie scope for production domains with both `www` and apex.
 *
 * Set `AUTH_COOKIE_DOMAIN=.mink-app.de` on Vercel so the Supabase session
 * cookies apply to **both** www.mink-app.de and mink-app.de (leading dot =
 * valid for all subdomains).
 *
 * If unset, cookies are scoped to the exact host — signing in on `www`
 * does not send them on the apex hostname and vice versa (looks like broken login).
 *
 * Omit on localhost; do not set unless your production site uses sibling subdomains.
 */
export function supabaseAuthCookieOptions():
  | { domain: string; path: "/" }
  | undefined {
  const domain = process.env.AUTH_COOKIE_DOMAIN?.trim();
  if (!domain) return undefined;
  return { domain, path: "/" };
}
