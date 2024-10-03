import { test } from '../../fixtures/baseFixture';
import { expect, base } from '@playwright/test';
import { WORKBENCH_SETTINGS } from '../../settings/custom_portal_settings.json';

const hideAllocations = WORKBENCH_SETTINGS['hideAllocations'];


test.describe('Allocation Page Tests', () => {
    test.skip(hideAllocations === true, 'Allocations hidden on portal, test skipped');

    test.beforeEach(async ({ page, portal, environment, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.locator('#react-root').getByRole('link', { name: 'Allocations' }).click();
    })

    test('Request New Allocation button is clickable and opens new tab', async ({ page }) => {

        const requestNewAllocationButton = page.getByRole('link', { name: 'Request New Allocation' })

        expect(await requestNewAllocationButton.getAttribute('href')).toEqual('https://submit-tacc.xras.org/')

        const requestNewAllocationPagePromise = page.waitForEvent('popup');
        await requestNewAllocationButton.click();
        const requestNewAllocationPage = await requestNewAllocationPagePromise;

        expect(requestNewAllocationPage.url()).toEqual('https://submit-tacc.xras.org/login')
    })

    test('View Team modal open and close flow', async ({ page }) => {
        await page.getByRole('button', { name: 'View Team' }).nth(0).click();
        await expect(page.locator('.modal-dialog')).toBeVisible();
        await expect(page.getByRole('tab', { name: 'View Team' })).toBeVisible();
        await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
        await expect(page.locator('.modal-dialog')).not.toBeVisible();

    })

    test('Correct sidebar items displayed and can be navigated between', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Approved' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Expired' })).toBeVisible();

        const headingValueApproved = (await page.getByRole('heading', { level: 2 }).innerText()).replace(/\s+/g, "");

        expect(headingValueApproved).toBe('Allocations/Approved');

        await page.getByRole('link', { name: 'Expired' }).click();

        const headingValueExpired = (await page.getByRole('heading', { level: 2 }).innerText()).replace(/\s+/g, "");

        expect(headingValueExpired).toBe('Allocations/Expired');

    })

})