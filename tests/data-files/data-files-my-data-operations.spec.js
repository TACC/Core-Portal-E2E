import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';

test.describe('Data Files My Data Work Operations tests', () => {
    test.beforeEach(async ({ page, portal, environment }) => {
        const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
        await page.goto(url);
        await page.locator('#navbarDropdown').click();
        await page.getByRole('link', { name: 'My Dashboard' }).click();
        await page.getByRole('link', { name: 'Data Files', exact: true }).click();
        const heading = page.getByRole('heading', {level: 2});
        await expect(heading).toHaveText('My Data (Work)');
        await page.getByText( 'e2e-test-files' ).click();
        await page.getByText( 'test_data-do_not_delete' ).click();
    })

    test('Rename File', async ({ page }) => {
        const rename_file = page.getByText ('testRename.txt');
        expect(rename_file).toBeVisible;
        const rename_selector = page.getByLabel('select file testRename.txt');
        expect(rename_selector).toBeVisible;
        expect(rename_selector).toBeInViewport;

        //copy the file to the test directory
        await page.getByRole('checkbox', { name: 'select file testRename.txt' }).click();
        await page.getByText('Copy').click();
        await page.getByText('Back').click();
        await page.getByText('test_data_destination').click();
        await page.getByRole('row', { name: 'Folder test_data_destination Copy' }).getByRole('button', { name: 'Copy' }).click();

        //go to the test_data_destination directory and check the file is there
        await page.getByRole('heading', { name: 'My Data (Work) / e2e-test-files / test_data-do_not_delete' })
                .getByRole('link', { name: 'e2e-test-files' }).click();
        await page.getByText( 'test_data_destination' ).click();
        const copied_file = page.getByText( 'testRename.txt' );
        expect(copied_file).toBeVisible;

        //do the rename
        // await page.getByLabel( 'select file testRename.txt' ).click();
        // await page.getByText( 'Rename' ).click();
        //do a thing here
        // const renamed_file = page.getByText( 'testRenameTest.txt');
        // expect(renamed_file).toBeVisible;

        // //trash the renamed file
        // await page.getByLabel('select file testRenameTest.txt').click();
        // await page.getByText('Trash').click();
        // expect(copied_file).toBeUndefined;
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
        await page.getByRole('heading', { name: 'My Data (Work) / e2e-test-files / test_data-do_not_delete' })
                .getByRole('link', { name: 'e2e-test-files' }).click();
        await page.getByText('test_data_destination').click();
        const copied_file = page.getByText('testCopy.txt');
        expect(copied_file).toBeVisible;

        //trash the copied file
        await page.getByLabel('select file testCopy.txt').click();
        await page.getByText('Trash').click();
        expect(copied_file).toBeUndefined;
    })

    test('Move File', async ({ page }) => {
        const move_file = page.getByText('testMove.txt');
        expect(move_file).toBeVisible;
    })

    test('Download File', async({ page }) => {
        const download_file = page.getByText('testDownload.txt');
        expect(download_file).toBeVisible;
    })

    test('Link File', async({ page }) => {
        const link_file = page.getByText('testLink.txt');
        expect(link_file).toBeVisible;
    })

    test('Trash File', async({ page }) => {
        const trash_file = page.getByText('testTrash.txt');
        expect(trash_file).toBeVisible;
    })
})