import { test as setup } from '../../fixtures/baseFixture'
import { getPortalUrl } from '../../utils/navigationHelper'


const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, portal, environment }) => {
  await page.goto(getPortalUrl(portal, environment));
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill(process.env.USERNAME);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Connect' }).click();

  await page.context().storageState({path: authFile})
});