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
      await fileOperations.createFolder('E2EtestFolder1');
      page.waitForTimeout(5000);
      expect (await page.getByRole('checkbox', { name: 'select file E2EtestFile1' }).isVisible());
    });

    test('test upload file', async ({ page, fileOperations }) => {
      await fileOperations.uploadFile('E2EtestFile1', 'File content.');
      expect (await page.getByRole('checkbox', { name: 'select file E2EtestFile1' }).isVisible());
    });

    /** Resources clean-up */
    test.afterAll(async ({ page, baseURL, fileOperations }) => {
      await page.goto(baseURL);
      await page.locator('#navbarDropdown').click();
      await page.getByRole('link', { name: 'Dashboard' }).click();
      await page.getByRole('link', { name: 'Data Files' }).click();

      await fileOperations.delete('E2EtestFolder1', 'E2EtestFile1');
      page.waitForTimeout(5000);
      await fileOperations.emptyTrash();
    })
});