import { test as base } from './baseFixture'
import { FileOperations } from './fileOperations';

// Declare the types of yfixtures.
type MyFixtures = {
  fileOperations: FileOperations;
};

// Extend basic test by providing a "fileOperations" fixture.
export const test = base.extend<MyFixtures>({
  fileOperations: async ({ page }, use) => {
    const fileOperations = new FileOperations(page);
    await use(fileOperations);
  },
});
export { expect } from '@playwright/test';