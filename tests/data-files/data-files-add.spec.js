import { base, Page } from '@playwright/test';
import { test, expect } from '../../fixtures/fileOperationsFixture'
 

test.describe('test Add button', async () => {

  test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page, baseURL }) => {
      await page.goto(baseURL);
      await page.locator('#navbarDropdown').click();
      await page.getByRole('link', { name: 'Dashboard' }).click();
      await page.getByRole('link', { name: 'Data Files' }).click();
    })

    test('test create new folder', async ({ page, fileOperations }) => {
      await fileOperations.createFolder(page, 'E2EtestFolder1');
      await page.getByTestId('loading-spinner').last().waitFor({ state: "hidden" });
      expect (await page.getByRole('checkbox', { name: 'select folder E2EtestFolder1', exact: true  }).isVisible());
    });

    test('test upload file', async ({ page, fileOperations }) => {
      await fileOperations.uploadFile(page, 'E2EtestFile1', 'File content.');
      expect (await page.getByRole('checkbox', { name: 'select file E2EtestFile1', exact: true  }).isVisible());
    });

    /** Resources clean-up */
    test('test delete and trash resources', async ({ page, fileOperations }) => {
      await fileOperations.delete(page, 'select folder E2EtestFolder1', 'select file E2EtestFile1');
      await fileOperations.emptyTrash(page);
      await expect(page.getByText('No files or folders to show.')).toBeVisible();
    })
});