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
  await folderName.fill('testFolder1');
  await page.locator('button:has-text("Create Folder")').click();

  // Delete test folder
  test.slow();
  await page.getByRole('checkbox', { name: 'select folder testFolder1' }).check();
  await page.locator('button:has-text("Trash")').click();
});

test('test upload file', async ({ page, portal, environment }) => {

  // Navigate to Create Folder dialog
  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Data Files' }).click();

  await page.getByRole('button', { name: '+ Add'}).click();
  await page.locator('button:has-text("Upload")').click();

  // Test upload file
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByText('Select File(s)').click();
  const fileChooser = await fileChooserPromise;
  var buf = Buffer.from("this is a test", 'utf8');
  await fileChooser.setFiles(
    [
        {"name": "testFile1", "mimeType": "text/plain", "buffer": buf}
    ],
  );
  await page.locator('button:has-text("Upload Selected")').click();
  await page.locator("button.close").click();
});