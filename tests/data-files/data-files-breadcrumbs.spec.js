import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
 

test.describe('Data Files Breadcrumbs Tests', () => {
    
    test.beforeEach(async ({ page, portal, environment, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files' }).click();
        await page.getByRole('main').getByRole('link', { name: 'My Data (Work)' }).click();
        await page.getByRole('link', { name: '.Trash' }).click();
    })

    test('Test "Go to ..." button', async ({ page }) => {
        await page.getByRole('button', { name: 'Go to ...' }).click();
        await expect(page.locator('button:has-text("My Data (Work)")')).toBeVisible();
    })

    test('Test Breadcrumbs Directory Label display', async ({ page }) => {
        await expect(page.locator('div.breadcrumbs:has-text(".Trash")')).toBeVisible();
    })

    test('Test "View Full Path" display', async ({ page }) => {
        await page.getByRole('button', { name: 'View Full Path' }).click();
        await expect(page.locator('div.modal-body textarea:has-text(".Trash")')).toBeVisible();
    })
})