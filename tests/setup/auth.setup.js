import { test as setup } from '../../fixtures/baseFixture'

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, portal, environment }) => {
  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill(process.env.USERNAME);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Connect' }).click();

  await page.context().storageState({path: authFile})
});