[//]: # (title: Run tests)

By default, Kotlin supports running tests for JVM, JS, Android, Linux, Windows, macOS as well as iOS, watchOS, and tvOS simulators. 
To run tests for other Kotlin/Native targets, you need to configure them manually in an appropriate environment, emulator, 
or test framework.

## Required dependencies

The [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/) is available for multiplatform tests. When you [create a multiplatform project](mpp-create-lib.md),
the Project Wizard automatically adds test dependencies to common source set, and for platform-specific source sets
the dependencies are inferred automatically.

If you didn’t use the Project Wizard to create your project, you can [add the dependencies manually](gradle.md#set-dependencies-on-test-libraries).

## Run tests for one or more targets

To run tests for all targets, run the `check` task.

To run tests for a particular target suitable for testing, run a test task `<targetName>Test`.

## Test shared code

For testing shared code, you can use [actual declarations](mpp-connect-to-apis.md) in your tests.

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