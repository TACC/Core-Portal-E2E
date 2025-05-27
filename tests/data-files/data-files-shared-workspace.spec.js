import { expect } from '@playwright/test';
import { test } from '../../fixtures/fileOperationsFixture';

import { PORTAL_DATAFILES_STORAGE_SYSTEMS } from '../../settings/custom_portal_settings.json';

const portalStorageSystems = PORTAL_DATAFILES_STORAGE_SYSTEMS

test.describe.configure({ mode: 'serial' })

test.describe('Shared Workspaces tests', () => {

    // Skip the tests if portal does not have Shared Workspaces
    test.skip(!portalStorageSystems.some(system => (system.scheme === 'projects')))

    test.beforeEach(async ({ page, baseURL }) => {
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files' }).click();
        await page.getByRole('main').getByRole('link', { name: 'Shared Workspaces' }).click();
    })

    test('Add Shared Workspace', async ({ page }) => {
        test.setTimeout(100000)
        await page.getByRole('button', { name: '+ Add' }).click();
        await page.getByRole('menuitem', { name: 'Shared Workspace' }).click();

        await expect(page.locator('.modal-dialog')).toBeVisible();
        await page.getByRole('textbox').click();
        await page.getByRole('textbox').fill('Test Shared Workspace');
        
        await expect(page.locator('.project-members__cell').nth(0)).toContainText('WMA Test User')

        await page.getByRole('button', { name: 'Add Workspace' }).click();

        await expect(page.locator('.modal-dialog')).not.toBeVisible({timeout: 20000});

        await expect(page.locator('.listing-placeholder')).toBeVisible();

        await expect(page.getByRole('heading', {level: 3})).toHaveText('Test Shared Workspace')

        await page.getByRole('main').getByRole('link', { name: 'Shared Workspaces' }).click();

        const table = page.getByRole('table').and(page.locator('.projects-listing'))
        const rows = await table.locator('tbody').locator('tr').all()

        expect(rows.length).toBeGreaterThanOrEqual(1);

    })

    test('Shared Workspace Search', async ({ page }) => {
        const input = page.getByRole('form', { name: 'Workspace Search' }).locator('input')
        const searchButton = page.getByRole('form', { name: 'Workspace Search' }).getByRole('button', { name: 'Search', exact: true })
        const table = page.getByRole('table').and(page.locator('.projects-listing'))

        await input.fill('Test Shared Workspace')
        await searchButton.click();
        const rows = await table.locator('tbody').locator('tr').all()
        expect(rows.length).toBe(1);

        await input.fill('random string')
        await searchButton.click();
        await expect(table).toContainText("No Shared Workspaces match your search term.")
    })

    test('Edit Shared Workspace Name and Description', async ({ page }) => {
        await page.getByRole('link', { name: 'Test Shared Workspace' }).click();
        await page.getByRole('button', { name: 'Edit Descriptions' }).click();

        await expect(page.locator('.modal-dialog')).toBeVisible();

        await page.getByLabel('title').click();
        await page.getByLabel('title').fill('');
        await page.getByLabel('title').fill('Test Shared Workspace Rename');

        await page.getByLabel('description').click();
        await page.getByLabel('description').fill('Workspace description');

        await page.getByRole('button', { name: 'Update Changes' }).click();

        await expect(page.locator('.modal-dialog')).not.toBeVisible();

        await expect(page.getByRole('heading', {level: 3})).toHaveText('Test Shared Workspace Rename')
        await expect(page.getByText('Workspace description')).toBeVisible()
    })

    test('Rename File', async ({ page, fileOperations }) => {
            await page.getByRole('link', { name: 'E2E Test Shared Workspace' }).click();
            await page.getByRole('link', { name: 'e2e-test-files' }).click();
            await page.getByRole('link', { name: 'test_data-do_not_delete' }).click();
            //click into the data files area
            await expect(page.locator('.data-files-table-body')).toBeVisible();
            await page.locator('.data-files-table-body').dblclick();
            //scroll down
            await page.mouse.wheel(0, 400);
    
            //select the file
            await page.getByRole('checkbox', { name: 'select file testRename.txt' }).click();
            //copy the file
            await fileOperations.copyFileToTestDestination(page);
    
            //go to the test_data_destination directory and check the file is there
            await page.getByRole('link', { name: 'Shared Workspaces' }).click();
            await page.getByRole('link', { name: 'E2E Test Shared Workspace' }).click();
            await page.getByText('e2e-test-files').click();
            await page.getByText('test_data_destination').click();
            const copied_file = page.getByRole('link', { name: 'testRename.txt' });
            await expect(copied_file).toBeVisible();
    
            //do the rename
            await page.getByLabel('select file testRename.txt').click();
            await page.getByRole('button', { name: 'Rename' }).click();
            await page.getByRole('textbox').click();
            await page.getByRole('textbox').fill('testRenameTest.txt');
            await page.getByRole('dialog').getByRole('button', { name: 'Rename' }).click();
            const renamed_file = page.getByRole('link', { name: 'testRenameTest.txt' })
            await expect(renamed_file).toBeVisible();
    
            //trash the renamed file
            await page.getByLabel('select file testRenameTest.txt').click();
            await page.getByRole('button', { name: 'Trash' }).click();
            expect(renamed_file).toBeUndefined;
        })
    
        test('Copy File', async ({ page, fileOperations }) => {
            await page.getByRole('link', { name: 'E2E Test Shared Workspace' }).click();
            await page.getByRole('link', { name: 'e2e-test-files' }).click();
            await page.getByRole('link', { name: 'test_data-do_not_delete' }).click();
            //click into the data files area
            await expect(page.locator('.data-files-table-body')).toBeVisible();
            await page.locator('.data-files-table-body').dblclick();
            //scroll down
            await page.mouse.wheel(0, 400);
            //select the file
            await page.getByRole('checkbox', { name: 'select file testCopy.txt' }).click();
            //copy the file to the test directory
            await fileOperations.copyFileToTestDestination(page);
    
            //go to the test_data_destination directory and check the file is there
            await page.getByRole('link', { name: 'Shared Workspaces' }).click();
            await page.getByRole('link', { name: 'E2E Test Shared Workspace' }).click();
            await page.getByText('e2e-test-files').click();
            await page.getByText('test_data_destination').click();
            const copied_file = page.getByRole('link', { name: 'testCopy.txt' });
            await expect(copied_file).toBeVisible();
    
            //trash the copied file
            await page.getByLabel('select file testCopy.txt').click();
            await page.getByRole('button', { name: 'Trash' }).click();
            expect(copied_file).toBeUndefined;
        })
    
        test('Move File', async ({ page, fileOperations }) => {
            await page.getByRole('link', { name: 'E2E Test Shared Workspace' }).click();
            await page.getByRole('link', { name: 'e2e-test-files' }).click();
            await page.getByRole('link', { name: 'test_data-do_not_delete' }).click();
            //click into the data files area
            await expect(page.locator('.data-files-table-body')).toBeVisible();
            await page.locator('.data-files-table-body').dblclick();
            //scroll down
            await page.mouse.wheel(0, 200);
    
            //select the file
            await page.getByRole('checkbox', { name: 'select file testMove.txt' }).click();
            //copy the file
            await fileOperations.copyFileToTestDestination(page);
    
            //go to the test_data_destination directory and check the file is there
            await page.getByRole('link', { name: 'Shared Workspaces' }).click();
            await page.getByRole('link', { name: 'E2E Test Shared Workspace' }).click();
            await page.getByText('e2e-test-files').click();
            await page.getByText('test_data_destination').click();
            const copied_file = page.getByRole('link', { name: 'testMove.txt' });
            await expect(copied_file).toBeVisible();
    
            //do a move
            await page.getByRole('checkbox', { name: 'select file testMove.txt' }).click();
            await page.getByRole('button', { name: 'Move' }).click();
            //need some extra wait time for the modal to load
            //otherwise this part times out
            //dunno why this modal takes a little longer
            await page.waitForTimeout(250);
            await page.getByRole('button', { name: 'Back' }).click();
            await page.getByRole('row', { name: 'Folder e2e-test-files Move' }).getByRole('button', { name: 'Move' }).click();
    
            //check for the moved file
            await page.getByRole('link', { name: 'Shared Workspaces' }).click();
            await page.getByRole('link', { name: 'E2E Test Shared Workspace' }).click();
            await page.getByRole('link', { name: 'e2e-test-files' }).click();
            const moved_file = page.getByRole('link', { name: 'testMove.txt' });
            await expect(moved_file).toBeVisible();
    
            //trash the moved file
            await page.getByLabel('select file testMove.txt').click();
            await page.getByRole('button', { name: 'Trash' }).click();
            expect(moved_file).toBeUndefined;
        })
    
        test('Download File', async ({ page, fileOperations }) => {
            //select the file
            await page.getByRole('checkbox', { name: 'select file testDownload.txt' }).click();
            //copy the file
            await fileOperations.copyFileToTestDestination(page);
    
            //go to the test_data_destination directory and check the file is there
            await fileOperations.goToTestDestinationFolder(page);
            const copied_file = page.getByRole('link', { name: 'testDownload.txt' });
            await expect(copied_file).toBeVisible();
    
            //do the download
            const downloadPromise = page.waitForEvent('download');
            await page.getByRole('checkbox', { name: 'select file testDownload.txt' }).click();
            await page.getByRole('button', { name: 'Download' }).click();
            const download = await downloadPromise;
            expect(download.suggestedFilename()).toEqual("testDownload.txt");
    
            //trash the file
            //do not need to re-select the file
            //it does not unselect when using operation button
            await page.getByRole('button', { name: 'Trash' }).click();
            expect(copied_file).toBeUndefined;
        })
    
        test('Link File', async ({ page, fileOperations }) => {
            test.skip(makeLink === false, 'Link File hidden on portal, test skipped');
    
            //click into the data files area
            await expect(page.locator('.data-files-table-body')).toBeVisible();
            await page.locator('.data-files-table-body').dblclick();
            //scroll down
            await page.mouse.wheel(0, 200);
    
            //select the file
            await page.getByRole('checkbox', { name: 'select file testLink.txt' }).click();
            //copy the file
            await fileOperations.copyFileToTestDestination(page);
    
            //go to the test_data_destination directory and check the file is there
            await fileOperations.goToTestDestinationFolder(page);
            const copied_file = page.getByRole('link', { name: 'testLink.txt' });
            await expect(copied_file).toBeVisible();
    
            //do the link testing
            await page.getByRole('checkbox', { name: 'select file testLink.txt' }).click();
            await page.getByRole('button', { name: 'Link' }).click();
            await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
            await page.getByRole('button', { name: 'Generate Link' }).click();
            const link = await page.getByRole('textbox').getAttribute('value');
            expect(link).toContain("https://portals.tapis.io/v3/files/postits/redeem/");
            //clipboard check for copy button
            await page.getByRole('dialog').getByRole('button', { name: 'Copy' }).click();
            let clipboardText = await page.evaluate("navigator.clipboard.readText()");
            expect(clipboardText).toEqual(link);
            //"replace link" check
            await page.getByRole('button', { name: 'Replace Link' }).click();
            await page.getByRole('button', { name: 'Confirm' }).click();
            const link2 = await page.getByRole('textbox').getAttribute('value');
            expect(link2).toContain("https://portals.tapis.io/v3/files/postits/redeem/");
            //"delete" check
            await page.getByRole('button', { name: 'Delete' }).click();
            await page.getByRole('button', { name: 'Confirm' }).click();
            const empty_link = await page.getByRole('textbox').getAttribute('value');
            expect(empty_link).toContain('');
            await page.getByRole('dialog').getByLabel('Close').click();
    
            //trash the file
            //do not need to re-select the file
            //it does not unselect when using operation button
            await page.getByRole('button', { name: 'Trash' }).click();
            expect(copied_file).toBeUndefined;
        })
    
        test('Trash File', async ({ page, fileOperations }) => {
            //click into the data files area
            await expect(page.locator('.data-files-table-body')).toBeVisible();
            await page.locator('.data-files-table-body').dblclick();
            //scroll down
            await page.mouse.wheel(0, 400);
    
            //select the file
            await page.getByRole('checkbox', { name: 'select file testTrash.txt' }).click();
            //copy the file
            await fileOperations.copyFileToTestDestination(page);
    
            //go to the test_data_destination directory and check the file is there
            await fileOperations.goToTestDestinationFolder(page);
            const copied_file = page.getByRole('link', { name: 'testTrash.txt' });
            await expect(copied_file).toBeVisible();
    
            //trash the file
            await page.getByLabel('select file testTrash.txt').click();
            await page.getByRole('button', { name: 'Trash' }).click();
            expect(copied_file).toBeUndefined;
        })
    
        test('View Path', async ({ page }) => {
            test.skip(viewPath === false, 'View Path hidden on portal, test skipped');
    
            //click the view path link for the copy file
            await page.getByRole('row', { name: 'select file testCopy.txt File' }).getByRole('button').click();
    
            //get storage path
            const path = page.getByTestId('textarea');
            expect(path).toContainText("/wma_prtl_test_user/e2e-test-files/test_data-do_not_delete/testCopy.txt");
        })
})