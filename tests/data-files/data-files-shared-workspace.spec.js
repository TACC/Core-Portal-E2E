import { expect } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
import { PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json'

const portalStorageSystems = PORTAL_DATAFILES_STORAGE_SYSTEMS

test.describe.configure({ mode: 'serial' })

test.describe('Shared Workspaces tests', () => {

    // Skip the tests if portal does not have Shared Workspaces
    test.skip(!portalStorageSystems.some(system => (system.scheme === 'projects')))

    test.beforeEach(async ({ page, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files' }).click();
        await page.getByRole('main').getByRole('link', { name: 'Shared Workspaces' }).click();
    })

    test('Add Shared Workspace', async ({ page }) => {
        test.setTimeout(100000)
        await page.getByRole('button', { name: '+ Add' }).click();
        await page.getByRole('menuitem', { name: 'Shared Workspace' }).click();

        await expect(page.locator('.modal-dialog')).toBeVisible();
        await page.getByRole('textbox').click();
        await page.getByRole('textbox').fill('Test Shared Workspace');
        
        await expect(page.locator('.project-members__cell').nth(0)).toContainText('WMA Test User')

        await page.getByRole('button', { name: 'Add Workspace' }).click();

        await expect(page.locator('.modal-dialog')).not.toBeVisible({timeout: 20000});

        await expect(page.locator('.listing-placeholder')).toBeVisible();

        await expect(page.getByRole('heading', {level: 3})).toHaveText('Test Shared Workspace')

        await page.getByRole('main').getByRole('link', { name: 'Shared Workspaces' }).click();

        const table = page.getByRole('table').and(page.locator('.projects-listing'))
        const rows = await table.locator('tbody').locator('tr').all()

        expect(rows.length).toBeGreaterThanOrEqual(1);

    })

    test('Shared Workspace Search', async ({ page }) => {
        const input = page.getByRole('form', { name: 'Workspace Search' }).locator('input')
        const searchButton = page.getByRole('form', { name: 'Workspace Search' }).getByRole('button', { name: 'Search', exact: true })
        const table = page.getByRole('table').and(page.locator('.projects-listing'))

        await input.fill('Test Shared Workspace')
        await searchButton.click();
        const rows = await table.locator('tbody').locator('tr').all()
        expect(rows.length).toBe(1);

        await input.fill('random string')
        await searchButton.click();
        await expect(table).toContainText("No Shared Workspaces match your search term.")
    })

    test('Edit Shared Workspace Name and Description', async ({ page }) => {
        await page.getByRole('link', { name: 'Test Shared Workspace' }).click();
        await page.getByRole('button', { name: 'Edit Descriptions' }).click();

        await expect(page.locator('.modal-dialog')).toBeVisible();

        await page.getByLabel('title').click();
        await page.getByLabel('title').fill('');
        await page.getByLabel('title').fill('Test Shared Workspace Rename');

        await page.getByLabel('description').click();
        await page.getByLabel('description').fill('Workspace description');

        await page.getByRole('button', { name: 'Update Changes' }).click();

        await expect(page.locator('.modal-dialog')).not.toBeVisible();

        await expect(page.getByRole('heading', {level: 3})).toHaveText('Test Shared Workspace Rename')
        await expect(page.getByText('Workspace description')).toBeVisible()
    })
})