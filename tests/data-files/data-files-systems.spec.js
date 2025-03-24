import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { WORKBENCH_SETTINGS } from '../../settings/custom_portal_settings.json';
import { PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json';

const portalStorageSystems = PORTAL_DATAFILES_STORAGE_SYSTEMS;
const hideDataFiles = WORKBENCH_SETTINGS['hideDataFiles'];

test.describe('Data Files Navigation Tests', () => {
  test.skip(hideDataFiles === true, 'Data Files hidden on portal, test skipped');

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL);
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('link', { name: 'Data Files' }).click();
  })

  for (const storageSystem of portalStorageSystems) {
    test(`test navigation to ${storageSystem.name}`, async ({ page }) => {
      await page.getByRole('main').getByRole('link', { name: storageSystem.name }).click();
      const heading = page.getByRole('heading', { level: 2 });
      await expect(heading.locator('.system-name')).toHaveText(storageSystem.name);
    })

    test(`test correct toolbar buttons available for ${storageSystem.name}`, async ({ page }) => {
      if (storageSystem.name === "Community Data" || storageSystem.name === "Public Data") {
        //visible buttons
        await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
        //not visible buttons
        expect(page.getByRole('button', { name: 'Move' })).toBeUndefined;
        expect(page.getByRole('button', { name: 'Link' })).toBeUndefined;
        expect(page.getByRole('button', { name: 'Rename' })).toBeUndefined;
        expect(page.getByRole('button', { name: 'Trash' })).toBeUndefined;
      } else {
        test.skip("skipped test, covered by other tests");
      }
    })
  }
})
