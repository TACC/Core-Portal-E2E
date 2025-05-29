import { test } from '../../fixtures/baseFixture';
import { expect } from '@playwright/test';
import {SYSTEM_MONITOR_DISPLAY_LIST} from '../../settings/custom_portal_settings.json';

test.describe('System Status page tests', () => {

    test.beforeEach(async ({ page, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.getByRole('link', { name: 'System Status' }).click();
    })

    test('All systems for portal displayed in sidebar and can be navigated between', async ({ page }) => {
        for (const system of SYSTEM_MONITOR_DISPLAY_LIST) {
            await expect(page.getByRole('link', { name: system, exact: true })).toBeVisible();

            await page.getByRole('link', { name: system, exact: true }).click();

            const headingValueApproved = (await page.getByRole('heading', { level: 2 }).innerText()).replace(/\s+/g, "");

            expect(headingValueApproved).toBe(`SystemStatus/${system}`);
        }
    })

    test('System Status table shows up on each system tab', async ({ page }) => {
        for (const system of SYSTEM_MONITOR_DISPLAY_LIST) {
            await page.getByRole('link', { name: system, exact: true }).click();

            const systemStatusTable = page.locator('table.multi-system');

            await expect(systemStatusTable.locator('tbody')).toBeVisible()

            const rows = await systemStatusTable.locator('tbody').locator('tr').all()

            expect(rows.length).toEqual(1)
        

        }
    })
    
    test('Queue status table shows up on each system tab and shows all system queues', async ({ page }) => {
        for (const system of SYSTEM_MONITOR_DISPLAY_LIST) {
            await page.getByRole('link', { name: system, exact: true }).click();
        
            const systemQueuesTable = page.locator('article').locator('table');

            await expect(systemQueuesTable.locator('tbody')).toBeVisible();

            let systemQueues = await getSystemQueues({ page: page, system: system });
            systemQueues = Object.keys(systemQueues.queues);

            if (systemQueues.length > 0) {
                for (const queue of systemQueues) {
                    await expect(systemQueuesTable.locator('tbody').locator('tr').getByRole('cell', { name: queue, exact: true })).toBeVisible();
                }
            }
            else { // if system in maintenance, tap queues response is empty, thus check for following message
                await expect(systemQueuesTable.getByText('Unable to gather system queue information')).toBeVisible();

            }
        }
    })
})

async function getSystemQueues({page, system}) {

    if (system.toLowerCase() == 'lonestar6') {
        system = 'ls6'
    }

    const systemId = `${system.toLowerCase()}.tacc.utexas.edu`;

    const url = `https://tap.tacc.utexas.edu/status/${systemId}`;
    const result = await page.request.get(url);
    return await result.json();
}
