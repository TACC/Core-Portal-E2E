import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'

//note: these tests are for all 3 types of my data available on dev.cep
//TODO: get these to pick which one to use based on what portal we're testing on
test('test navigation to my data corral', async ({ page, portal, environment }) => {

  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Data Files' }).click();

  const heading = page.getByRole('heading', {level: 2});
  await expect(heading).toHaveText("My Data (Corral)");
});

test('test navigation to my data work', async ({ page, portal, environment }) => {

  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Data Files' }).click();
  await page.getByRole('link', { name: "My Data (Work)"}).click();

  const heading = page.getByRole('heading', {level: 2});
  await expect(heading).toHaveText("My Data (Work)");
});

test('test navigation to my data frontera', async ({ page, portal, environment }) => {

  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Data Files' }).click();
  await page.getByRole('link', { name: "My Data (Frontera)"}).click();

  const heading = page.getByRole('heading', {level: 2});
  await expect(heading).toHaveText("My Data (Frontera)");
});

test('test create new folder', async ({ page, portal, environment }) => {

  // Navigate to Create Folder dialog
  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Data Files' }).click();
  await page.getByRole('button', { name: '+ Add'}).click();
  await page.locator('button:has-text(" Folder")').click();

  // Test folder creation
  const folderName = page.locator('[name="dirname"]');
  await folderName.fill('qa-test-folder-1');
  await page.locator('button:has-text("Create Folder")').click();

  await expect(page.locator('div.tr:has-text("qa-test-folder-1")')).toBeVisible();

  // Delete test folder
  await page.locator('div.tr:has-text("qa-test-folder-1")').click();
  await page.locator('button:has-text("Trash")').click();


});