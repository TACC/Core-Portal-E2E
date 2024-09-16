import type { Page, Locator } from '@playwright/test';

export class FileOperations {
    constructor(public readonly page: Page) {
    }

    async createFolder(folderName: string) {
      // Navigate to Create Folder dialog
      await this.page.getByRole('button', { name: '+ Add'}).click();
      await this.page.locator('button:has-text(" Folder")').click();

      // Create folder
      await this.page.locator('[name="dirname"]').fill(folderName);
      await this.page.locator('button:has-text("Create Folder")').click();
    }

    async uploadFile(fileName: string, fileContent: string) {
      // Navigate to Upload File dialog
      await this.page.getByRole('button', { name: '+ Add'}).click();
      await this.page.locator('button:has-text("Upload")').click();

      // Upload file
      const [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        this.page.getByText('Select File(s)').click(),
      ]);
      var buf = Buffer.from(fileContent, 'utf8');
      await fileChooser.setFiles(
        [
            {"name": fileName, "mimeType": "text/plain", "buffer": buf},
        ],
      );

      await this.page.locator('button:has-text("Upload Selected")').click();
      await this.page.getByTestId('loading-spinner').last().isHidden();
      await this.page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
    }
    
    async delete(...resourceNameArr: string[]) {
      // Delete resources
      let trash = false;
      await this.page.getByTestId('loading-spinner').waitFor({ state: "hidden" });
      for (var i in resourceNameArr) {
        if (await this.page.getByRole('checkbox', { name: resourceNameArr[i], exact: true  }).isVisible()){
            await this.page.getByRole('checkbox', { name: resourceNameArr[i], exact: true  }).check();
            trash = true;
          }
      }
      if (trash){
        await this.page.locator('button:has-text("Trash")').click();
        await this.page.waitForTimeout(3000);
      }
    }

    async emptyTrash() {
      // Empty trash
      await this.page.getByRole('link', { name: '.Trash' }).click();
      await this.page.getByTestId('loading-spinner').waitFor({ state: "hidden" });
      const emptyBttn = this.page.locator('button:has-text("Empty")');
      if (await emptyBttn.isEnabled()){
          await emptyBttn.click();
          await this.page.getByRole('button', { name: 'Delete Files' }).click();
      }
    }
}