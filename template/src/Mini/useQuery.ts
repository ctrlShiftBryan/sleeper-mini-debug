import { useQuery } from 'react-query';
// import { getConfig } from '../config';
// import { getOptions } from './getOptions';

export function useQueryInitMiniData(
  user: any,
  key: string,
  rawChecks: number | undefined,
) {
  const url = '/api/gm/init-mini';
  const userId = user?.user_id;
  const checks = rawChecks ?? 0;
  const queryKey = userId ? [url, userId, key, checks] : [url, key, checks];
  const gmApiUrl = 'https://gm2.dynastynerds.com';
  const fullUrl = `${gmApiUrl}${url}`;

  const result = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(user),
      } as any);
      return response.json();
    },
    enabled:
      user !== undefined &&
      gmApiUrl !== undefined &&
      user?.user_id !== undefined &&
      user?.user_id !== null,
  });

  const { status, data, error } = result;
  return { status, data, error };
}
