export function resolveBackendEnumKey<T extends Record<string, string>>(
  enumObject: T,
  value: string
): keyof T | undefined {
  const keys = Object.keys(enumObject) as Array<keyof T>;
  if ((keys as string[]).includes(value)) {
    return value as keyof T;
  }
  return keys.find((k) => enumObject[k] === value);
}
