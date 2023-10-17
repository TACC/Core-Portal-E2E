import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'


test('test topnav navigation to public data page', async ({ page, portal, environment }) => {

    const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
    await page.goto(url);
    await page.getByRole('link', { name: 'Public Data' }).click();

    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Public Data');
  });

  test('redirect to login page when accessing a page requiring auth', async ({ page, portal, environment }) => {
    const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu/workbench/dashboard`;
    await page.goto(url);

    await page.waitForURL("https://portals.tapis.io/**")

    const heading = page.getByRole('heading', {level: 1});
    await expect(heading).toHaveText('Log In');
  })




