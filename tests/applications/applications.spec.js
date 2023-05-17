import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';

test('test navigation to application page', async ({ page, portal, environment }) => {

    const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
    await page.goto(url);
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('link', { name: 'Applications' }).click();

    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Applications');
    
  });