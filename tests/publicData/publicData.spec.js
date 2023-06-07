test('test navigation to public data page', async ({ page, portal, environment }) => {

    const url = `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
    await page.goto(url);
    await page.locator('#navbarDropdown').click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.getByRole('link', { name: 'Public Data' }).click();

    const heading = page.getByRole('heading', {level: 2});
    await expect(heading).toHaveText('Public Data');
    
  });