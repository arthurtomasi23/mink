/**
 * Optional auth cookie scope for production domains with both `www` and apex.
 *
 * Set **`AUTH_COOKIE_DOMAIN`** or **`NEXT_PUBLIC_AUTH_COOKIE_DOMAIN`** to the
 * same value (e.g. `.mink-app.de`, leading dot) on Vercel so session cookies work
 * on both `www` and apex. The public name is used by the browser Supabase client.
 *
 * If unset, cookies are scoped to the exact host — signing in on `www`
 * does not send them on the apex hostname and vice versa (looks like broken login).
 *
 * Omit on localhost; do not set unless your production site uses sibling subdomains.
 */
export function supabaseAuthCookieOptions():
  | { domain: string; path: "/" }
  | undefined {
  const domain =
    process.env.AUTH_COOKIE_DOMAIN?.trim() ||
    process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN?.trim();
  if (!domain) return undefined;
  return { domain, path: "/" };
}

/** Browser-only: `createBrowserClient` cannot read server-only `AUTH_COOKIE_DOMAIN`. */
export function supabaseBrowserAuthCookieOptions():
  | { domain: string; path: "/" }
  | undefined {
  const domain = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN?.trim();
  if (!domain) return undefined;
  return { domain, path: "/" };
}
