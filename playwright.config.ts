import { defineConfig, devices } from '@playwright/test';

const MAX_DIFF_PIXEL_RATIO = 0.025 as const;

const isDevelopment = !process.env.CI;

const reporter = isDevelopment ? 'list' : 'playwright-teamcity-reporter';
const retries = isDevelopment ? 0 : 2;
const timeout = isDevelopment ? 10000 : 5000;

const forbidOnly = !isDevelopment;

export default defineConfig({
    globalSetup: require.resolve('./test/global-setup.ts'),
    forbidOnly,
    retries,
    reporter,
    snapshotDir: 'test/snapshots',
    expect: {
        timeout,
        toMatchSnapshot: { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO },
        toHaveScreenshot: { maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO }
    },
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        storageState: 'test/storage-state.json',
        trace: 'off',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    projects: getProjects()
});

function getProjects() {
    if (process.env.E2E_PROJECTS === 'breakpoints-v2') return [
        {
            name: 'MS',
            use: {
                viewport: { width: 414, height: 736 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'ML',
            use: {
                viewport: { width: 473, height: 896 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'TS',
            use: {
                viewport: { width: 648, height: 864 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'TL',
            use: {
                viewport: { width: 810, height: 1080 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'DS',
            use: {
                viewport: { width: 1008, height: 1792 },
                deviceScaleFactor: 2,
                isMobile: false,
                hasTouch: false
            }
        },
        {
            name: 'DL',
            use: {
                viewport: { width: 1280, height: 720 },
                deviceScaleFactor: 2,
                isMobile: false,
                hasTouch: false
            }
        }
    ];

    return [{
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] }
    }];
}
