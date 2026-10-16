import { randomInt } from 'crypto';

export function generateCode(): string {
  return randomInt(100000, 999999).toString();
}
