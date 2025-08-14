import { test } from '../../fixtures/fileOperationsFixture';
import { expect, base } from '@playwright/test';
import { WORKBENCH_SETTINGS, PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json';

const apps = ['compress', 'extract']

const portalStorageSystems = [];
for (const system of PORTAL_DATAFILES_STORAGE_SYSTEMS) {
    portalStorageSystems.push(system.name);
}

// Run tests for both compress and extract back to back
for (const app of apps) {
    test.describe(`Data files ${app} tests`, () => {

        let jobSubmissionTimestamp; // Used to identify a job on the History page
        const statuses = ['PROCESSING', 'QUEUEING', 'RUNNING', 'FINISHING', 'FINISHED']

        test.beforeEach(async ({ page, portal, baseURL, fileOperations }) => {
            await page.goto(baseURL);
            await page.locator('#navbarDropdown').click();
            //check to see if My Data Work exists on this portal
            if (!portalStorageSystems.includes('My Data (Work)')) {
                test.skip(true, "My Data Work does not exist, skip");
            }
            await fileOperations.goToTestStartingFolder(page, 'My Data (Work)', portal, '');
        })

        /* These tests are run serialized because we want to make sure that a job is
        submitted before we can go to the History page to check it's data */

        test.describe.serial(`${app} app job submission`, () => {
            test(`submit ${app} files job and monitor status`, async ({ page, portal, fileOperations }) => {

                test.setTimeout(150000)

                if (app === 'compress') {
                    await page.getByRole('checkbox', { name: 'select file testCompress1.txt' }).click();
                    await fileOperations.copyFileToTestDestination(page, portal);
                    await fileOperations.goToTestDestinationFolder(page, portal);
                    await page.getByRole('checkbox', { name: 'select file testCompress1.txt' }).click();
                    await page.getByRole('button', { name: 'Compress' }).click();
                    await page.getByRole('textbox').click();
                    await page.getByRole('textbox').fill('testCompress');
                    await page.getByRole('dialog').getByRole('button', { name: 'Compress' }).click();
                } else if (app === 'extract') {
                    await page.getByRole('checkbox', { name: 'select file testCompress.zip' }).click();
                    await fileOperations.copyFileToTestDestination(page, portal);
                    await fileOperations.goToTestDestinationFolder(page, portal);
                    await page.getByRole('checkbox', { name: 'select file testCompress.zip' }).click();
                    await page.getByRole('button', { name: 'Extract' }).click();
                    await page.getByRole('dialog').getByRole('button', { name: 'Extract' }).click();
                }


                await expect(page.getByRole('dialog')).toBeVisible()

                const notificationContent = page.locator('.notification-toast-content')

                await expect(notificationContent).toBeVisible();
                const toastText = await notificationContent.textContent();
                const regExp = new RegExp(`${app}.* processing`);
                await expect(notificationContent).toHaveText(regExp);
                await expect(notificationContent).toBeVisible();

                const regex = /(\d{2}:\d{2}:\d{2})/;
                let jobSubmissionTime = regex.exec(toastText)[1];

                const date = new Date();
                let year = date.toLocaleString("default", { year: 'numeric' });
                let month = date.toLocaleString("default", { month: '2-digit' });
                let day = date.toLocaleString("default", { day: '2-digit' });

                jobSubmissionTimestamp = `${year}-${month}-${day}T${jobSubmissionTime}`;

                try {
                    for (let i = 1; i < statuses.length; i++) {
                        await expect(async () => {

                            await expect(notificationContent).toBeVisible();
                            const statusRegExp = new RegExp(`${app}.*${statuses[i]}`);
                            await expect(notificationContent).toHaveText(statusRegExp, { ignoreCase: true });
                            await expect(notificationContent).not.toBeVisible();

                        }, statuses[i - 1]).toPass({ timeout: 30000 });
                    }

                } catch (error) {
                    const status = error.message.split('\n')[0];
                    console.log(`${app} job exceeded test runtime. Last known status: ${status}`);
                }
            })

            test('successful job submission and job data', async ({ page }) => {
                let appName;

                if (app == 'compress') {
                    appName = WORKBENCH_SETTINGS['compressApp']['id'];
                }
                if (app == 'extract') {
                    appName = WORKBENCH_SETTINGS['extractApp']['id'];
                }

                await page.getByRole('link', { name: 'History', exact: true }).click();
                const regExp = new RegExp(`${appName}.*${jobSubmissionTimestamp}`);
                const row = page.locator("tr", { hasText: regExp });
                const statusRegExp = new RegExp(statuses.join('|'));
                await expect(row, 'Does not have a valid status').toHaveText(statusRegExp, { ignoreCase: true });
                await row.getByRole('link', { name: 'View Details', exact: true }).click();
                await expect(page.locator('dd:below(:text("App ID"))').first()).toHaveText(appName);

                if (app === 'compress') {
                    await expect(page.locator('dd:below(:text("Archive File Name"))').first()).toHaveText('testCompress');
                }
            })

        })
    })
}

