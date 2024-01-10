import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture.js';
import { WORKBENCH_SETTINGS } from '../../settings/custom_portal_settings.json';

const hideApps = WORKBENCH_SETTINGS['hideApps'];

test('test navigation to application page', async ({ page, portal, environment, baseURL }) => {
  test.skip(hideApps === true, 'Apps hidden on portal, test skipped');
  await page.goto(baseURL);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Applications', exact: true }).click();

  const heading = page.getByRole('heading', {level: 2});
  await expect(heading).toHaveText('Applications');
  
});