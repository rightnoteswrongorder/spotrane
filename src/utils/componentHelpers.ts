/**
 * Type-safe utility to ensure non-null default values for props
 * Use this for deeply nested objects or arrays that TypeScript might not correctly infer
 * 
 * @param value The value to check
 * @param defaultValue The default to use if value is null/undefined
 * @returns The value or its default
 */
export function withDefault<T>(value: T | undefined | null, defaultValue: T): T {
  return value === undefined || value === null ? defaultValue : value;
}

/**
 * Provides type-safe default for arrays
 * @param arr The array to check
 * @returns The array or an empty array if undefined/null
 */
export function ensureArray<T>(arr: T[] | undefined | null): T[] {
  return arr || [];
}

/**
 * Safely access nested object properties
 * @param obj The object to access
 * @param path The property path as string array
 * @param defaultValue Default value if path doesn't exist
 * @returns The value at path or defaultValue
 */
export function getNestedValue<T, D = undefined>(
  obj: Record<string, any> | null | undefined,
  path: string[],
  defaultValue?: D
): T | D {
  if (!obj) return defaultValue as D;

  let current = obj;

  for (const key of path) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return defaultValue as D;
    }
    current = current[key];
  }

  return current !== undefined ? current as T : (defaultValue as D);
}
