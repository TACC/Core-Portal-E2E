import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
import { getPortalUrl } from '../../utils/navigationHelper';


test.describe('Public Data Tests', () => {
  
  test.beforeEach(async ({ page, portal, environment }) => {
    await page.goto(getPortalUrl(portal, environment));
  })
  
  test('test sidenav navigation to public data page', async ({ page, portal, environment }) => {

    await page.locator('#navbarDropdown').click();
      await page.getByRole('link', { name: 'Dashboard' }).click();
      await page.getByRole('link', { name: 'Public Data' }).click();
  
      const heading = page.getByRole('heading', {level: 2});
      await expect(heading).toHaveText('Public Data');
      
    });
  
  test('test topnav navigation to public data page', async ({ page, portal, environment }) => {
      
      await page.getByRole('link', { name: 'Public Data' }).click();
      
      const heading = page.getByRole('heading', {level: 2});
      await expect(heading).toHaveText('Public Data');
    });
})


