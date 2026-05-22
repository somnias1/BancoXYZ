import type { ButtonProps } from "./types";

export const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-brand text-brand-700 shadow-brand hover:opacity-90 disabled:opacity-60',
    secondary:
      'bg-primary text-primary-foreground hover:bg-brand-500 disabled:opacity-60',
    ghost: 'bg-transparent text-primary hover:bg-brand-50 disabled:opacity-60',
  };
  