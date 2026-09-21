// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Password Security & Hashing Utilities (bcrypt cost 12)
// =============================================================================

import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 12;

// Static precomputed hash with cost 12 used for dummy comparisons to mitigate timing attacks
// when looking up non-existent email addresses during login.
const DUMMY_HASH = "$2b$12$e8Y6BqK4r8lT9V7P5z3NReQvG0W1S4D7F2H5J8K1L4Z7X0C3V6B9N";

/**
 * Hash a plaintext password using bcrypt with cost factor 12.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a stored bcrypt hash.
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Perform a dummy constant-time bcrypt compare against a static hash
 * to prevent user enumeration via timing discrepancies.
 */
export async function dummyComparePassword(password: string): Promise<void> {
  await bcrypt.compare(password, DUMMY_HASH);
}
