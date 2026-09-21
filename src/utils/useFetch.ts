import { useCallback, useEffect, useState } from 'react';

export type UseFetchResult<T> = {
  data?: T;
  loading: boolean;
  error?: any;
  /** Goi lai API, dung sau khi tao/sua du lieu. */
  refresh: () => void;
};

/**
 * Tai du lieu 1 lan khi mount va moi khi `deps` doi.
 *
 * Khong dung `useRequest` cua @umijs/max vi no mac dinh tra ve `res.data`,
 * trong khi API cua du an tra thang object o cap ngoai cung.
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: { ready?: boolean } = {},
): UseFetchResult<T> {
  const { ready = true } = options;

  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(ready);
  const [error, setError] = useState<any>();
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!ready) {
      setLoading(false);
      return undefined;
    }

    // Bo qua ket qua cua lan goi cu neu deps doi truoc khi API tra ve.
    let cancelled = false;
    setLoading(true);

    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(undefined);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, ready, version]);

  return { data, loading, error, refresh };
}
