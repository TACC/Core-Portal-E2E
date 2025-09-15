import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json';

const portalStorageSystems = PORTAL_DATAFILES_STORAGE_SYSTEMS;

test.describe('Unauthorized User Tests', () => {

  test('test topnav navigation to public data page', async ({ page, portal, environment, baseURL }) => {
    let publicDataExists = false;
    for (const storageSystem of portalStorageSystems) {
      if (storageSystem.name === 'Public Data') {
        publicDataExists = true;
      }
    }
    test.skip(publicDataExists === false, 'Public Data not on portal, test skipped');

    let topNavPortals = ['CEP', 'DRP', '3dem'];
    if (!topNavPortals.includes(portal)) {
      test.skip();
    }

    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Public Data' }).click();

    const heading = page.getByRole('heading', { level: 2 });
    await expect(heading.locator('.system-name')).toHaveText('Public Data');
  });

  test('redirect to login page when accessing a page requiring auth', async ({ page, portal, environment, baseURL }) => {
    const url = `${baseURL}/workbench/dashboard`;
    await page.goto(url);

    await page.waitForURL(/https:\/\/portals(?:\.develop)?\.tapis\.io\/.*$/);

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText('Log In');
  })
})
