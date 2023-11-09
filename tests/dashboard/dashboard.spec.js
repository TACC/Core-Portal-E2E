import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
import { getPortalUrl } from '../../utils/navigationHelper';


test.describe('Dashboard Tests', () => {
  
  test.beforeEach(async ({ page, portal, environment }) => {
    await page.goto(getPortalUrl(portal, environment));
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'My Dashboard' }).click();
  })

  test('test navigation to correct page', async ({ page, portal, environment }) => {
    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Dashboard');
  });

  test('test dashboard elements exist', async ({ page, portal, environment }) => {
  
    await expect(page.getByRole('heading', {level: 3, name: 'My Recent Jobs'})).toBeVisible();
  
    await expect(page.getByRole('article')
                .filter({ has: page.getByRole('heading', {level: 3, name: 'System Status'})})).toBeVisible();
  
    await expect(page.getByRole('heading', {level: 3, name: 'My Tickets'})).toBeVisible();
  
    await expect(page.getByRole('link', {name: 'Manage Account'})).toBeVisible();
  });

  test('test applications page link exists when there are no submitted jobs', async ({ page, portal, environment }) => {  
    
    await expect(page.getByRole('heading', {level: 3, name: 'My Recent Jobs'})).toBeVisible();
  
    test.slow();
    await page.waitForTimeout(2000);
    const jobs = page.locator('table.jobs-view tbody tr[role="row"]');
    const jobsCount = await jobs.count();
    const statusMessage = page.locator('table.jobs-view tbody tr:first-child.-status');
  
    if (jobsCount == 0 && await statusMessage.isVisible()){
        await expect(statusMessage.getByRole('link')).toContainText('Applications Page');
    }
  
  });
})
