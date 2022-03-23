[//]: # (title: Run tests with Kotlin Multiplatform)

By default, Kotlin supports running tests for JVM, JS, Android, Linux, Windows, macOS as well as iOS, watchOS, and tvOS simulators. 
To run tests for other Kotlin/Native targets, you need to configure them manually in an appropriate environment, emulator, 
or test framework.

## Run tests

You can run tests to check that the shared code works correctly on both platforms. Of course, you can also write and run tests to check the
platform-specific code.

### Run tests on iOS

1. Open the file `iosTest.kt` in `shared/src/iosTest/kotlin/com.example.kmmapplication.shared`.  
   Directories with `Test` in their name contain tests.  
   This file includes a sample test for iOS.

   ![iOS test Kotlin file](ios-test-kt.png)

2. Click the **Run** icon in the gutter next to the test.

Tests run on a simulator without UI. Congratulations! The test has passed – see test results in the console.

![iOS test result](ios-test-result.png){width=300}

### Run tests on Android

For Android, follow a procedure that is very similar to the one for running tests on iOS.

1. Open the file `androidTest.kt` in `shared/src/androidTest/kotlin/com.example.kmmapplication.shared`.

2. Click the **Run** gutter icon next to the test.

## Required dependencies

The [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/) is available for multiplatform tests. When you
[create a multiplatform project](multiplatform-library.md), the Project Wizard automatically adds test dependencies to
common and platform-specific source sets. 

If you didn’t use the Project Wizard to create your project, you can [add the dependencies manually](gradle.md#set-dependencies-on-test-libraries).

## Run tests for one or more targets

To run tests for all targets, run the `check` task.

To run tests for a particular target suitable for testing, run a test task `<targetName>Test`.

## Test shared code

For testing shared code, you can use [actual declarations](multiplatform-connect-to-apis.md) in your tests.

For example, to test the shared code in `commonMain`:

```kotlin
expect object Platform {
    val name: String
}

fun hello(): String = "Hello from ${Platform.name}"

class Proxy {
    fun proxyHello() = hello()
}
```

You can use the following test in `commonTest`:

```kotlin
import kotlin.test.Test
import kotlin.test.assertTrue

class SampleTests {
    @Test
    fun testProxy() {
        assertTrue(Proxy().proxyHello().isNotEmpty())
    }
}
```

And the following test in `iosTest`:

```kotlin
import kotlin.test.Test
import kotlin.test.assertTrue

class SampleTestsIOS {
    @Test
    fun testHello() {
        assertTrue("iOS" in hello())
    }
}
```

You can also learn how to create and run multiplatform tests in the [Create and publish a multiplatform library – tutorial](multiplatform-library.md#test-your-library).