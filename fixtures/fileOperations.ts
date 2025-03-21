import type { Page, Locator } from '@playwright/test';

export class FileOperations {
  constructor(public readonly page: Page) {
  }

  async createFolder(page: Page, folderName: string) {
    // Navigate to Create Folder dialog
    await page.getByRole('button', { name: '+ Add' }).click();
    await page.locator('button:has-text(" Folder")').click();

    // Create folder
    await page.locator('[name="dirname"]').fill(folderName);
    await page.locator('button:has-text("Create Folder")').click();
  }

  async uploadFile(page: Page, fileName: string, fileContent: string) {
    // Navigate to Upload File dialog
    await page.getByRole('button', { name: '+ Add' }).click();
    await page.locator('button:has-text("Upload")').click();

    // Upload file
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByText('Select File(s)').click(),
    ]);
    var buf = Buffer.from(fileContent, 'utf8');
    await fileChooser.setFiles(
      [
        { "name": fileName, "mimeType": "text/plain", "buffer": buf },
      ],
    );

    await page.locator('button:has-text("Upload Selected")').click();
    await page.getByTestId('loading-spinner').last().isHidden();
  }

  async delete(page: Page, ...resourceNameArr: string[]) {
    // Delete resources
    let trash = false;
    await page.getByTestId('loading-spinner').waitFor({ state: "hidden" });
    for (var i in resourceNameArr) {
      if (await page.getByRole('checkbox', { name: resourceNameArr[i], exact: true }).isVisible()) {
        await page.getByRole('checkbox', { name: resourceNameArr[i], exact: true }).check();
        trash = true;
      }
    }
    if (trash) {
      await page.locator('button:has-text("Trash")').click();
      await page.waitForTimeout(3000);
    }
  }

  async emptyTrash(page: Page) {
    // Empty trash
    await page.getByRole('link', { name: '.Trash' }).click();
    await page.getByTestId('loading-spinner').waitFor({ state: "hidden" });
    const emptyBttn = page.locator('button:has-text("Empty")');
    if (await emptyBttn.isEnabled()) {
      await emptyBttn.click();
      await page.getByRole('button', { name: 'Delete Files' }).click();
    }
  }

  async copyFileToTestDestination(page: Page) {
    //assumes we are in test_data-do_not_delete
    await page.getByRole('button', { name: 'Copy' }).click();
    await page.getByText('Back').click();
    await page.getByText('test_data_destination').click();
    await page.getByRole('row', { name: 'Folder test_data_destination Copy' }).getByRole('button', { name: 'Copy' }).click();
  }

  async goToTestDestinationFolder(page: Page) {
    await page.getByRole('link', { name: 'My Data (Work)' }).click();
    await page.getByText('e2e-test-files').click();
    await page.getByText('test_data_destination').click();
  }
}