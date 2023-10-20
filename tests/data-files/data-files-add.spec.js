import { expect, base, Page } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'

test.describe('test Add button', async () => {

  test.describe.configure({ mode: 'serial' });

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
    });

    test('test upload file', async ({ page, portal, environment }) => {
      // Navigate to Create File dialog
      const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
      await page.goto(url);
      await page.locator('#navbarDropdown').click();
      await page.getByRole('link', { name: 'Dashboard' }).click();
      await page.getByRole('link', { name: 'Data Files' }).click();

      await page.getByRole('button', { name: '+ Add'}).click();
      await page.locator('button:has-text("Upload")').click();

      // Test upload file
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.getByText('Select File(s)').click(),
      ]);
      var buf = Buffer.from('this is a test', 'utf8');
      await fileChooser.setFiles(
        [
            {"name": "testFile1", "mimeType": "text/plain", "buffer": buf},
        ],
      );

      await page.locator('button:has-text("Upload Selected")').click();
      const statusMessage = page.locator('dialog span.badge');
      expect (await statusMessage.isVisible());

      await page.waitForTimeout(5000);
      await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
    });

    test('test delete test resources', async ({ browser, portal, environment }) => {
        // Create a new incognito browser context
        const context = await browser.newContext();
        // Create a new page inside context.
        const page = await context.newPage();
        // Navigate to My Data (Work)
        const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
        await page.goto(url);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files' }).click();

        // Delete resources
        test.slow();
        await page.waitForTimeout(6000);
        let trash = false;
        if (await page.getByRole('checkbox', { name: 'select folder testFolder1' }).isVisible()){
          await page.getByRole('checkbox', { name: 'select folder testFolder1' }).check();
          trash = true;
        }
        if(await page.getByRole('checkbox', { name: 'select file testFile1', exact: true }).isVisible()){
          await page.getByRole('checkbox', { name: 'select file testFile1', exact: true }).check();
          trash = true;
        }
        if (trash){
          await page.locator('button:has-text("Trash")').click();
        }
        // Dispose context once it's no longer needed.
        await context.close();
      });
});