import * as crypto from 'crypto';

export function generateRandomString(length = 20) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}
