import { test } from '../../fixtures/fileOperationsFixture';
import { expect, base } from '@playwright/test';
import { WORKBENCH_SETTINGS, PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json';

const apps = ['compress', 'extract']

const portalStorageSystems = [];
for (const system of PORTAL_DATAFILES_STORAGE_SYSTEMS) {
    portalStorageSystems.push(system.name);
}

const getAppName = (app) => {
    if (app == 'compress') {
        return WORKBENCH_SETTINGS['compressApp']['id'];
    }
    if (app == 'extract') {
        return WORKBENCH_SETTINGS['extractApp']['id'];
    }
}

// Run tests for both compress and extract back to back
for (const app of apps) {
    test.describe(`Data files ${app} tests`, () => {

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

                await page.getByRole('link', { name: 'History', exact: true }).click();

                const table = page.getByRole('table')
                const rows = await table.locator('tbody').locator('tr').all()
                const row = rows[0];
                const appNameInTable = await row.locator('td').nth(1).textContent();
                expect(appNameInTable.toLowerCase()).toContain(getAppName(app).toLowerCase());
                const status = await row.locator('td').nth(2).textContent()

                const statusIndex = statuses.indexOf(status.toUpperCase());

                try {
                    for (let i = statusIndex + 1; i < statuses.length; i++) {
                        await expect(async () => {
                            const newStatus = await row.locator('td').nth(2).textContent();
                            await expect(newStatus).toHaveText(statuses[i], { ignoreCase: true });

                        }, statuses[i - 1]).toPass({ timeout: 30000 });
                    }

                } catch (error) {
                    const status = error.message.split('\n')[0];
                    console.log(`${app} job exceeded test runtime. Last known status: ${status}`);
                }
            })

            test('successful job submission and job data', async ({ page }) => {

                await page.getByRole('link', { name: 'History', exact: true }).click();
                const table = page.getByRole('table')
                const rows = await table.locator('tbody').locator('tr').all()
                const row = rows[0];
                const statusRegExp = new RegExp(statuses.join('|'));
                await expect(row, 'Does not have a valid status').toHaveText(statusRegExp, { ignoreCase: true });
                await row.getByRole('link', { name: 'View Details', exact: true }).click();
                await expect(page.locator('dd:below(:text("App ID"))').first()).toHaveText(getAppName(app));

                if (app === 'compress') {
                    await expect(page.locator('dd:below(:text("Archive File Name"))').first()).toHaveText('testCompress');
                }
            })

        })
    })
}

