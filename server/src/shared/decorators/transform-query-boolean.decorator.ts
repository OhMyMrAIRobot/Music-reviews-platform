import { Transform } from 'class-transformer';

export function transformQueryBoolean({
  value,
}: {
  value: unknown;
}): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
    return undefined;
  }
  return undefined;
}

export function TransformQueryBoolean() {
  return Transform(transformQueryBoolean);
}
