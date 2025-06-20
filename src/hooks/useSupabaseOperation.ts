import { useState, useCallback } from 'react';
import { logError } from '../utils/errorHandling';

type OperationStatus = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

type OperationFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

/**
 * A hook for managing Supabase operations with loading, error, and success states
 * 
 * @template T - The return type of the operation
 * @template Args - The argument types for the operation function
 * 
 * @param operationFn - The async function to execute
 * @param operationName - Name of the operation for error logging
 * @returns An object with the wrapped function and status indicators
 */
export function useSupabaseOperation<T, Args extends any[]>(
  operationFn: OperationFunction<T, Args>,
  operationName: string
) {
  const [status, setStatus] = useState<OperationStatus>({
    loading: false,
    error: null,
    success: false
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setStatus({ loading: true, error: null, success: false });

      try {
        const result = await operationFn(...args);
        setStatus({ loading: false, error: null, success: true });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setStatus({ loading: false, error: errorMessage, success: false });
        logError(operationName, error);
        return null;
      }
    },
    [operationFn, operationName]
  );

  return { execute, ...status };
}
