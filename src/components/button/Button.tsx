import { Spinner } from '../spinner';
import { variantStyles } from './constants';
import type { ButtonProps } from './types';

export default function Button({
  children,
  loading,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: Readonly<ButtonProps>) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={[
        'inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-opacity',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        'disabled:cursor-not-allowed',
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {loading && (
          <>
            <span className="sr-only">Loading…</span>
            <Spinner />
          </>
        )}
      </span>
    </button>
  );
}
