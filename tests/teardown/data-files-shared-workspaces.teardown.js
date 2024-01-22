import { expect } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
import { PORTAL_PROJECTS_SYSTEM_PREFIX } from '../../settings/custom_portal_settings.json'

test('Cleanup shared workspaces', async ({ page, baseURL }) => {
    const {USERNAME: username, PASSWORD: password} = process.env;

    const tenant = 'https://portals.tapis.io';
    const projectPrefix = PORTAL_PROJECTS_SYSTEM_PREFIX;

    try {
        const accessToken = await getAccessToken(page, username, password, tenant)

        const systems = await getSystems(page, tenant, projectPrefix, accessToken)
    
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

    await expect(page.locator('.projects-listing')).toContainText("You don't have any Shared Workspaces.")

})

async function getAccessToken(page, username, password, tenant) {

    const url = `${tenant}/v3/oauth2/tokens`;

    const data = {
        username: username, 
        password: password, 
        grant_type: 'password'
    }

    return await page.evaluate(async ({url, data}) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const jsonResponse = await response.json();
        return jsonResponse.result.access_token.access_token;
    }, {url, data});

}

async function getSystems(page, tenant, projectPrefix, accessToken) {

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