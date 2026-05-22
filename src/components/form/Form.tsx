import { FormProvider, type FieldValues } from 'react-hook-form';
import type { FormProps } from './types';

export default function Form<T extends FieldValues>({
  children,
  methods,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(props.onSubmit, props.onInvalid)}>
        {children}
      </form>
    </FormProvider>
  );
}
