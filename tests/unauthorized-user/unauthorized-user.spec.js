import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
 


test.describe('Unauthorized User Tests', () => {

  test('test topnav navigation to public data page', async ({ page, portal, environment, baseURL }) => {

    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Public Data' }).click();

    const heading = page.getByRole('heading', {level: 2});
    await expect(heading.locator('.system-name')).toHaveText('Public Data');
  });

  test('redirect to login page when accessing a page requiring auth', async ({ page, portal, environment, baseURL }) => {
    const url = `${baseURL}/workbench/dashboard`;
    await page.goto(url);

    await page.waitForURL("https://portals.tapis.io/**")

    const heading = page.getByRole('heading', {level: 1});
    await expect(heading).toHaveText('Log In');
  })
})
