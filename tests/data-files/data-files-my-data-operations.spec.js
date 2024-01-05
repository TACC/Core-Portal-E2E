import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';

test.describe('Data Files My Data Work Operations tests', () => {
    test.beforeEach(async ({ page, portal, environment, baseURL }) => {
        test.setTimeout(150000);
        await page.goto(baseURL);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files', exact: true }).click();
        const heading = page.getByRole('heading', {level: 2});
        await expect(heading.locator('.system-name')).toHaveText("My Data (Work)");
        await page.getByText( 'e2e-test-files' ).click();
        await page.getByText( 'test_data-do_not_delete' ).click();
    })

    test('Rename File', async ({ page }) => {
        //click into the data files area
        await expect(page.locator('.data-files-table-body')).toBeVisible();
        await page.locator('.data-files-table-body').dblclick();
        //scroll down
        await page.mouse.wheel(0, 400);

        //copy the file to the test directory
        await page.getByRole('checkbox', { name: 'select file testRename.txt' }).click();
        await page.getByRole('button', { name: 'Copy' }).click();
        await page.getByText('Back').click();
        await page.getByText('test_data_destination').click();
        await page.getByRole('row', { name: 'Folder test_data_destination Copy' }).getByRole('button', { name: 'Copy' }).click();

        //go to the test_data_destination directory and check the file is there
        await page.getByRole('link', { name: 'My Data (Work)' }).click();
        await page.getByText( 'e2e-test-files' ).click();
        await page.getByText( 'test_data_destination' ).click();
        const copied_file = page.getByText( 'testRename.txt' );
        expect(copied_file).toBeVisible;

        //do the rename
        await page.getByLabel( 'select file testRename.txt' ).click();
        await page.getByRole('button', { name: 'Rename' }).click();
        await page.getByRole('textbox').click();
        await page.getByRole('textbox').fill('testRenameTest.txt');
        await page.getByRole('dialog').getByRole('button', { name: 'Rename' }).click();
        const renamed_file = page.getByText( 'testRenameTest.txt');
        expect(renamed_file).toBeVisible;

        //trash the renamed file
        await page.getByLabel('select file testRenameTest.txt').click();
        await page.getByRole('button', { name: 'Trash' }).click();
        expect(renamed_file).toBeUndefined;
    })

    test('Copy File', async ({ page }) => {
        //make sure the file and the selection box exist
        const copy_file = page.getByText('testCopy.txt');
        expect(copy_file).toBeVisible;
        const copy_selector = page.getByLabel('select file testCopy.txt');
        expect(copy_selector).toBeVisible;

        //copy the file to the test directory
        await page.getByRole('checkbox', {name: 'select file testCopy.txt' }).click();
        await page.getByRole('button', { name: 'Copy' }).click();
        await page.getByText('Back').click();
        //this line may not be needed due to the selector below it
        //but this tries to guarantee that there's minimal items in the modal
        await page.getByText('test_data_destination').click();
        await page.getByRole('row', { name: 'Folder test_data_destination Copy' }).getByRole('button', { name: 'Copy' }).click();

        //go to the test_data_destination directory and check the file is there
        await page.getByRole('link', { name: 'My Data (Work)' }).click();
        await page.getByText( 'e2e-test-files' ).click();
        await page.getByText('test_data_destination').click();
        const copied_file = page.getByText('testCopy.txt');
        expect(copied_file).toBeVisible;

        //trash the copied file
        await page.getByLabel('select file testCopy.txt').click();
        await page.getByRole('button', { name: 'Trash' }).click();
        expect(copied_file).toBeUndefined;
    })

    test('Move File', async ({ page }) => {
        const move_file = page.getByText('testMove.txt');
        expect(move_file).toBeVisible;

        //click into the data files area
        await expect(page.locator('.data-files-table-body')).toBeVisible();
        await page.locator('.data-files-table-body').dblclick();
        //scroll down
        await page.mouse.wheel(0, 200);

        //copy the file to the test directory
        await page.getByRole('checkbox', { name: 'select file testMove.txt' }).click();
        await page.getByRole('button', { name: 'Copy' }).click();
        await page.getByText('Back').click();
        await page.getByText('test_data_destination').click();
        await page.getByRole('row', { name: 'Folder test_data_destination Copy' }).getByRole('button', { name: 'Copy' }).click();

        //go to the test_data_destination directory and check the file is there
        await page.getByRole('link', { name: 'My Data (Work)' }).click();
        await page.getByText( 'e2e-test-files' ).click();
        await page.getByText('test_data_destination').click();
        const copied_file = page.getByText('testMove.txt');
        expect(copied_file).toBeVisible;

        //do a move
        await page.getByRole('checkbox', { name: 'select file testMove.txt' }).click();
        await page.getByRole('button', { name: 'Move' }).click();
        //need some extra wait time for the modal to load
        //otherwise this part times out
        //dunno why this modal takes a little longer
        await page.waitForTimeout(2000);
        await page.getByText('Back').click();
        await page.getByRole('row', { name: 'Folder e2e-test-files Move' }).getByRole('button', { name: 'Move' }).click();

        //check for the moved file
        await page.getByRole('link', { name: 'My Data (Work)' }).click();
        await page.getByText( 'e2e-test-files' ).click();
        const moved_file = page.getByText('testMove.txt');
        expect(moved_file).toBeVisible;

        //trash the moved file
        await page.getByLabel('select file testMove.txt').click();
        await page.getByRole('button', { name: 'Trash' }).click();
        expect(moved_file).toBeUndefined;
    })

    // test('Download File', async({ page }) => {
    //     const download_file = page.getByText('testDownload.txt');
    //     expect(download_file).toBeVisible;

    //     //copy the file to the test directory
    //     await page.getByRole('checkbox', { name: 'select file testDownload.txt' }).click();
    //     await page.getByRole('button', { name: 'Copy' }).click();
    //     await page.getByText('Back').click();
    //     await page.getByText('test_data_destination').click();
    //     await page.getByRole('row', { name: 'Folder test_data_destination Copy' }).getByRole('button', { name: 'Copy' }).click();

    //     //go to the test_data_destination directory and check the file is there
    //     await page.getByRole('link', { name: 'My Data (Work)' }).click();
    //     await page.getByText( 'e2e-test-files' ).click();
    //     await page.getByText( 'test_data_destination' ).click();
    //     const copied_file = page.getByText( 'testDownload.txt' );
    //     expect(copied_file).toBeVisible;

    //     //do the download

    //     //trash the file
    //     await page.getByLabel('select file testDownload.txt').click();
    //     await page.getByRole('button', { name: 'Trash' }).click();
    //     expect(copied_file).toBeUndefined;
    // })

    // test('Link File', async({ page }) => {
    //     const link_file = page.getByText('testLink.txt');
    //     expect(link_file).toBeVisible;

    //     //click into the data files area
    //     await expect(page.locator('.data-files-table-body')).toBeVisible();
    //     await page.locator('.data-files-table-body').dblclick();
    //     //scroll down
    //     await page.mouse.wheel(0, 200);

    //     //copy the file to the test directory
    //     await page.getByRole('checkbox', { name: 'select file testLink.txt' }).click();
    //     await page.getByRole('button', { name: 'Copy' }).click();
    //     await page.getByText('Back').click();
    //     await page.getByText('test_data_destination').click();
    //     await page.getByRole('row', { name: 'Folder test_data_destination Copy' }).getByRole('button', { name: 'Copy' }).click();

    //     //go to the test_data_destination directory and check the file is there
    //     await page.getByRole('link', { name: 'My Data (Work)' }).click();
    //     await page.getByText( 'e2e-test-files' ).click();
    //     await page.getByText( 'test_data_destination' ).click();
    //     const copied_file = page.getByText( 'testLink.txt' );
    //     expect(copied_file).toBeVisible;

    //     //do the link testing
    //     await page.getByRole('checkbox', { name: 'select file testLink.txt' }).click();
    //     await page.getByRole('button', { name: 'Link' }).click();
    //     await page.getByRole('button', { name: 'Generate Link'}).click();
    //     const link = page.getByRole('textbox').innerText;
    //     //expect(page.getByRole('input', { type: 'text' }).toHaveText("https://portals.tapis.io/v3/files/postits/redeem/"));
    //     expect(link).toContain("https://portals.tapis.io/v3/files/postits/redeem/");
    //     //TODO: add clipboard check for copy button
    //     //TODO: add "replace link" check
    //     //TODO: add "delete" check

    //     //trash the file
    //     await page.getByRole('checkbox', { name: 'select file testLink.txt' }).click();
    //     await page.getByRole('button', { name: 'Trash' }).click();
    //     expect(copied_file).toBeUndefined;
    // })

    test('Trash File', async({ page }) => {
        const trash_file = page.getByText('testTrash.txt');
        expect(trash_file).toBeVisible;

        //click into the data files area
        await expect(page.locator('.data-files-table-body')).toBeVisible();
        await page.locator('.data-files-table-body').dblclick();
        //scroll down
        await page.mouse.wheel(0, 400);

        //copy the file to the test directory
        await page.getByRole('checkbox', { name: 'select file testTrash.txt' }).click();
        await page.getByRole('button', { name: 'Copy' }).click();
        await page.getByText('Back').click();
        await page.getByText('test_data_destination').click();
        await page.getByRole('row', { name: 'Folder test_data_destination Copy' }).getByRole('button', { name: 'Copy' }).click();

        //go to the test_data_destination directory and check the file is there
        await page.getByRole('link', { name: 'My Data (Work)' }).click();
        await page.getByText( 'e2e-test-files' ).click();
        await page.getByText( 'test_data_destination' ).click();
        const copied_file = page.getByText( 'testTrash.txt' );
        expect(copied_file).toBeVisible;

        //trash the file
        await page.getByLabel('select file testTrash.txt').click();
        await page.getByRole('button', { name: 'Trash' }).click();
        expect(copied_file).toBeUndefined;
    })
})