export type TransferRequest = {
  value: number;
  currency: string;
  payeerDocument: string;
  transferDate: string;
};

export type TransferResponse = {
  status: 'success' | 'error';
  message: string;
};

export type TransferItem = {
  value: number;
  date: string;
  currency: string;
  payeer: {
    document: string;
    name: string;
  };
};

export type TransferListResponse = {
  message: string;
  transfers: Array<TransferItem>;
};
