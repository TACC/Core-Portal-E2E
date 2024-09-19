import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json';

test.describe('Public Data Tests', () => {
  test.skip(PORTAL_DATAFILES_STORAGE_SYSTEMS != 'Public Data', 'Public Data not on portal, test skipped');

  test.beforeEach(async ({ page, portal, environment, baseURL }) => {
    await page.goto(baseURL);
  })
    
  test('test topnav navigation to public data page', async ({ page, portal, environment, baseURL }) => {
      
      await page.getByRole('link', { name: 'Public Data' }).click();
      
      const heading = page.getByRole('heading', {level: 2});
      await expect(heading.locator('.system-name')).toHaveText('Public Data');
    });
})


