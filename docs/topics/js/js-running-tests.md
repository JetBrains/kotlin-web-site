[//]: # (title: Run tests in Kotlin/JS)

The Kotlin Multiplatform Gradle plugin lets you run tests through a variety of test runners that can be specified via the Gradle
configuration.

When you create a multiplatform project, you can add test dependencies to all the source sets, including the JavaScript
target, by using a single dependency in `commonTest`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
         commonTest.dependencies {
            implementation(kotlin("test")) // This makes test annotations and functionality available in JS
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle

kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This makes test annotations and functionality available in JS
            }
        }
    }
}
```

</tab>
</tabs>

You can tune how tests are executed in Kotlin/JS by adjusting the settings available in the `testTask` block in the Gradle
build script. For example, using the Karma test runner together with a headless instance of Chrome and an instance of
Firefox looks like this:

```kotlin
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useChromeHeadless()
                    useFirefox()
                }
            }
        }
    }
}
```

For a detailed description of the available functionality, check out the Kotlin/JS reference on [configuring the test task](js-project-setup.md#test-task). 

Please note that by default, no browsers are bundled with the plugin. This means that you'll have to ensure they're
available on the target system.

To check that tests are executed properly, add a file `src/jsTest/kotlin/AppTest.kt` and fill it with this content:

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

To run the tests in the browser, execute the `jsBrowserTest` task via IntelliJ IDEA, or use the gutter icons to execute all
or individual tests:

![Gradle browserTest task](browsertest-task.png){width=700}

Alternatively, if you want to run the tests via the command line, use the Gradle wrapper:

```bash
./gradlew jsBrowserTest
```

After running the tests from IntelliJ IDEA, the **Run** tool window will show the test results. You can click failed tests
to see their stack trace, and navigate to the corresponding test implementation via a double click.

![Test results in IntelliJ IDEA](test-stacktrace-ide.png){width=700}

After each test run, regardless of how you executed the test, you can find a properly formatted test report from Gradle
in `build/reports/tests/jsBrowserTest/index.html`. Open this file in a browser to see another overview of the test results:

![Gradle test summary](test-summary.png){width=700}

If you are using the set of example tests shown in the snippet above, one test passes, and one test breaks, which gives 
the resulting total of 50% successful tests. To get more information about individual test cases, you can navigate via
the provided hyperlinks:

![Stacktrace of failed test in the Gradle summary](failed-test.png){width=700}