import { test as setup } from '../../fixtures/baseFixture.js'
import { SYSTEM_MONITOR_DISPLAY_LIST, PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json'

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, portal, environment, baseURL }) => {

  console.log("Using portal url: ", baseURL)

  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill(process.env.USERNAME);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Connect' }).click();

  await page.context().storageState({path: authFile})
});