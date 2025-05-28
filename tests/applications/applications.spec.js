import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { WORKBENCH_SETTINGS } from '../../settings/custom_portal_settings.json';

const hideApps = WORKBENCH_SETTINGS['hideApps'];

test.describe('Applications tests', () => {
  
  test.beforeEach(async ({ page, portal, environment, baseURL }) => {
    test.skip(hideApps === true, 'Apps hidden on portal, test skipped');
    await page.goto(baseURL);
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('link', { name: 'Applications', exact: true }).click();
  });

  test('test navigation to application page', async ({ page, portal, environment, baseURL }) => {
    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Applications');
  });

  test('OpenSeesMP application test', async ({ page, portal, environment, baseURL }) => {
    await page.locator('a .nav-text:has-text("Simulation [")').click();
    await page.getByRole('link', { name: 'OpenSeesMP V3.5 (Frontera)', exact: true }).click();

    await page.locator('input[name="fileInputs.Input Directory"]')
          .fill('tapis://cloud.data/corral/tacc/aci/CEP/community/opensees-mp/examples/smallmp');
    await page.locator('input[name="parameterSet.appArgs.TCL Script"]').fill('Example.tcl');
    const jobName = await page.locator('input[name="name"]').inputValue();
    await page.getByRole('button', { name: 'Submit'}).click();
    await page.getByTestId('loading-spinner').waitFor({ state: "hidden" });
    await page.getByRole('link', { name: 'History > Jobs'}).click();

    await page.getByTestId('loading-spinner').waitFor({ state: "hidden" });
    await expect(page.locator('tr').filter({ hasText: jobName })).toBeVisible();
    await page.locator('tr').filter({ hasText: jobName })
          .getByRole('link', { name: 'View Details' }).click();
    await expect(page.locator('.modal-title .d-inline-block')).toHaveText(jobName);
  });
});

test('test app tray application visibility', async ({ page, portal, environment, baseURL }) => {
  test.skip(hideApps === true, 'Apps hidden on portal, test skipped');
  
  const appTray = await getAppTray(page, baseURL);

  await page.goto(baseURL);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Applications', exact: true }).click();

  for (const tab of appTray) {
    const tabName = tab.title;
    await page.locator('#appBrowser-wrapper')
    .getByRole('listitem')
    .getByText(`${tabName} [${tab.apps.length}]`).click();

    for (const app of tab.apps) {
      const appName = app.label;
      const appLink = page.getByRole('link', { name: appName, exact: true });
      await expect(appLink).toBeVisible();
    }

  };
})

async function getAppTray(page, baseURL) {
    const url = `${baseURL}/api/workspace/tray`;

    const cookies = await page.context().cookies()

    const headers = {
        'Cookie': cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
    };

    const response = await page.request.get(url, {headers: headers});
    const jsonResponse = await response.json();
    return jsonResponse.tabs;
}