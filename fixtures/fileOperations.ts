import type { Page, Locator } from '@playwright/test';

//portals for which we have to scroll down to get to their folders
const scroll_portals = ['frontera', 'lccf', 'mise', 'ptdatax', 'utrc'];

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

  async goToTestStartingFolder(page: Page, location: string, projectid: string) {
    await page.getByRole('link', { name: 'My Dashboard' }).click();
    await page.getByRole('link', { name: 'Data Files', exact: true }).click();

    if (location === 'My Data (Work)') {
      await page.getByRole('link', { name: 'My Data (Work)' }).click();
      await page.getByRole('link', { name: 'e2e-test-files' }).click();
      await page.getByRole('link', { name: '00-test_data-do_not_delete' }).click();
    }
    if (location === 'Shared Workspaces') {
      await page.getByRole('link', { name: 'Shared Workspaces' }).click();
      await page.getByRole('link', { name: projectid }).click();
    }
  }

  async copyFileToTestDestination(page: Page, portal: string, sharedSystem?: string) {
    //assumes we are in test_data-do_not_delete
    await page.getByRole('button', { name: 'Copy' }).click();

    if (sharedSystem) {
      await page.getByText('Back').click();
      await page.getByRole('dialog').getByTestId('selector').selectOption('shared');
      await page.getByRole('link', { name: sharedSystem, exact: true }).click();
      await page.getByRole('row', { name: `Folder ${sharedSystem} Copy` }).getByRole('button').click();
    }
    else {
      await page.getByText('Back').click();
      await page.getByTestId('loading-spinner').waitFor({ state: "hidden" });
      if (scroll_portals.includes(portal)) {
        await page.getByText('e2e-test-filesCopy00-').dblclick();
        await page.mouse.wheel(0, 400);
      }
      await page.getByRole("link", { name: `${portal}`, exact: true }).click();
      await page.getByRole('row', { name: `Folder ${portal} Copy`, exact: true }).getByRole('button', { name: 'Copy' }).click();
    }
  }

  async goToTestDestinationFolder(page: Page, portal: string, sharedSystem?: string) {
    if (sharedSystem) {
      await page.getByRole('main').getByRole('link', { name: 'Shared Workspaces' }).click();
      await page.getByRole('link', { name: sharedSystem }).click();
    } else {
      await page.getByRole('link', { name: 'My Data (Work)' }).click();
      await page.getByText('e2e-test-files').click();
      if (scroll_portals.includes(portal)) {
        await page.locator('.data-files-table-body').dblclick();
        await page.mouse.wheel(0, 400);
      }
      await page.getByRole("link", { name: `${portal}`, exact: true }).click();
      }
  }
}
