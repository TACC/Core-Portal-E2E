import { test } from '../../fixtures/baseFixture'
import { expect, base } from '@playwright/test';
import { WORKBENCH_SETTINGS } from '../../settings/custom_portal_settings.json';
 
const jobsv2Title = WORKBENCH_SETTINGS['jobsv2Title'];
 


test.describe('History Page Navigation Tests', () => {
    test.beforeEach(async ({ page, portal, environment, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.getByRole('link', { name: 'History', exact: true }).click();
    })

    test('Correct heading and elements are displayed', async ({ page }) => {

        const heading = page.getByRole('heading', { level: 2 })
        await expect(heading).toHaveText('History / Jobs')
        const messageVisible = await page.getByRole('table').getByRole('status', { name: 'message' }).isVisible()

        if (messageVisible) {
            const message = page.getByRole('status', { name: 'message' })
            await expect(message).toHaveText('No recent jobs. You can submit jobs from the Applications Page.')

            const applicationsPageLink = page.getByRole('link', { name: 'Applications Page' })

            expect(await applicationsPageLink.getAttribute('href')).toEqual('/workbench/applications')
        }
    })

    test('Jobv2 tab is displayed and redirects correctly', async ({ page, portal, environment, baseURL }) => {
        await expect(page.getByRole('link', { name: jobsv2Title })).toBeVisible();

        await page.getByRole('link', { name: jobsv2Title }).click();

        const heading = page.getByRole('heading', { level: 2 })
        await expect(heading).toHaveText('History / ' + jobsv2Title)

        const url = baseURL
        expect(page.url()).toBe(`${url}/workbench/history/jobsv2`)
    })
})