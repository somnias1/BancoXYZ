import { Dialog } from '@/components/dialog';
import type { TransactionsConfigurationProps } from './types';
import { Button } from '@/components/button';
import { Form } from '@/components/form';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import {
  transactionSchema,
  type TransactionValues,
  type TransactionFormValues,
} from './schema';
import TextInput from '@/components/textInput/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTransfer } from '@/services/transfer';
import { useCallback, useEffect, useState } from 'react';
import { CheckBox } from '@/components/checkBox';

export default function TransactionsConfiguration({
  open,
  onClose,
  onSuccess,
}: TransactionsConfigurationProps) {
  const {
    mutate: createTransaction,
    isPending,
    isError,
    error,
  } = useCreateTransfer({
    onSuccess: (_, request) => {
      onSuccess(request);
    },
  });
  const [isProgrammedTransfer, setIsProgrammedTransfer] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<TransactionFormValues>>({});
  const handleToggleTransfer = useCallback(() => {
    setIsProgrammedTransfer((prev) => !prev);
  }, []);
  const form = useForm<TransactionFormValues, unknown, TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      value: '',
      currency: '',
      payeerDocument: '',
      transferDate: new Date().toISOString().split('T')[0],
    },
  });
  const onInvalid = useCallback(
    (errors: FieldErrors<TransactionFormValues>) => {
      setErrors(errors);
    },
    [],
  );
  const handleSubmit = useCallback(
    (values: TransactionValues) => {
      createTransaction(values);
    },
    [createTransaction],
  );

  const value = useWatch({ control: form.control, name: 'value' });
  const currency = useWatch({ control: form.control, name: 'currency' });
  const payeerDocument = useWatch({
    control: form.control,
    name: 'payeerDocument',
  });
  const transferDate = useWatch({
    control: form.control,
    name: 'transferDate',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: It only observes value
  useEffect(() => {
    if (errors.value) {
      setErrors((prev) => ({ ...prev, value: undefined }));
    }
  }, [value]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: It only observes currency
  useEffect(() => {
    if (errors.currency) {
      setErrors((prev) => ({ ...prev, currency: undefined }));
    }
  }, [currency]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: It only observes payeerDocument
  useEffect(() => {
    if (errors.payeerDocument) {
      setErrors((prev) => ({ ...prev, payeerDocument: undefined }));
    }
  }, [payeerDocument]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: It only observes transferDate
  useEffect(() => {
    if (errors.transferDate) {
      setErrors((prev) => ({ ...prev, transferDate: undefined }));
    }
  }, [transferDate]);

  const handleClose = useCallback(() => {
    form.reset();
    setIsProgrammedTransfer(false);
    onClose();
  }, [form, onClose]);

  return (
    <Dialog
      title="Transactions Configuration"
      open={open}
      onClose={handleClose}
      description="Here you can configure and program your transactions"
      data-testid="transactions-configuration"
      aria-busy={isPending}
    >
      <Form methods={form} onSubmit={handleSubmit} onInvalid={onInvalid} noValidate>
        <div className="flex flex-col gap-4">
          <TextInput
            label="Value"
            type="number"
            required
            placeholder="0"
            error={errors.value?.message}
            {...form.register('value')}
          />
          <TextInput
            label="Currency"
            type="text"
            required
            placeholder="e.g. USD"
            error={errors.currency?.message}
            {...form.register('currency')}
          />
          <TextInput
            label="Payeer Document"
            type="text"
            required
            placeholder="e.g. 1234567890"
            error={errors.payeerDocument?.message}
            {...form.register('payeerDocument')}
          />
          <CheckBox
            label="Will be a programmed transfer?"
            checked={isProgrammedTransfer}
            onChange={handleToggleTransfer}
          />
          {isProgrammedTransfer && (
            <TextInput
              label="Transfer Date"
              type="date"
              placeholder="e.g. 2026-01-01"
              error={errors.transferDate?.message}
              {...form.register('transferDate')}
            />
          )}
        </div>
      </Form>
      {isError && (
        <p role="alert" className="text-red-500 self-center">
          {error?.data ?? 'An error occurred'}
        </p>
      )}
      <div className="flex gap-2 justify-end">
        <Button
          onClick={handleClose}
          aria-label="Cancel transactions configuration"
          data-testid="cancel-transactions-configuration"
          variant="ghost"
        >
          Cancel
        </Button>
        <Button
          onClick={form.handleSubmit(handleSubmit, onInvalid)}
          aria-label="Save transactions configuration"
          data-testid="save-transactions-configuration"
          disabled={isPending}
          loading={isPending}
        >
          Save
        </Button>
      </div>
    </Dialog>
  );
}
