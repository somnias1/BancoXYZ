import { Button } from '@/components/button';
import { TextInput } from '@/components/textInput';
import { useLogin } from '@/services/auth';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { loginSchema, type LoginValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/components/form/Form';
import { useCookies } from 'react-cookie';
import { routes } from '@/routes';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [, setCookie] = useCookies(['userToken']);
  const navigate = useNavigate();
  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useLogin({
    onSuccess: (response) => {
      setCookie('userToken', response.token);
      navigate(routes.dashboard);
    },
  });
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});

  const handleLogin = useCallback(
    (values: LoginValues) => {
      login(values);
    },
    [login],
  );
  const onInvalid = useCallback((errors: FieldErrors<LoginValues>) => {
    setErrors(errors);
  }, []);

  const email = useWatch({ control: form.control, name: 'email' });
  const password = useWatch({ control: form.control, name: 'password' });

  // biome-ignore lint/correctness/useExhaustiveDependencies: It only observes email
  useEffect(() => {
    if (errors.email) {
      console.log('Enters');
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  }, [email]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: It only observes password
  useEffect(() => {
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  }, [password]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <img
        src="https://www.topazevolution.com/hubfs/Topaz%20One%20Logo.svg"
        alt="BancoXYZ"
        className="w-1/2 pb-8"
      />
      <h1 id="login-heading" className="text-2xl font-bold">
        Welcome to BancoXYZ
      </h1>
      <p className="text-sm text-gray-500">
        Please enter your email and password to login.
      </p>
      <Form
        methods={form}
        onSubmit={handleLogin}
        onInvalid={onInvalid}
        aria-labelledby="login-heading"
      >
        <div className="flex flex-col gap-4">
          <TextInput
            placeholder="Email"
            label="Email"
            required
            data-testid="email-input"
            autoComplete="email"
            error={errors.email?.message}
            {...form.register('email')}
          />
          <TextInput
            placeholder="Password"
            label="Password"
            required
            type="password"
            autoComplete="current-password"
            data-testid="password-input"
            error={errors.password?.message}
            {...form.register('password')}
          />
          <Button
            type="submit"
            variant="primary"
            data-testid="login-button"
            loading={isPending}
            disabled={isPending || !email || !password}
            onClick={form.handleSubmit(handleLogin, onInvalid)}
          >
            Login
          </Button>
        </div>
      </Form>
      {isError && (
        <p role="alert" className="text-red-500 self-center">
          {error?.data ?? 'An error occurred'}
        </p>
      )}
    </div>
  );
}
