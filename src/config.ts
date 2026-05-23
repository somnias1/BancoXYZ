export const config = {
  e2e: {
    userMail: import.meta.env.VITE_E2E_USER_MAIL,
    userPassword: import.meta.env.VITE_E2E_USER_PASSWORD,
  },
  apiURLs: {
    auth: import.meta.env.VITE_API_URL_AUTH,
    balance: import.meta.env.VITE_API_URL_BALANCE,
    transfer: import.meta.env.VITE_API_URL_TRANSFER,
    transferList: import.meta.env.VITE_API_URL_TRANSFER_LIST,
  },
};
