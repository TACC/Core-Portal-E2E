import { test } from '../../fixtures/baseFixture';
import { expect, base } from '@playwright/test';
import {SYSTEM_MONITOR_DISPLAY_LIST} from '../../settings/custom_portal_settings.json';

test.describe('System Status page tests', () => {

    test.beforeEach(async ({ page, portal, environment, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.getByRole('link', { name: 'System Status' }).click();
    })

    test('All systems for portal displayed in sidebar and can be navigated between', async ({ page }) => {
        for (const system of SYSTEM_MONITOR_DISPLAY_LIST) {
            await expect(page.getByRole('link', { name: system })).toBeVisible();

            await page.getByRole('link', { name: system }).click();

            const headingValueApproved = (await page.getByRole('heading', { level: 2 }).innerText()).replace(/\s+/g, "");

            expect(headingValueApproved).toBe(`SystemStatus/${system}`);
        }
    })

    test('System Status table shows up on each system tab', async ({ page }) => {
        for (const system of SYSTEM_MONITOR_DISPLAY_LIST) {
            await page.getByRole('link', { name: system }).click();

            const systemStatusTable = await page.locator('table.multi-system');

            await expect(systemStatusTable.locator('tbody')).toBeVisible()

            const rows = await systemStatusTable.locator('tbody').locator('tr').all()

            expect(rows.length).toEqual(1)
        

        }
    })

    async function getSystemQueues({page, system, ...options}) {

        const url = `https://tap.tacc.utexas.edu/status/${system}`;
        const request = new URL(url);

        await page.on('console', m => console.log(m));
        // return await page.evaluate(i => i, 99);
    
        return await page.evaluate(async ({url, page}) => {
            const fetchParams = {
                credentials: 'same-origin',
            };
            const cookies = await page.context().cookies();
            csrfToken = cookies.filter(cookie => cookie.name === 'csrftoken')[0];
            //console.log(csrfToken);
            fetchParams.headers = {
                'X-CSRFToken': csrfToken,
                ...fetchParams.headers,
            };
            const response = await fetch(url, fetchParams);
            const jsonResponse = response.json();

            return jsonResponse.result.queues;
    
        }, {request, page})
    }
    
    test('Queue status table shows up on each system tab and shows all system queues', async ({ page }) => {
        for (const system of SYSTEM_MONITOR_DISPLAY_LIST) {
            await page.getByRole('link', { name: system }).click();
        
            const systemQueuesTable = page.locator('article').locator('table');

            await expect(systemQueuesTable.locator('tbody')).toBeVisible();

            const systemQueuesRows = await systemQueuesTable.locator('tbody').locator('tr').all();

            const systemQueues = await getSystemQueues({ page: page, system: system.toLowerCase() });

            for (const queue of Object.keys(systemQueues)) {
                await expect(systemQueuesRows.locator('td', { name: queue })).toBeVisible();
            }

        }
    })

})