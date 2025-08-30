import { defineConfig, devices } from '@playwright/test';

const MAX_DIFF_PIXEL_RATIO = 0.025 as const;

export default defineConfig({
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'dot' : 'list',
    snapshotDir: 'test/snapshots',
    expect: {
        toMatchSnapshot: { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
        toHaveScreenshot: { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO }
    },
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:9000',
        trace: 'off'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ]
});
