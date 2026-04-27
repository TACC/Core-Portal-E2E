import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture';

test.describe('Dashboard Tests', () => {
  
  test.beforeEach(async ({ page, portal, environment, baseURL }) => {
    await page.goto(baseURL);
    await page.getByRole('button', { name: 'Toggle Dropdown' }).click();
    await page.getByRole('link', { name: 'My Dashboard' }).click();
  })

  test('test navigation to correct page', async ({ page, portal, environment, baseURL }) => {
    const url = page.url();
    expect(url).toBe(`${baseURL}/dashboard/`);
  });
})
