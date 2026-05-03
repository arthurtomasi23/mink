import "server-only";

import { randomInt } from "node:crypto";

/**
 * Friendly alphabet:
 *  - no `0/O`, `1/l/I` (avoid confusion when read aloud or copied
 *    from a screenshot)
 *  - mixed case + digits (passes any sane password complexity rule)
 *
 * 55 symbols × 18 chars ≈ 104 bits of entropy.
 */
const ALPHABET =
  "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Cryptographically random, unbiased one-time password. */
export function generateSecurePassword(length = 18): string {
  if (length < 12) throw new Error("Password length must be >= 12");
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[randomInt(0, ALPHABET.length)];
  }
  return out;
}
