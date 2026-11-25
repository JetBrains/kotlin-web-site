[//]: # (title: Run tests in Kotlin/Wasm)

<web-summary>Learn how to configure browsers, write and run Kotlin/Wasm tests, and review test results.</web-summary>

You can run Kotlin/Wasm tests in a browser to check how your code behaves in the environment where your application runs.

This page explains how to configure browsers, write tests, and review test results for the `wasmJs` target.
To run tests for the `wasmWasi` target, see [Get started with Kotlin/Wasm and WASI](wasm-wasi.md#test-the-application).

For browser testing, you can choose between the following options:

* The [Karma](https://karma-runner.github.io/) test runner is the default. However, the Karma project is deprecated,
  and no new features or bug fixes are expected.
* The experimental DSL for browser testing is an alternative to Karma. It uses:

    * [Playwright](https://playwright.dev/) to automatically download and control the browsers based on the browser engines you specify.
    * [Mocha](https://mochajs.org/) to run the tests inside the browser.

> The DSL for browser testing is [Experimental](components-stability.md#stability-levels-explained) and available since Kotlin 2.5.0.
> It may be dropped or changed at any time. To opt in, use the `@OptIn(ExperimentalJsTestDsl::class)` annotation.
>
{style="warning"}

## Add test dependencies

To write and run tests, add the `kotlin-test` dependency to `commonTest`. This makes test annotations and assertion
functions available in `commonTest` and in source sets that depend on it, such as `wasmJsTest`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
kotlin {
    sourceSets {
        commonTest.dependencies {
            // Enables test annotations and assertion functions for Kotlin/Wasm tests
            implementation(kotlin("test"))
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
                // Enables test annotations and assertion functions for Kotlin/Wasm tests
                implementation kotlin("test")
            }
        }
    }
}
```

</tab>
</tabs>

## Configure browsers

You can run Kotlin/Wasm tests in specific browsers that meet [Kotlin/Wasm requirements](wasm-faq.md#which-browsers-support-kotlin-wasm).
By default, Karma uses [Headless Chromium](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md), and the experimental DSL uses Chromium.
To configure specific browsers, use the `testTask {}` block for Karma or the `test {}` block for the
experimental DSL for browser testing:

<tabs group="wasm-test-configure">
<tab title="Karma" group-key="karma">

```kotlin
kotlin {
    wasmJs {
        browser {
            testTask {
                useKarma {
                    useSafari()
                    useFirefox()
                    useChrome()
                }
            }
        }
    }
}
```

With Karma, install each configured browser on the machine where the tests run, such as your local machine or a CI runner.

</tab>
<tab title="DSL for browser testing" group-key="browser-test-dsl">

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalJsTestDsl

kotlin {
    wasmJs {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            test {
                chromium()
                firefox()
                webkit() // The engine used by Safari
            }
        }
    }
}
```

The `chromium()` function enables a browser runner. If you add the `test {}` block but don't enable any browser runner,
Gradle reports a warning and uses Chromium.

</tab>
</tabs>

If you use IntelliJ IDEA, click **Sync Gradle Changes** to load the updated configuration.

### Configure browser runners
<primary-label ref="experimental-opt-in"/>

> This section applies only to the experimental DSL for browser testing.
>
{style="note"}

With the DSL for browser testing, you can apply custom options to browser runners:

* To apply options to all browser runners, set them in the `test {}` block.
* To override an option for a specific runner, set it in that runner's configuration block. 

The following example sets a timeout of 10 seconds for Chromium and Firefox and 35 seconds for WebKit:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalJsTestDsl
import kotlin.time.Duration.Companion.seconds

kotlin {
    wasmJs {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            test {
                // Sets the default timeout for all browser runners
                timeout = 10.seconds

                // Enables headless mode only in CI
                headless = providers
                    .environmentVariable("CI")
                    .map { it.toBoolean() }
                    .orElse(false)

                chromium()
                firefox()

                // Enables the WebKit runner and overrides the default timeout
                webkit("safari") {
                    timeout = 35.seconds
                }
            }
        }
    }
}
```

## Add tests

Place tests that use only common APIs in the `commonTest` source set. This way, they can run on all targets in the module.
The `wasmJsBrowserTest` task compiles these tests to WebAssembly and runs them in a browser.

The following example shows a test class with one test failing intentionally:

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class NumbersTest {
    @Test
    // Adds 2 to the largest safe JavaScript integer
    fun longKeepsPrecision() {
        val maxSafeJsInteger = 9_007_199_254_740_991L

        assertEquals(9_007_199_254_740_993L, maxSafeJsInteger + 2)
    }

    @Test
    fun intOverflows() {
        val sum = Int.MAX_VALUE + 1
        assertEquals(2_147_483_648L, sum.toLong())
    }
}
```

The `longKeepsPrecision()` function passes because the sum fits in a `Long`. The `intOverflows()` function fails because
adding `1` to `Int.MAX_VALUE` wraps the result to `Int.MIN_VALUE` (`-2_147_483_648`) before `toLong()` converts it.

## Run tests

You can run Kotlin/Wasm browser tests from IntelliJ IDEA or the terminal:

* In IntelliJ IDEA, click the green **Run** icon in the gutter next to the test class or function and choose the **wasmJs** option. 
* In the terminal, run the `wasmJsBrowserTest` Gradle task from the project root directory:

      ```bash
      ./gradlew wasmJsBrowserTest
      ```

With the experimental DSL, Playwright downloads the configured browsers the first time you run the tests.
Subsequent runs can be faster because they reuse the cached downloads, including runs in other projects that use the
same browser versions.

You can also review the test results:

* In IntelliJ IDEA, use the **Run** tool window. Click a failed test to see its stack trace or double-click it to navigate
  to its implementation. The square brackets in the test name identify the target, environment, and browser runner.

  ![Wasm failing tests](wasm-failing-tests.png){width=800}

* In the Gradle test report, open `/reports/tests/wasmJsBrowserTest/index.html` in a browser. Follow the links
  in the report to see details about individual test cases.

  ![Gradle report for Wasm failing tests](wasm-test-report.png){width=500}


In the [example above](#add-tests), `intOverflows()` fails, resulting in a 50% success rate. To make it pass, convert
`Int.MAX_VALUE` to `Long` before adding `1` by changing the expression to `Int.MAX_VALUE.toLong() + 1`.
If you rerun the example after this change, both tests pass.

## Leave feedback

Share feedback about your Kotlin/Wasm testing experience:

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and provide your feedback directly to the developers in our [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel.
* Provide your feedback in [YouTrack](https://kotl.in/issue).
