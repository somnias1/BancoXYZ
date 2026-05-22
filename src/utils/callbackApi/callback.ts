import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { AxiosRequestConfigCustom } from './types';

async function callbackApi<T>(
  getToken: () => string | undefined,
  url: string,
  customConfig: AxiosRequestConfigCustom = {},
): Promise<T> {
  const params: AxiosRequestConfigCustom = {
    ...customConfig,
    headers: customConfig.headers ?? {},
    method: customConfig.method ?? 'GET',
  };
  const token = getToken();
  const fullUrl = params.baseURL
    ? `${params.baseURL.replace(/\/$/, '')}/${url?.toString().replace(/^\//, '')}`
    : url;
  const options: AxiosRequestConfig = {
    ...params,
    headers: {
      ...params.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    url: fullUrl,
  };
  return new Promise<T>((resolve, reject) => {
    axios(options)
      .then((success) => {
        resolve(success.data as T);
      })
      .catch((error: Error | AxiosError<T>) => {
        if (axios.isAxiosError(error)) {
          reject(error.response);
        } else {
          reject(error);
        }
      });
  });
}

export default callbackApi;
