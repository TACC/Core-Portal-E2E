import { test as base } from '@playwright/test'

export const test = base.extend({
    portal: ['cep', {option: true}],
    environment: ['prod', {option: true}]
})