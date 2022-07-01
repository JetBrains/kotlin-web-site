const { devices } = require('@playwright/test');

const config = {
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 0 : 0,
    reporter: process.env.CI ? 'dot' : 'list',
    maxFailures: process.env.CI ? 2 : 0,
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:9000',
        trace: 'off',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['iPhone SE'],
            },
        }
    ],
};

module.exports = config;
