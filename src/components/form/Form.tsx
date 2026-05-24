import { type FieldValues, FormProvider } from 'react-hook-form';
import type { FormProps } from './types';

export default function Form<
  T extends FieldValues,
  TTransformed extends FieldValues = T,
>({
  children,
  methods,
  onSubmit,
  onInvalid,
  ...formProps
}: Readonly<FormProps<T, TTransformed>>) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)} {...formProps}>
        {children}
      </form>
    </FormProvider>
  );
}
