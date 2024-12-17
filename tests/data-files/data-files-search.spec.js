import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { WORKBENCH_SETTINGS } from '../../settings/custom_portal_settings.json';
 
const hideDataFiles = WORKBENCH_SETTINGS['hideDataFiles'];

test.describe('Data Files Search Tests', () => {
    test.skip(hideDataFiles === true, 'Data Files hidden on portal, test skipped');

    test.beforeEach(async ({ page, portal, environment, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files' }).click();
        await page.getByRole('main').getByRole('link', { name: 'My Data (Work)' }).click();
    })

    test('Searching using valid query', async ({ page }) => {
        await page.getByPlaceholder('Search My Data (Work)').fill('frontera');
        await page.getByRole('button', { name: 'Search', exact: true }).click();

        await expect(page.getByRole('cell', { name: 'frontera', exact: true })).toBeVisible();
    })

    test('Invalid search shows not found message', async ({ page }) => {
        await page.getByPlaceholder('Search My Data (Work)').fill('random string');
        await page.getByRole('button', { name: 'Search', exact: true }).click();

        await expect(page.getByText('No files or folders to show.')).toBeVisible();
        await expect(page.getByTestId('summary-of-search-results')).toHaveText('0 results in My Data (Work)')
    })

    test('Back to all files functionality works', async ({ page }) => {
        await page.getByPlaceholder('Search My Data (Work)').fill('random string');
        await page.getByRole('button', { name: 'Search', exact: true }).click();
        await page.getByRole('button', { name: 'Back to All Files' }).click();
        
        await expect(page.locator('.data-files-table-body')).toBeVisible()
        const rows = await page.getByRole('rowgroup').getByRole('row').all()

        expect((rows).length).toBeGreaterThan(0)

    })

    test('Filtering works', async ({ page }) => {
        
        await page.getByTestId('selector').selectOption('Folders')

        await expect(page.locator('.data-files-table-body')).toBeVisible()
        const rows = await page.getByRole('rowgroup').getByRole('row').all()

        expect((rows).length).toBeGreaterThan(0)

        await page.getByTestId('selector').selectOption('Audio')
        await expect(page.getByText('No files or folders to show.')).toBeVisible();
        await expect(page.getByTestId('summary-of-search-results')).toHaveText('0 results in My Data (Work)')

    })
})