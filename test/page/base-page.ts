import { Page } from '@playwright/test';

export interface BasePage {
    readonly page: Page;
    init(): Promise<void>;
}
