import { test as setup } from '../../fixtures/baseFixture'
import OTPAuth from 'otpauth';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, portal, environment, baseURL, mfaSecret }) => {

  console.log("Using portal url: ", baseURL)

  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill(process.env.USERNAME);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL('**/*');
  const redirectUrl = page.url();
  
  if (redirectUrl.includes('/oauth2/mfa')) {
    // MFA flow
    let totp = new OTPAuth.TOTP({
      issuer: 'TACC',
      label: 'TACC Token',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: mfaSecret
    });

    await page.getByLabel('Token').fill(totp.generate());
    await page.getByRole('button', { name: 'Submit' }).click();
  } 
  
  await page.getByRole('button', { name: 'Connect' }).click();
  await page.context().storageState({path: authFile})
});