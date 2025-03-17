import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'


test.describe('Onboarding Admin page tests', () => {

  test.beforeEach(async ({ page, portal, environment, baseURL }) => {
    await page.goto(baseURL);
    await page.locator('#navbarDropdown').click();
    if (expect(page.getByRole('link', { name: 'Onboarding Admin' }).isDisabled)) {
      test.skip('user does not have onboarding admin');
    }
    await page.getByRole('link', { name: 'Onboarding Admin' }).click();
  })

  test('test navigation to correct page', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 5 });
    await expect(heading).toHaveText('Administrator Controls');
  });

  test('test table is populated', async ({ page }) => {
    const table = page.getByRole('table')
    await expect(table.locator('tbody')).toBeVisible()
    const rows = await table.locator('tbody').locator('tr').all()

    expect(rows.length).toBeGreaterThan(0)
  });

  test('page change navigation works', async ({ page }) => {
    const table = page.getByRole('table')
    await expect(table.locator('tbody')).toBeVisible()
    const firstPageRows = await table.locator('tbody').locator('tr').all()

    const firstPageElement = await firstPageRows[0].innerText()
    expect(page.getByRole('button', { name: '< Previous' })).toBeDisabled()

    await page.getByRole('button', { name: 'Next >' }).click();
    await expect(table.locator('tbody')).toBeVisible()
    const secondPageRows = await table.locator('tbody').locator('tr').all()
    const secondPageElement = await secondPageRows[0].innerText()
    expect(secondPageElement).not.toEqual(firstPageElement)

    await page.getByRole('button', { name: '< Previous' }).click();
    await expect(table.locator('tbody')).toBeVisible()
    const newFirstPageRows = await table.locator('tbody').locator('tr').all()
    const newFirstPageElement = await newFirstPageRows[0].innerText()
    expect(newFirstPageElement).toEqual(firstPageElement)

  });

  test('search works', async ({ page }) => {
    await page.getByPlaceholder('Search for users').click();
    await page.getByPlaceholder('Search for users').fill('wma_prtl_test_user');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    const table = page.getByRole('table')

    await expect(table.locator('tbody')).toBeVisible()
    const rows = await table.locator('tbody').locator('tr').all()

    expect(rows.length).toEqual(2);
    await expect(page.getByRole('cell', { name: 'WMA Test User' })).toBeVisible();

    await page.getByPlaceholder('Search for users').fill('');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await expect(table.locator('tbody')).toBeVisible()
    const allRows = await table.locator('tbody').locator('tr').all()

    expect(allRows.length).toBeGreaterThan(2)
  });

  test('invalid search works', async ({ page }) => {
    await page.getByPlaceholder('Search for users').click();
    await page.getByPlaceholder('Search for users').fill('random string');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await expect(page.getByText('No users to show.')).toBeVisible();
  });

  test('view log functionality works', async ({ page }) => {
    const table = page.getByRole('table')
    await expect(table.locator('tbody')).toBeVisible()
    const rows = await table.locator('tbody').locator('tr').all()

    const firstUser = rows.slice(0, 2)

    for (const row of firstUser) {
      const viewLogsButton = row.getByText('View Log')
      const name = (await firstUser[0].locator('td').nth(0).innerHTML()).split('<br>')[0];
      const stepType = await row.locator('td').nth(1).innerText();

      await viewLogsButton.click();
      await expect(page.locator('.modal-dialog')).toBeVisible();
      const heading = page.locator('.modal-dialog').getByRole('heading', { level: 6 });

      if (stepType === 'Allocations') {
        await expect(heading).toHaveText(`${name} - Allocations`)
      }
      else {
        await expect(heading).toHaveText(`${name} - System Access`)
      }

      await page.getByRole('button', { name: 'Close' }).click();
    }
  });
});



