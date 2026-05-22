import { render, screen, waitFor } from '@testing-library/react';
import { createWrapper } from '@/utils/test/utils/wrapper';
import Login from '.';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import { LoginMock } from '@/services/auth/mocks';
import { config } from '@/config';
import { authPaths } from '@/services/auth/constants';
import { routes } from '@/routes';

const LOGIN_URL = `${config.apiURLs.auth}/${authPaths.login}`;

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login', () => {
  it('should display errors for invalid fields', async () => {
    const user = userEvent.setup();
    render(createWrapper()({ children: <Login /> }));

    await user.type(screen.getByTestId('email-input'), 'invalid-email');
    await user.type(screen.getByTestId('password-input'), '1');

    await waitFor(() =>
      expect(screen.getByTestId('login-button')).toBeEnabled(),
    );

    await user.click(screen.getByTestId('login-button'));

    await waitFor(() =>
      expect(screen.getByText('Email is required')).toBeDefined(),
    );
    await waitFor(() =>
      expect(screen.getByText('Password is required')).toBeDefined(),
    );
    await user.type(screen.getByTestId('email-input'), faker.internet.email());
    await user.type(
      screen.getByTestId('password-input'),
      faker.internet.password(),
    );

    await waitFor(() =>
      expect(screen.queryByText('Email is required')).toBeNull(),
    );
    await waitFor(() =>
      expect(screen.queryByText('Password is required')).toBeNull(),
    );
  });
  it('should submit the form with valid fields and redirect to the dashboard', async () => {
    const credentials = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const mockResponse = LoginMock({
      user: {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: credentials.email,
      },
    });
    server.use(http.post(LOGIN_URL, () => HttpResponse.json(mockResponse)));

    render(createWrapper()({ children: <Login /> }));

    await userEvent.type(screen.getByTestId('email-input'), credentials.email);
    await userEvent.type(
      screen.getByTestId('password-input'),
      credentials.password,
    );

    await waitFor(() =>
      expect(screen.getByTestId('login-button')).toBeEnabled(),
    );

    await userEvent.click(screen.getByTestId('login-button'));

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(routes.dashboard),
    );
  });
});
