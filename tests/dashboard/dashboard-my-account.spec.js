import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
 


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
  
  test('other section elements are present', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Licenses' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '3rd Party Apps' })).toBeVisible();
  });
});

