import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';
import { PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json';

let has3rdPartyIntegrations = false;
for (const entry of PORTAL_DATAFILES_STORAGE_SYSTEMS) {
  if (entry.integration) {
    has3rdPartyIntegrations = true;
    break;
  }
}

test.describe('My Account page tests', () => {
  
  test.beforeEach(async ({ page, portal, environment, baseURL }) => {
    await page.goto(baseURL);
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'My Account' }).click();
  });
  
  test('test navigation to correct page', async ({ page }) => {
    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Manage Account');
  });
  
  test('back to dashboard button exists and redirects correctly', async ({ page, portal, environment, baseURL }) => {
    const backToDashboardButton = page.getByRole('link', { name: 'Back to Dashboard' });
    expect(await backToDashboardButton.getAttribute('href')).toEqual('/workbench/dashboard');
  
    await backToDashboardButton.click();
    expect(page.url()).toEqual(`${baseURL}/workbench/dashboard`)
  
  });
  
  test('profile information exists and edit profile information redirects correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Profile Information' })).toBeVisible();
    const editProfileInformationButton = page.getByRole('link', { name: 'Edit Profile Information' });
    expect(await editProfileInformationButton.getAttribute('href')).toEqual('https://accounts.tacc.utexas.edu/profile');
  });
  
  test('change password exists and redirects correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Password Information' })).toBeVisible();
    const editProfileInformationButton = page.getByRole('link', { name: 'Change Password' });
    expect(await editProfileInformationButton.getAttribute('href')).toEqual('https://accounts.tacc.utexas.edu/change_password');
  });
  
  test('licenses section element is present', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Licenses' })).toBeVisible();
  });

  test('3rd party integrations section element is present', async ({ page }) => {
    test.skip(has3rdPartyIntegrations === false, '3rd party integrations not on portal, test skipped');
    await expect(page.getByRole('heading', { name: '3rd Party Apps' })).toBeVisible();
  });
});

