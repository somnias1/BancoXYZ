import '../utils/env';
import { test, expect } from '@playwright/test';
import { SELECTORS } from '../utils/selectors';

const LOGIN_PATH = 'default/login';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login button is disabled when both fields are empty', async ({
    page,
  }) => {
    await expect(page.getByTestId(SELECTORS.loginButton)).toBeDisabled();
    await expect(page).toHaveURL('/login');
  });

  test('invalid email format shows validation error without calling the API', async ({
    page,
  }) => {
    let loginCalled = false;
    await page.route(`**/${LOGIN_PATH}`, async (route) => {
      loginCalled = true;
      await route.abort();
    });

    await page.getByTestId(SELECTORS.emailInput).fill('not-an-email');
    await page.getByTestId(SELECTORS.passwordInput).fill('password123');
    await page.getByTestId(SELECTORS.loginButton).click();

    await expect(page.getByText('Email is required')).toBeVisible();
    expect(loginCalled).toBe(false);
  });

  test('wrong credentials show error alert and stay on login page', async ({
    page,
  }) => {
    await page.getByTestId(SELECTORS.emailInput).fill('wrong@example.com');
    await page.getByTestId(SELECTORS.passwordInput).fill('wrongpassword');
    await page.getByTestId(SELECTORS.loginButton).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('valid credentials trigger a login API request', async ({ page }) => {
    await page.route(`**/${LOGIN_PATH}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token' }),
      }),
    );

    const [request] = await Promise.all([
      page.waitForRequest(
        (r) => r.url().includes(LOGIN_PATH) && r.method() === 'POST',
      ),
      (async () => {
        await page
          .getByTestId(SELECTORS.emailInput)
          .fill(process.env.VITE_E2E_USER_MAIL ?? '');
        await page
          .getByTestId(SELECTORS.passwordInput)
          .fill(process.env.VITE_E2E_USER_PASSWORD ?? '');
        await expect(page.getByTestId(SELECTORS.loginButton)).toBeEnabled();
        await page.getByTestId(SELECTORS.loginButton).click();
      })(),
    ]);

    expect(request.method()).toBe('POST');
    expect(request.url()).toContain(LOGIN_PATH);
  });
});
