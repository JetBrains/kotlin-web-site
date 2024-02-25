const { devices } = require('@playwright/test');

const config = {
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'dot' : 'list',
    snapshotDir: 'test/snapshots',
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:8080',
        trace: 'off',
        ignoreHTTPSErrors: true,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
};

module.exports = config;
