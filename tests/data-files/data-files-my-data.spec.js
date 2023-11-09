import { expect, base } from '@playwright/test';
import { test } from '../../fixtures/baseFixture'
import { getPortalUrl } from '../../utils/navigationHelper';

//note: these tests are for all 3 types of my data available on dev.cep
//TODO: get these to pick which one to use based on what portal we're testing on

test.describe('Data Files Navigation Tests', () => {
  
  test.beforeEach(async ({ page, portal, environment }) => {
    await page.goto(getPortalUrl(portal, environment));
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('link', { name: 'Data Files' }).click();
  })

  test('test navigation to my data work', async ({ page, portal, environment }) => {
    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText("My Data (Work)");
  });

  test('test navigation to my data scratch', async ({ page, portal, environment }) => {

    await page.getByRole('link', { name: "My Data (Scratch)"}).click();
  
    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText("My Data (Scratch)");
  });

  test('test navigation to my data frontera', async ({ page, portal, environment }) => {

    await page.getByRole('link', { name: "My Data (Frontera)"}).click();
  
    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText("My Data (Frontera)");
  });
})

