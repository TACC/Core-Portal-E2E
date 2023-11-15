import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';

test('test navigation to application page', async ({ page, portal, environment, baseURL }) => {

    await page.goto(baseURL);
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('link', { name: 'Applications', exact: true }).click();

    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Applications');
    
  });