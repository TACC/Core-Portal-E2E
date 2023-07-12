import { test } from '../../fixtures/baseFixture'
import { expect, base } from '@playwright/test';


test.describe('History Page Navigation Tests', () => {
    test.beforeEach(async ({ page, portal, environment }) => {
        const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
        await page.goto(url);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.getByRole('link', { name: 'History', exact: true }).click();
    })

    test('Correct heading and elements are displayed', async ({ page }) => {

        const heading = page.getByRole('heading', { level: 2 })
        await expect(heading).toHaveText('History / Jobs')
        const messageVisible = await page.getByRole('status', { name: 'message' }).isVisible()

        if (messageVisible) {
            const message = page.getByRole('status', { name: 'message' })
            await expect(message).toHaveText('No recent jobs. You can submit jobs from the Applications Page.')

            const applicationsPageLink = page.getByRole('link', { name: 'Applications Page' })

            expect(await applicationsPageLink.getAttribute('href')).toEqual('/workbench/applications')
        }
    })

    test('Jobv2 tab is displayed and redirects correctly', async ({ page, portal, environment }) => {
        await expect(page.getByRole('link', { name: 'Pre-April 2023' })).toBeVisible();

        await page.getByRole('link', { name: 'Pre-April 2023' }).click();

        const heading = page.getByRole('heading', { level: 2 })
        await expect(heading).toHaveText('History / Pre-April 2023')

        const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
        expect(page.url()).toBe(`${url}/workbench/history/jobsv2`)
    })
})