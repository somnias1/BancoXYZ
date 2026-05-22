export const config = {
  apiURLs: {
    auth: import.meta.env.VITE_API_URL_AUTH,
    balance: import.meta.env.VITE_API_URL_BALANCE,
    transfer: import.meta.env.VITE_API_URL_TRANSFER,
    transferList: import.meta.env.VITE_API_URL_TRANSFER_LIST,
  },
};
