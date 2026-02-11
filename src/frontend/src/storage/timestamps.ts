export function now(): bigint {
  return BigInt(Date.now()) * BigInt(1000000);
}
