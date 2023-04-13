import { test as setup } from '../../fixtures/baseFixture'

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, portal, environment }) => {
  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill(process.env.USERNAME);
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.context().storageState({path: authFile})
});