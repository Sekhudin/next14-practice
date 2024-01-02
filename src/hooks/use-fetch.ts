'use client';
import React from 'react';

type Fetcher<T extends Record<string, any> = Record<string, any>> = Promise<T>;
type Deps = React.DependencyList;
type UseFetchReturn<T extends Record<string, any>, E = any> = {
  result: T | null;
  loading: boolean;
  error?: E | null;
};

export function useFetch<T extends Record<string, any> = Record<string, any>, E = any>(
  fetcher: Fetcher<T>,
  deps?: Deps
): UseFetchReturn<T, E> {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [result, setResult] = React.useState<T | null>(null);
  const [error, setError] = React.useState<E | null>(null);
  const dependencies: readonly unknown[] = deps ? deps : [];

  const fetchHandler = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetcher;
      setResult(result);
      setLoading(false);
    } catch (err: any) {
      console.log('err :>> ', err);
      setLoading(false);
      setError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  React.useEffect(() => {
    fetchHandler();
    return () => {};
  }, [fetchHandler]);

  return { result, loading, error };
}
