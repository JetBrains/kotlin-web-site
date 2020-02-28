---
type: tutorial
layout: tutorial
title:  "Running tests"
description: "How to run tests for the Kotlin/JS target using test runners in Gradle."
authors: Sebastian Aigner
date: 2020-02-23
showAuthorInfo: false

---

The Kotlin/JS Gradle plugin allows us to run tests through a variety of test runners that can be specified via the Gradle configuration. In order to make test annotations and functionality available for the JavaScript target, let's add the correct platform artifact for [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) in our `build.gradle.kts`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
dependencies {
    // ...
    testImplementation(kotlin("test-js"))
}
```
</div>

We can tune how tests are executed in Kotlin/JS by adjusting the settings available in the `testTask` block in our `build.gradle.kts`. For example, using the Karma test runner together with a headless instance of Chrome and an instance of Firefox looks like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
target {
    browser {
        testTask {
            useKarma {
                useChromeHeadless()
                useFirefox()
            }
        }
    }
}
```
</div>
For a detailed description of the available functionality, check out the Kotlin/JS reference on [configuring the test task](/docs/reference/js-project-setup.html#configuring-test-task). 

Please note that by default, no browsers are bundled with the plugin. This means that you'll have to ensure they're available on the target system.

To check that tests are executed properly, we can add a file `src/test/kotlin/AppTest.kt` and fill it with this content:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class AppTest {
    @Test
    fun thingsShouldWork() {
        assertEquals(listOf(1,2,3).reversed(), listOf(3,2,1))
    }

    @Test
    fun thingsShouldBreak() {
        assertEquals(listOf(1,2,3).reversed(), listOf(1,2,3))
    }
}
```
</div>

To run the tests in the browser, we can execute the `browserTest` task via IntelliJ IDEA, or use the gutter icons to execute individual or all tests:

![Gradle browserTest task]({{ url_for('tutorial_img', filename='javascript/running-tests/browsertest-task.png')}})

Alternatively, if we would like to run the tests via the command line, we can make use of the Gradle wrapper:

```./gradlew browserTest```

After all tests have finished running, we can find a properly formatted Gradle test report in `build/reports/tests/browserTest/index.html`. We can open this file in the browser of our choice to get an overview of our test results:

![Gradle test summary]({{ url_for('tutorial_img', filename='javascript/running-tests/test-summary.png')}})

If we are using the set of example tests shown in the snippet above, one test passes, and one test breaks, which gives us the resulting total of 50% successful tests. To get more information about individual test cases, we can navigate via the provided hyperlinks:

![Stacktrace of failed test in the Gradle summary]({{ url_for('tutorial_img', filename='javascript/running-tests/failed-test.png')}})

