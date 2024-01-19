import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture.js';
import { NGINX_SERVER_NAME } from '../../settings/custom_portal_settings.json';

test.describe('Public Data Tests', () => {
  test.skip(NGINX_SERVER_NAME != 'cep.tacc.utexas.edu', 'Public Data not on portal, test skipped');

  test.beforeEach(async ({ page, portal, environment, baseURL }) => {
    await page.goto(baseURL);
  })
    
  test('test topnav navigation to public data page', async ({ page, portal, environment, baseURL }) => {
      
      await page.getByRole('link', { name: 'Public Data' }).click();
      
      const heading = page.getByRole('heading', {level: 2});
      await expect(heading.locator('.system-name')).toHaveText('Public Data');
    });
})


