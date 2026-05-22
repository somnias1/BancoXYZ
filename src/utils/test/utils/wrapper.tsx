import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Cookies, CookiesProvider } from 'react-cookie';
import { MemoryRouter } from 'react-router-dom';

type WrapperOptions = {
  cookies?: Record<string, string>;
};

export function createWrapper({
  cookies: initialCookies = {},
}: WrapperOptions = {}) {
  const cookies = new Cookies(initialCookies);
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <CookiesProvider cookies={cookies}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </MemoryRouter>
      </CookiesProvider>
    );
  };
}
