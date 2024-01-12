import { expect, base, Page } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
import { PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json'

const portalStorageSystems = PORTAL_DATAFILES_STORAGE_SYSTEMS

test.describe.configure({ mode: 'serial' })

test.describe('Shared Workspaces tests', () => {

    // Skip the tests if portal does not have Shared Workspaces
    test.skip(!portalStorageSystems.some(system => (system.name === 'Shared Workspaces' && system.scheme === 'projects')))

    test.beforeEach(async ({ page, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files' }).click();
        await page.getByRole('main').getByRole('link', { name: 'Shared Workspaces' }).click();
    })

    test('Add Shared Workspace', async ({ page }) => {
        await page.getByRole('button', { name: '+ Add' }).click();
        await page.getByRole('menuitem', { name: 'Shared Workspace' }).click();

        await expect(page.locator('.modal-dialog')).toBeVisible();
        await page.getByRole('textbox').click();
        await page.getByRole('textbox').fill('Test Shared Workspace');
        
        await expect(page.locator('.project-members__cell').nth(0)).toContainText('WMA Test User')

        await page.getByRole('button', { name: 'Add Workspace' }).click();

        await expect(page.locator('.modal-dialog')).not.toBeVisible();

        await expect(page.locator('.listing-placeholder')).toBeVisible();

        await expect(page.getByRole('heading', {level: 3})).toHaveText('Test Shared Workspace')
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