import { useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes';
import callbackApi from './callback';
import type { BankingCookies, CallbackProps } from './types';

function useCallbackApi() {
  const [cookies] = useCookies<'userToken', BankingCookies>(['userToken']);
  const navigate = useNavigate();
  const getToken = useCallback(
    () => cookies.userToken as string | undefined,
    [cookies.userToken],
  );
  const handler = useCallback(
    <T,>(...props: CallbackProps<T>) => {
      const [url, customConfig] = props;
      return callbackApi<T>(getToken, url ?? '', customConfig).catch((error) => {
        if (error?.status === 401 && !customConfig?.skipAuthRedirect) {
          navigate(routes.logout);
        }
        return Promise.reject(error);
      });
    },
    [getToken, navigate],
  );
  return useMemo(() => ({ callbackApi: handler }), [handler]);
}

export default useCallbackApi;
