import type { LabelProps } from './types';

export default function Label({ children, ...props }: LabelProps) {
  return (
    <label htmlFor={props.htmlFor} {...props}>
      {children}
      {props.required && (
        <span className="text-red-500" aria-hidden="true">
          {' '}
          *
        </span>
      )}
    </label>
  );
}
