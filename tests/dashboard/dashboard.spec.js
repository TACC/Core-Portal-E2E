import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'

test('test navigation to correct page', async ({ page, portal, environment }) => {

  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'My Dashboard' }).click();

  const heading = page.getByRole('heading', {level: 2});
  await expect(heading).toHaveText('Dashboard');
});

test('test dashboard elements are displayed properly', async ({ page, portal, environment }) => {

  const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
  await page.goto(url);
  await page.locator('#navbarDropdown').click();
  await page.getByRole('link', { name: 'My Dashboard' }).click();

  const heading = page.getByRole('heading', {level: 2});
  await expect(heading).toHaveText('Dashboard');

  await expect(page.getByRole('link', {name: 'Manage Account'})).toBeVisible();

  await expect(page.getByRole('link', {name: 'Manage Account'})).toBeVisible();

  await expect(page.getByRole('heading', {level: 3, name: 'My Recent Jobs'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'View History'})).toBeVisible();

  await expect(page.getByRole('heading', {level: 3, name: 'My Tickets'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'New Ticket'})).toBeVisible();

  await expect(page.getByRole('article')
              .filter({ has: page.getByRole('heading', {level: 3, name: 'System Status'})})).toBeVisible();
});