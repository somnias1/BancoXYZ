import z from 'zod';

export const transactionSchema = z.object({
  value: z
    .string({ message: 'Value is required' })
    .min(1, { message: 'Value is required' })
    .transform(Number)
    .pipe(z.number().min(1, { message: 'Value is required' })),
  currency: z
    .string({ message: 'Currency is required' })
    .min(3, { message: 'Currency is required' })
    .max(3, { message: 'Currency is required' }),
  payeerDocument: z
    .string({ message: 'Payeer document is required' })
    .min(1, { message: 'Payeer document is required' }),
  transferDate: z
    .string({ message: 'Transfer date is required' })
    .min(1, { message: 'Transfer date is required' })
    .refine(
      (val) => new Date(val) >= new Date(new Date().toISOString().split('T')[0]),
      { message: 'Transfer date must be today or in the future' },
    ),
});

export type TransactionValues = z.output<typeof transactionSchema>;
export type TransactionFormValues = z.input<typeof transactionSchema>;
