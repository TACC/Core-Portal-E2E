import { test as base } from '@playwright/test'

export const test = base.extend({
    portal: ['mise', {option: true}],
    environment: ['prod', {option: true}],
    baseURL: ['https://matcssi.tacc.utexas.edu/', {option: true}]
})