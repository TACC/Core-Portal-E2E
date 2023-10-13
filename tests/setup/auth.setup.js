import { test as setup } from '../../fixtures/baseFixture'

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, portal, environment }) => {
  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('Enter Username').click();
  await page.getByPlaceholder('Enter Username').fill(process.env.USERNAME);
  await page.getByPlaceholder('Enter Password').click();
  await page.getByPlaceholder('Enter Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.context().storageState({path: authFile})
});