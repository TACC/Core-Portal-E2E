import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/fileOperationsFixture';
import { WORKBENCH_SETTINGS } from '../../settings/custom_portal_settings.json';

const makeLink = WORKBENCH_SETTINGS['makeLink'];
const hideDataFiles = WORKBENCH_SETTINGS['hideDataFiles'];
const viewPath = WORKBENCH_SETTINGS['viewPath'];

test.describe('Data Files My Data Work Operations tests', () => {
    test.skip(hideDataFiles === true, 'Data Files hidden on portal, tests skipped');

    test.beforeEach(async ({ page, portal, environment, baseURL }, testInfo) => {
        testInfo.setTimeout(testInfo.timeout + 150000);
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files', exact: true }).click();
        //check to see if My Data Work exists on this portal
        //TODO: this is a temporary solution, there is probably a better way
        if (!expect(page.getByRole('link', { name: 'My Data (Work)' }).exists)) {
            test.skip(true, "My Data Work does not exist, skip");
        }
        await page.getByRole('link', { name: 'My Data (Work)' }).click();
        //make sure we're in the right spot
        const heading = page.getByRole('heading', { level: 2 });
        await expect(heading.locator('.system-name')).toHaveText("My Data (Work)");
        //traverse to test file storage location
        await page.getByRole('link', { name: 'e2e-test-files' }).click();
        await page.getByRole('link', { name: 'test_data-do_not_delete' }).click();
    })

    //clean up just in case a test failed
    test.afterEach(async ({ page, portal, baseURL, fileOperations }) => {
        console.log(`Finished ${test.info().title} with status ${test.info().status} on portal ${portal} and base url ${baseURL}`);

        if (test.info().status !== test.info().expectedStatus) {
            console.log(`Did not run as expected, ended up at ${page.url()}`);
            await page.goto(baseURL);
            await page.locator('#navbarDropdown').click();
            await page.getByRole('link', { name: 'My Dashboard' }).click();
            await page.getByRole('link', { name: 'Data Files', exact: true }).click();
            await fileOperations.goToTestDestinationFolder(page);
            await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
            await page.getByRole('checkbox', { name: "select all folders and files" }).click();
            //check to see if trash can be used; not all failures have remaining files
            const trashBttn = page.locator('button:has-text("Trash")');
            if (await trashBttn.isEnabled()) {
                await trashBttn.click();
            }
        }
    })

    test('Rename File', async ({ page, fileOperations }) => {
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
        await fileOperations.goToTestDestinationFolder(page);
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
        //select the file
        await page.getByRole('checkbox', { name: 'select file testCopy.txt' }).click();
        //copy the file to the test directory
        await fileOperations.copyFileToTestDestination(page);

        //go to the test_data_destination directory and check the file is there
        await fileOperations.goToTestDestinationFolder(page);
        const copied_file = page.getByRole('link', { name: 'testCopy.txt' });
        await expect(copied_file).toBeVisible();

        //trash the copied file
        await page.getByLabel('select file testCopy.txt').click();
        await page.getByRole('button', { name: 'Trash' }).click();
        expect(copied_file).toBeUndefined;
    })

    test('Move File', async ({ page, fileOperations }) => {
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
        await fileOperations.goToTestDestinationFolder(page);
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
        await page.getByRole('link', { name: 'My Data (Work)' }).click();
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