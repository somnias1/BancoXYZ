import { useId } from 'react';
import { Spinner } from '../spinner';
import type { TextInputProps } from './types';
import { Label } from '../label';

export default function TextInput({
  label,
  error,
  loading,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const inputId = props?.id ?? generatedId;
  const errorId = `${inputId}-error`;
  const isDisabled = props.disabled || loading;

  return (
    <div>
      {label && (
        <div className="flex gap-2 items-center">
          <Label htmlFor={inputId} required={props.required}>
            {label}
          </Label>
          {loading && (
            <div className="flex items-center gap-2">
              <span className="sr-only">Loading…</span>
              <Spinner />
            </div>
          )}
        </div>
      )}
      <input
        id={inputId}
        type="text"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
