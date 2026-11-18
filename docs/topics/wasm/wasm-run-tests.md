[//]: # (title: Run tests in Kotlin/Wasm)

<web-summary>Learn how to configure browsers, write and run Kotlin/Wasm tests, and review test results.</web-summary>

You can run Kotlin/Wasm tests in a browser to check how your code behaves in the environment where your application runs.

This page explains how to configure browsers, write tests, and review test results for the `wasmJs` target.
To run tests for the `wasmWasi` target, see [Get started with Kotlin/Wasm and WASI](wasm-wasi.md#test-the-application).

For browser testing, you can choose between the following options:

* The [Karma](https://karma-runner.github.io/) test runner is the default. However, the Karma project is deprecated,
  and no new features or bug fixes are expected.
* The experimental DSL for browser testing. You can you use as an alternative to Karma. It uses:

    * [Playwright](https://playwright.dev/) to download and control the browsers, so you don't need to install them yourself.
      You simply specify which browser engines to use.
    * [Mocha](https://mochajs.org/) to run the tests inside the browser.

> The new DSL is [Experimental](components-stability.md#stability-levels-explained) and available starting with Kotlin 2.5.0.
> It may change at any time. Opt-in is required with the `@OptIn(ExperimentalJsTestDsl::class)` annotation.
>
{style="warning"}

The examples below assume your project has a module named `shared` with a `wasmJs` browser target.

## Add test dependencies

To write and run tests, you need the `kotlin-test` library. It provides test annotations and assertion functions.

In a multiplatform project, code and its dependencies are organized in source sets. Add the `kotlin-test` dependency to
`commonTest` to make it available to test source sets that depend on `commonTest`, including `wasmJsTest`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// shared/build.gradle.kts
kotlin {
    sourceSets {
        commonTest.dependencies {
            // Enables test annotations and functionality in Wasm
            implementation(kotlin("test"))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// shared/build.gradle
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                // Enables test annotations and functionality in Wasm
                implementation kotlin("test")
            }
        }
    }
}
```

</tab>
</tabs>

## Configure browsers

You can run Kotlin/Wasm tests in specific browsers. By default, Karma uses
[Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md), and the experimental DSL uses Chromium.
See the [browser versions supported by Kotlin/Wasm](wasm-configuration.md#browser-versions).

To use specific browsers, use the `testTask {}` block for Karma or the `test {}` block for the
experimental DSL for browser testing:

<tabs group="wasm-test-configure">
<tab title="Karma" group-key="karma">

```kotlin
// shared/build.gradle.kts
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

With Karma, install each configured browser on the machine where you run the tests, locally or in CI.

</tab>
<tab title="DSL for browser testing" group-key="Browser-test-dsl">

```kotlin
// shared/build.gradle.kts
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

If you use IntelliJ IDEA, make sure to click **Sync Gradle Changes** to load the updated configuration.

### Configure browser runners
<primary-label ref="experimental-opt-in"/>

> This section applies only to the experimental DSL for browser testing.
>
{style="note"}

With the new DSL, you can apply custom options to browser runners:

* To apply options to all browser runners, set them in the `test {}` block.
* To override an option for a single runner, set it in that runner's configuration block. 

The following example sets a timeout of 10 seconds for Chromium and Firefox and 35 seconds for WebKit:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalJsTestDsl
import kotlin.time.Duration.Companion.seconds

kotlin {
    wasmJs {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            test {
                // Applies to all browser runners
                timeout = 10.seconds

                // Runs browsers in headless mode only in CI
                headless = providers
                    .environmentVariable("CI")
                    .map { it.toBoolean() }
                    .orElse(false)

                chromium()
                firefox()

                // Enables and configures the WebKit runner
                webkit("safari") {
                    timeout = 35.seconds
                }
            }
        }
    }
}
```

## Add the tests

Let's add two tests that check how Kotlin numbers behave in WebAssembly.

In Kotlin/Wasm, `Int` values are compiled to 32-bit WebAssembly integers, and `Long` values to 64-bit WebAssembly integers. 
In this example, one test passes, and the other fails intentionally so you can see how the test runner reports a failure.

The tests don't depend on any platform, so place them in the `commonTest` source set. Create the
`shared/src/commonTest/kotlin/NumbersTest.kt` file with the following content:

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

The `intOverflows()` test fails because the sum exceeds the maximum value of a signed 32-bit integer and wraps to 
`Int.MIN_VALUE` (`-2_147_483_648`).

Tests in `commonTest` are available to all targets of the module. When you run them with `wasmJsBrowserTest`,
they're compiled to WebAssembly and run in a browser.

## Run the tests

1. Run the tests using one of the following options:

    * In IntelliJ IDEA, click the green **Run** icon in the gutter next to the `NumbersTest` class and choose the **wasmJs** option.
    * In the terminal, run the `wasmJsBrowserTest` Gradle task from the project root directory:

      ```bash
      ./gradlew :shared:wasmJsBrowserTest
      ```

    With the experimental DSL, Gradle downloads the configured browsers through Playwright on the first run.
    Other projects that use the same browser versions can reuse these downloads.

2. Review the test results using one of the following options:

   * In IntelliJ IDEA, use the **Run** tool window. Click a failed test to see its stack trace,
     or double-click it to navigate to its implementation.

     ![Wasm failing tests](wasm-failing-tests.png){width=800}

     The part in square brackets shows where the test runs: the target, the environment, and the
     browser runner. This information is useful when you run tests in several browsers.

   * Open the Gradle test report at `shared/build/reports/tests/wasmJsBrowserTest/index.html` in a browser:

     ![Gradle report for Wasm failing tests](wasm-test-report.png){width=500}

     Follow the links in the report to see details about individual test cases.

   In this example, one test passes, and one test fails, resulting in a 50% success rate.

3. Fix the test. In `NumbersTest.kt`, convert `Int.MAX_VALUE` to `Long` before adding `1`
   so the sum is calculated as a 64-bit integer:

    ```kotlin
    @Test
    fun intOverflows() {
        val sum = Int.MAX_VALUE.toLong() + 1
        assertEquals(2_147_483_648L, sum)
    }
    ```

4. Run the tests again. All tests pass, and the Gradle build finishes successfully.

## Leave feedback

Share feedback about your Kotlin/Wasm testing experience:

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and provide your feedback directly to the developers in our [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel.
* Provide your feedback in [YouTrack](https://kotl.in/issue).
