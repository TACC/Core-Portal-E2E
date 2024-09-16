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

    test('test upload file', async ({ page, fileOperations }) => {
      /* Upload two files with the same filename */
      await fileOperations.uploadFile('E2EtestAutomaticFileName', 'File content.');
      await fileOperations.uploadFile('E2EtestAutomaticFileName', 'Same filename content.');
      expect (await page.getByRole('checkbox', { name: 'select file E2EtestAutomaticFileName', exact: true  }).isVisible());
      expect (await page.getByRole('checkbox', { name: 'select file E2EtestAutomaticFileName(2)', exact: true  }).isVisible());
    });

    /** Resources clean-up */
    test.afterAll(async ({ page, baseURL, fileOperations }) => {
      await page.goto(baseURL);
      await page.locator('#navbarDropdown').click();
      await page.getByRole('link', { name: 'Dashboard' }).click();
      await page.getByRole('link', { name: 'Data Files' }).click();

      await fileOperations.delete('select file E2EtestAutomaticFileName',
        'select file E2EtestAutomaticFileName(2)');
      await fileOperations.emptyTrash();
    })
});