import { expect } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { PORTAL_PROJECTS_SYSTEM_PREFIX } from '../../settings/custom_portal_settings.json'

test('Cleanup shared workspaces', async ({ page, baseURL, tapisTenantBaseUrl }) => {

    const tenant = tapisTenantBaseUrl;
    const projectPrefix = PORTAL_PROJECTS_SYSTEM_PREFIX;

    let systems = []

    try {
        const accessToken = await getAccessToken(page, baseURL)
        
        systems = await getSystems(page, tenant, projectPrefix, accessToken)

        console.log(`Teardown: Found ${systems.length} shared workspaces to delete ${systems}`)
    
        for (const system of systems) {
            await deleteSystem(page, system.id, tenant, accessToken)
            console.info(`Teardown: Shared workspace with id ${system.id} deleted`)
        }
    } catch (e) {
        console.error(`An error occured when deleting shared workspaces: ${e.message}`)
    }

    // Ensure there are no shared workspaces left over
    await page.goto(baseURL);
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('link', { name: 'Data Files' }).click();
    await page.getByRole('main').getByRole('link', { name: 'Shared Workspaces' }).click();

    const table = page.getByRole('table').and(page.locator('.projects-listing'))
    const rows = await table.locator('tbody').locator('tr').all()

    if (rows.length > 0) {
        const links = await page.locator('.data-files-nav-link').all();

        for (const system of systems) {
            for (const link of links) {
                const href = await link.getAttribute('href');
                expect(href).not.toContain(system.id);
            }    
        }
    }
})

async function getAccessToken(page, baseURL) {
    const url = `${baseURL}/api/auth/tapis`;

    const cookies = await page.context().cookies()

    const headers = {
        'Cookie': cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
    };

    const response = await page.request.get(url, {headers: headers});
    const jsonResponse = await response.json();
    return jsonResponse.token;
}


async function getSystems(page, tenant, projectPrefix, accessToken) {

    console.log('Getting systems with prefix: ', projectPrefix)
    // get systems that match the prefix of the current portal
    const url = `${tenant}/v3/systems?search=(id.like.${projectPrefix}*)`;

    return await page.evaluate(async ({url, accessToken}) => {
        const response = await fetch(url, {
            headers: {
                "X-Tapis-Token": accessToken
            }
        });

        const jsonResponse = await response.json();
        return jsonResponse.result;

    }, {url, accessToken})
}

async function deleteSystem(page, systemId, tenant, accessToken) {

    const url = `${tenant}/v3/systems/${systemId}/delete`;

    return await page.evaluate(async ({url, accessToken}) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "X-Tapis-Token": accessToken
            } 
        });

        return await response.json();
    }, {url, accessToken})
}