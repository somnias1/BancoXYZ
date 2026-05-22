import type { ReactNode, FormHTMLAttributes } from 'react';
import type {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

export type FormProps<T extends FieldValues> = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  children: ReactNode;
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  onInvalid?: SubmitErrorHandler<T>;
};
