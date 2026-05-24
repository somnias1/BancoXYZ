import { useId } from 'react';
import type { CheckBoxProps } from './types';

export default function CheckBox({ label, ...props }: Readonly<CheckBoxProps>) {
  const generatedId = useId();
  const inputId = props?.id ?? generatedId;

  return (
    <div className="flex gap-2 items-center">
      <input
        id={inputId}
        type="checkbox"
        aria-disabled={props.disabled}
        {...props}
        className="rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      />
      {label && (
        <label htmlFor={inputId}>
          {label}
          {props.required && (
            <span className="text-red-500" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
    </div>
  );
}
