import { FormProvider, type FieldValues } from 'react-hook-form';
import type { FormProps } from './types';

export default function Form<T extends FieldValues>({
  children,
  methods,
  onSubmit,
  onInvalid,
  ...formProps
}: FormProps<T>) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)} {...formProps}>
        {children}
      </form>
    </FormProvider>
  );
}
