import { test } from '../../../fixtures/baseFixture'
import { expect, base } from '@playwright/test';

const app = 'extract'

test.describe.serial(`Data files ${app} tests`, () => {
    let jobSubmissionTimestamp;
    const statuses = ['PROCESSING', 'QUEUEING', 'RUNNING', 'FINISHING', 'FINISHED']

    test.beforeEach(async ({ page, portal, environment }) => {
        const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
        await page.goto(url);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files', exact: true }).click();
        await page.getByRole('link', { name: 'e2e-test-files' }).click();
        await page.getByRole('link', { name: 'test_data-do_not_delete' }).click();
    })

    test(`submit ${app} files job and monitor status`, async ({ page }) => {
    
        test.setTimeout(150000)

        await page.getByRole('checkbox', { name: 'select file testCompress.zip' }).click();
        await page.getByRole('button', { name: 'Extract' }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Extract' }).click();
        
    
    
        await expect(page.getByRole('dialog')).not.toBeVisible()
    
        const notificationContent = page.locator('.notification-toast-content')

        await expect(notificationContent).toBeVisible();
        const toastText = await notificationContent.textContent();
        const regExp = new RegExp(`${app}.* processing`)
        await expect(notificationContent).toHaveText(regExp);
        await expect(notificationContent).not.toBeVisible();

        const regex = /(\d{2}:\d{2}:\d{2})/;
        let jobSubmissionTime = regex.exec(toastText)[1]

        const date = new Date();
        let year = date.toLocaleString("default", { year: 'numeric' })
        let month = date.toLocaleString("default", { month: '2-digit' })
        let day = date.toLocaleString("default", { day: '2-digit' })

        jobSubmissionTimestamp = `${year}-${month}-${day}T${jobSubmissionTime}`
    
        try {

            for (let i = 1; i < statuses.length; i++) {
                await expect(async () => {
                    
                    await expect(notificationContent).toBeVisible();
                    const statusRegExp = new RegExp(`${app}.*${statuses[i]}`)
                    await expect(notificationContent).toHaveText(statusRegExp, { ignoreCase: true });
                    await expect(notificationContent).not.toBeVisible();

                }, statuses[i - 1]).toPass({ timeout: 30000 })
            }

        } catch (error) {
            const status = error.message.split('\n')[0]
            console.log(`Job exceeded test runtime. Last known status: ${status}`)
        }
    })

    test('check successful job submission', async ({ page }) => {
        
        await page.getByRole('link', { name: 'History', exact: true }).click();

        let regExp = new RegExp(`${app}.*${jobSubmissionTimestamp}`)
        const row =  page.locator("tr", { has: page.getByText(regExp)})

        const statusRegExp = new RegExp(statuses.join('|'))
        await expect(row.locator('td').nth(2), 'Does not have a valid status').toHaveText(statusRegExp, { ignoreCase: true })

        // Open job details modal and verify job info
        await row.getByRole('link', { name: 'View Details', exact: true }).click();
        await expect(page.locator('dd:below(:text("App ID"))').first()).toHaveText(app);
    })

})

