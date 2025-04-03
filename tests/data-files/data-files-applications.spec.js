import { test } from '../../fixtures/baseFixture';
import { expect, base } from '@playwright/test';
import { WORKBENCH_SETTINGS } from '../../settings/custom_portal_settings.json';

const apps = ['compress', 'extract']

// Run tests for both compress and extract back to back
for (const app of apps) {
    test.describe(`Data files ${app} tests`, () => {

        let jobSubmissionTimestamp; // Used to identify a job on the History page
        const statuses = ['PROCESSING', 'QUEUEING', 'RUNNING', 'FINISHING', 'FINISHED']
    
        test.beforeEach(async ({ page, portal, environment, baseURL }) => {
            await page.goto(baseURL);
            await page.locator('#navbarDropdown').click();
            await page.getByRole('link', { name: 'My Dashboard' }).click();
            await page.getByRole('link', { name: 'Data Files', exact: true }).click();
            await page.getByRole('link', { name: 'My Data (Work)' }).click();
            await page.getByRole('link', { name: 'e2e-test-files' }).click();
            await page.getByRole('link', { name: 'test_data-do_not_delete' }).click();
        })

        /* These tests are run serialized because we want to make sure that a job is 
        submitted before we can go to the History page to check it's data */

        test.describe.serial(`${app} app job submission`, () => {
            test(`submit ${app} files job and monitor status`, async ({ page }) => {
        
                test.setTimeout(150000)
    
                if (app === 'compress') {
                    await page.getByRole('checkbox', { name: 'select file testCompress1.txt' }).click();
                    await page.getByRole('button', { name: 'Compress' }).click();
                    await page.getByRole('textbox').click();
                    await page.getByRole('textbox').fill('testCompress');
                    await page.getByRole('dialog').getByRole('button', { name: 'Compress' }).click();
                } else if (app === 'extract') {
                    await page.getByRole('checkbox', { name: 'select file testCompress.zip' }).click();
                    await page.getByRole('button', { name: 'Extract' }).click();
                    await page.getByRole('dialog').getByRole('button', { name: 'Extract' }).click();
                }
            
            
                await expect(page.getByRole('dialog')).not.toBeVisible()
            
                const notificationContent = page.locator('.notification-toast-content')
        
                await expect(notificationContent).toBeVisible();
                const toastText = await notificationContent.textContent();
                const regExp = new RegExp(`${app}.* processing`)
                await expect(notificationContent).toHaveText(regExp);
                await expect(notificationContent).toBeVisible();
        
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
                    console.log(`${app} job exceeded test runtime. Last known status: ${status}`)
                }
            })
        
            test('successful job submission and job data', async ({ page }) => {
                let appName;

                if (app == 'compress'){
                    appName = WORKBENCH_SETTINGS['compressApp']['id'];
                }
                if (app == 'extract'){
                    appName = WORKBENCH_SETTINGS['extractApp']['id'];
                }
                        
                await page.getByRole('link', { name: 'History', exact: true }).click();
                const regExp = new RegExp(`${appName}.*${jobSubmissionTimestamp}`);
                const row =  page.locator("tr", { hasText: regExp});
                const statusRegExp = new RegExp(statuses.join('|'));
                await expect(row, 'Does not have a valid status').toHaveText(statusRegExp, { ignoreCase: true })
                await row.getByRole('link', { name: 'View Details', exact: true }).click();
                await expect(page.locator('dd:below(:text("App ID"))').first()).toHaveText(appName);
    
                if (app === 'compress') {
                    await expect(page.locator('dd:below(:text("Archive File Name"))').first()).toHaveText('testCompress');
                }
            })
            
        })
    })
}

