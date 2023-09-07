// @ts-check
const { defineConfig, devices } = require('@playwright/test');
import dotenv from 'dotenv'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

dotenv.config({path: 'settings/.env.default'})
dotenv.config({path: 'settings/.env.secret'})

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', {open: 'never'}],
             ['junit', { outputFile: 'playwright-report/results.xml' }]
            ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 10000,
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'setup/*.setup.js',
      use: {
        portal: process.env.PORTAL,
        environment: process.env.ENVIRONMENT,
      }
    },
    {
      name: 'default',
      use: { ...devices['Desktop Chrome'],
            storageState: 'playwright/.auth/user.json',
            portal: process.env.PORTAL,
            environment: process.env.ENVIRONMENT,
          },
      dependencies: ['setup'],
      testIgnore: 'unauthorized-user/*.spec.js'
    },
    {
      name: 'unauthorized',
      testMatch: 'unauthorized-user/*.spec.js',
      use: { ...devices['Desktop Chrome'],
            portal: process.env.PORTAL,
            environment: process.env.ENVIRONMENT,
          },
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'],
    //         storageState: 'playwright/.auth/user.json',
    //         portal: process.env.PORTAL,
    //         environment: process.env.ENVIRONMENT,
    //       },
    //   dependencies: ['setup']
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'],
    //         storageState: 'playwright/.auth/user.json',
    //         portal: process.env.PORTAL,
    //         environment: process.env.ENVIRONMENT,
    //       },
    //   dependencies: ['setup']
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

