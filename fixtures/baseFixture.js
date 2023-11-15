import { test as base } from '@playwright/test'

export const test = base.extend({
    portal: ['cep', {option: true}],
    environment: ['prod', {option: true}],
    baseURL: ['https://cep.tacc.utexas.edu', {option: true}]
})