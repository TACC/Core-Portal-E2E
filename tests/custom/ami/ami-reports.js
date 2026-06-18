import { expect, base } from '@playwright/test';
import { test } from '../../../fixtures/baseFixture';

test('AMI Data Explorer loads', async ({ page, baseURL }) => {
  test.setTimeout(150000);
  await page.goto(baseURL);
  await page.getByRole('button', { name: 'Data Explorer (Toggle' }).click();
  await page.getByRole('link', { name: 'AMI Data Explorer' }).click();

  await page.frameLocator('iframe').getByText('Loading...').waitFor({ state: "visible" });
  await page.frameLocator('iframe').getByText('Loading...').waitFor({ state: "hidden" });
  await expect(page.frameLocator('iframe').getByText('Equipment-level')).toBeVisible();
});