import z from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Email is required' }),
  password: z
    .string({ message: 'Password is required' })
    .min(4, { message: 'Password is required' }),
});

export type LoginValues = z.infer<typeof loginSchema>;
