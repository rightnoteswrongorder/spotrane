import { useRef, useCallback } from 'react';

/**
 * A hook that memoizes a value and only updates when its dependencies change
 * based on a deep equality check. This can be more precise than React's 
 * default shallow equality check for complex objects.
 *
 * @param value - The value to memoize
 * @param isEqual - Optional custom equality function 
 * @returns The memoized value
 */
export function useMemoizedValue<T>(value: T, isEqual?: (prev: T, next: T) => boolean): T {
  const ref = useRef<T>(value);

  // Default deep comparison implementation
  const defaultIsEqual = (a: T, b: T): boolean => {
    if (a === b) return true;
    if (a === null || b === null) return a === b;

    // Compare arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((val, idx) => defaultIsEqual(val, b[idx]));
    }

    // Compare objects
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;

      return keysA.every(key => {
        // @ts-ignore - We're checking object properties dynamically
        return defaultIsEqual(a[key], b[key]);
      });
    }

    return false;
  };

  const equalityFn = isEqual || defaultIsEqual;

  if (!equalityFn(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Creates a stable callback that maintains the same reference
 * but always uses the latest props/state values.
 * 
 * This is useful for callbacks passed to child components that
 * you don't want to cause re-renders when props change.
 * 
 * @param callback - The function to stabilize
 * @returns A stable callback function
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);

  // Always keep the ref updated with the latest callback
  callbackRef.current = callback;

  // Return a stable function that uses the ref
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
}
