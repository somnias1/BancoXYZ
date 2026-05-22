import type { AxiosRequestConfig } from 'axios';

export interface AxiosRequestConfigCustom extends AxiosRequestConfig {
  skipAuthRedirect?: boolean;
}

export type CallbackProps<T> = [
  AxiosRequestConfig<T>['url'],
  AxiosRequestConfigCustom?,
];

export type BankingCookies = {
  userToken?: string;
}