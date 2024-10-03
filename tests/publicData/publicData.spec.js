import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json';

let publicDataEntry = false;
for (const entry of PORTAL_DATAFILES_STORAGE_SYSTEMS) {
  if (entry.scheme === "public") {
    publicDataEntry = true;
    break;
  }
}

test.describe('Public Data Tests', async () => {
  
  test.skip(publicDataEntry === false, 'Public Data not on portal, test skipped');

  test.beforeEach(async ({ page, portal, environment, baseURL }) => {
    await page.goto(baseURL);
  })
    
  test('test topnav navigation to public data page', async ({ page, portal, environment, baseURL }) => {

      await page.getByRole('link', { name: 'Public Data' }).click();
      
      const heading = page.getByRole('heading', {level: 2});
      await expect(heading.locator('.system-name')).toHaveText('Public Data');
    });
})


