import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { getPortalUrl } from '../../utils/navigationHelper';

test('test navigation to application page', async ({ page, portal, environment }) => {

    await page.goto(getPortalUrl(portal, environment));
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('link', { name: 'Applications', exact: true }).click();

    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Applications');
    
  });