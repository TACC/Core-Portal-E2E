import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
import { getPortalUrl } from '../../utils/navigationHelper';


test.describe('Unauthorized User Tests', () => {

  test('test topnav navigation to public data page', async ({ page, portal, environment }) => {

    await page.goto(getPortalUrl(portal, environment));
    await page.getByRole('link', { name: 'Public Data' }).click();

    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Public Data');
  });

  test('redirect to login page when accessing a page requiring auth', async ({ page, portal, environment }) => {
    const url = `${getPortalUrl(portal, environment)}/workbench/dashboard`;
    await page.goto(url);

    await page.waitForURL("https://portals.tapis.io/**")

    const heading = page.getByRole('heading', {level: 1});
    await expect(heading).toHaveText('Log In');
  })
})
