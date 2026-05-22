import { render, screen, waitFor } from '@testing-library/react';
import Logout from '.';
import userEvent from '@testing-library/user-event';
import { routes } from '@/routes';
import { createWrapper } from '@/utils/test/utils/wrapper';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Logout', () => {
  it('should render the logout page', async () => {
    render(
      createWrapper({ cookies: { userToken: 'userToken' } })({
        children: <Logout />,
      }),
    );
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('login-button'));
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(routes.login),
    );
  });
});
