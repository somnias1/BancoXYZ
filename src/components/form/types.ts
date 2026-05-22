import type { ReactNode, FormHTMLAttributes } from 'react';
import type {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

export type FormProps<T extends FieldValues, TTransformed extends FieldValues = T> = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  children: ReactNode;
  methods: UseFormReturn<T, unknown, TTransformed>;
  onSubmit: SubmitHandler<TTransformed>;
  onInvalid?: SubmitErrorHandler<T>;
};
