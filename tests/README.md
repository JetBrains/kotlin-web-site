Visual regression testing
=========================

## Prerequisites

- NodeJS >= 6.
- Docker.

## Usage

1. Run standalone Selenium server in Docker: 
   ```
   npm run start-selenium-server
   ```

2. Crawl some paths to test:
   ```
    npm run file-scanner -- --pattern "api/**/kotlin.jvm/*.html" --output=paths.txt
    ```

3. Tell visual regression service to collect reference screenshots from http://kotlinlang.org:
   ```
    npm run visual-regression-test -- --paths=paths.txt --baseUrl=http://kotlinlang.org
    ```

4. Run visual regression service again to compare actual site screenshots with references:
   ```
    npm run visual-regression-test -- --paths=paths.txt --baseUrl=http://staging.kotlinlang.org.s3-website-eu-west-1.amazonaws.com
    ```

5. Check out `visual-regression-report/report.html` to see report.

6. Stop Selenium server: 
   ```
   npm run stop-selenium-server
   ```
   
Further testing requires only step #4 (and running Selenium server).