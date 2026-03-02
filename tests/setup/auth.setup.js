import { test as setup } from '../../fixtures/baseFixture'
import OTPAuth from 'otpauth';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, portal, environment, baseURL, mfaSecret }, testInfo) => {

  // Set timeout for retries to account for delay
  if (testInfo.retry > 0) {
    setup.setTimeout(6 * 60 * 1000); // 5 min delay + 1 min for test
    const delayMinutes = 5;
    const delayMs = delayMinutes * 60 * 1000;
    console.log(`Retry attempt ${testInfo.retry}: Waiting ${delayMinutes} minutes before retrying authentication...`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
    await page.context().clearCookies();
  }

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
  
  // Extract base URL (protocol + hostname) and set as environment variable
  const url = new URL(redirectUrl);
  const tapisTenantBaseUrl = `${url.protocol}//${url.hostname}`;
  
  process.env.TAPIS_TENANT_BASEURL = tapisTenantBaseUrl;
    
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

  await page.waitForURL('**/*');
  const postAuthUrl = page.url();
  
  if (postAuthUrl.includes('/oauth2/authorize')) {
    await page.getByRole('button', { name: 'Connect' }).click();
  }

  await page.context().storageState({path: authFile})
});