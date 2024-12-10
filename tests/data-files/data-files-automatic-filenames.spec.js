import { base, Page } from '@playwright/test';
import { test, expect } from '../../fixtures/fileOperationsFixture'
 

test.describe('test automatic filenames', async () => {

  test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page, baseURL }) => {
      await page.goto(baseURL);
      await page.locator('#navbarDropdown').click();
      await page.getByRole('link', { name: 'Dashboard' }).click();
      await page.getByRole('link', { name: 'Data Files' }).click();
    })

    test('test upload files with same name', async ({ page, fileOperations }) => {
      await fileOperations.uploadFile(page, 'E2EtestAutomaticFilename', 'File content.');
      await fileOperations.uploadFile(page, 'E2EtestAutomaticFilename', 'File content.');
      expect (await page.getByRole('checkbox', { name: 'select file E2EtestAutomaticFilename', exact: true  }).isVisible());
      expect (await page.getByRole('checkbox', { name: 'select file E2EtestAutomaticFilename(1)', exact: true  }).isVisible());
    });

    /** Resources clean-up */
    test('test delete and trash resources', async ({ page, fileOperations }) => {
      await fileOperations.delete(page, 'select file E2EtestAutomaticFilename', 'select file E2EtestAutomaticFilename(1)');
      await fileOperations.emptyTrash(page);
      await expect(page.getByText('No files or folders to show.')).toBeVisible();
    })
});