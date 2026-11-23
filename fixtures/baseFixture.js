import { test as base } from '@playwright/test'
import dotenv from 'dotenv'

export const test = base.extend({
    portal: ['cep', {option: true}],
    environment: ['prod', {option: true}],
    mfaSecret: [process.env.MFA_SECRET, {option: true}],
    tapisTenantBaseUrl: [process.env.TAPIS_TENANT_BASEURL || '', {option: true}],
    baseURL: [
    async ({ baseURL }, use) => {
      await use(resolveLocalBaseURL(baseURL ?? 'https://cep.tacc.utexas.edu'));
    },
    { option: true },
  ],
})
