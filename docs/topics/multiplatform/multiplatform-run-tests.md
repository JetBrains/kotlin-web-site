[//]: # (title: Test your multiplatform app − tutorial)

In this tutorial, you'll learn how to create, configure, and run tests in Kotlin Multiplatform applications.

> This tutorial assumes that you are familiar with:
> * The layout of a Kotlin Multiplatform project. If this is not the case,
    complete [this tutorial](multiplatform-mobile-getting-started.md) to get started.
> * The basics of popular unit testing frameworks, such as [JUnit](https://junit.org/junit5/).
>
{type="tip"}

Tests for multiplatform projects can be divided into two categories:

* Tests for common code. These tests can be run on any platform using any supported framework. This tutorial isn't
  intended to strictly connect these tests to any single framework.
* Tests for platform-specific code. These are essential to test platform-specific logic. They use a platform-specific
  framework and can benefit from its additional features, such as a richer API and a wider range of assertions.

Both categories are supported in multiplatform projects. This tutorial will show you how to create, set up, and run unit
tests for both common and platform-specific code.

## Create a sample project

1. Check your environment for multiplatform
   development. [Install all the necessary tools and update them to the latest versions](multiplatform-mobile-setup.md).
2. In Android Studio, select **File | New | New Project**.
3. Select **Kotlin Multiplatform App** in the list of project templates, and click **Next**.

   ![Mobile Multiplatform project template](multiplatform-mobile-project-wizard-1.png){width=700}

4. Specify a name for your application, and click **Next**.

   ![Mobile Multiplatform project - general settings](multiplatform-mobile-project-wizard-2.png){width=700}

5. Leave the **Add sample tests to Shared Module** option unchecked.

   This option adds extra source sets and sample code to assist you with code testing. However, to understand how to
   create and configure tests better, you'll add them manually in this tutorial.

   ![Mobile Multiplatform project. Additional settings](multiplatform-mobile-project-wizard-3.png){width=700}

6. Keep all other options default. Click **Finish**.

## Test the common code

1. In Android Studio, switch the view from **Android** to **Project**. This way, you can see the full structure of your
   multiplatform project.

   ![Select the Project view](select-project-view.png){width=200}

2. In `shared/src/commonMain/kotlin`, create a new directory and a Kotlin file, for example, `common.example.search/Grep.kt`.
3. Add the following function to your file:

    ```kotlin
    fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
        val regex = pattern.toRegex()
        lines.filter(regex::containsMatchIn)
            .forEach(action)
    }
    ```

This function is designed to resemble the [UNIX grep command](https://en.wikipedia.org/wiki/Grep). Here, the function
takes lines of text, a pattern used as a regular expression, and a function that is invoked every time a line matches
the pattern.

### Add tests for your common code

Let's test the common code. But before you can do this, it's necessary to create a source set for common tests,
which has the [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API library as a dependency.

1. Navigate to the `build.gradle.kts` file in the `shared` folder. You'll see that there's already a source set for
   testing the common code. Within its declaration, you have a dependency on the `kotlin.test` library:

    ```kotlin
    val commonTest by getting {
        dependencies {
            implementation(kotlin("test"))
        }
    }
    ```

   Each multiplatform project has a `commonTest` source set by default. This is where the common tests are stored.

2. All you need to do is to create a corresponding folder in your project, which must have the same name. When you
   create a new directory in the `shared/src` directory, the IDE shows a set of standard options:

   ![Creating common test directory](create-common-test-dir.png){width=300}

   In this case, you need a folder called `commonTest` with the `kotlin` subfolder inside.

3. In the `kotlin` folder, create a new `common.example.search` directory and the `Grep.kt` file.
4. Update your test file with the following unit test:

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class GrepTest {
        companion object {
            val sampleData = listOf(
                "123 abc",
                "abc 123",
                "123 ABC",
                "ABC 123"
            )
        }
    
        @Test
        fun shouldFindMatches() {
            val results = mutableListOf<String>()
            grep(sampleData, "[a-z]+") {
                results.add(it)
            }
    
            assertEquals(2, results.size)
            for (result in results) {
                assertContains(result, "abc")
            }
        }
    }
    ```

As you can see, imported annotations and assertions are neither platform- nor framework-specific. When
you run this test later, a platform-specific framework will provide the test runner.

### Run tests

You can run the test by executing:

* The `shouldFindMatches()` test function
* The `GrepTest` test class
* The file using the context menu in the **Project View**

There's also a handy **Ctrl + Shift + R**/**Ctrl + Shift + F10** shortcut. Regardless of the option you choose,
you'll see a list of targets to run the test on:

![Run test task](run-test-tasks.png){width=300}

If you select the `android` option, the test will be run using JUnit 4. If you select `iosSimulatorArm64`, the Kotlin
compiler will detect the testing annotations and create a _test binary_. Kotlin/Native's own test runner will execute
this binary.

In both cases, the test runs like this:

![Test output](run-test-results.png){width=700}

### Explore the `kotlin.test` API

As you see, the [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) library provides platform-agnostic
annotations and assertions. Annotations, such as `Test`, map to those provided by the selected framework or their nearest
equivalent.

Assertions are executed through an implementation of the [`Asserter` interface](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/).
This interface defines the different checks commonly performed in testing. The API has a default implementation,
but typically you will use a framework-specific implementation.

For example, the JUnit 4, JUnit 5, and TestNG frameworks are all supported on JVM. On Android, for example, a call
to `assertEquals()` might result in a call to `asserter.assertEquals()`, where the `asserter `object is an instance
of `JUnit4Asserter`. On iOS, the default implementation of the `Asserter` type is used in conjunction with the
Kotlin/Native test runner.

> When writing tests for common code, remember:
>
> * Always stay within the API. Fortunately, the compiler and the IDE prevent you from using framework-specific
    >   functionality.
> * Although the `Asserter` instance is visible, you don't need to use it in your tests.
> * It should not matter which framework you use to run tests in `commonTest`. However, running these tests with each
    >   framework you intend to use may help check that your development environment is correctly set up.
> * When writing tests for platform-specific code, it's possible to use the annotations and extensions provided by a
    >   specific testing framework you want to use.
>
{type="tip"}

## Deep dive into multiplatform testing

### Writing tests for common code

Consider the `CurrentRuntime` type that holds the details of the platform on which the code is executed. For example, it
might have the values "OpenJDK" and "17.0" for Android unit tests that run on a local JVM.

An instance of `CurrentRuntime` should be created with the name and version of the platform as strings, where the
version is optional. When the version is present, you only need the number at the start of the string, if available.

1. In the `commonMain/kotlin` folder, create a new `org.kmp.testing` directory and the `CurrentRuntime.kt` file.
2. Update it with the following implementation:

    ```kotlin
    class CurrentRuntime(val name: String, rawVersion: String?) {
        companion object {
            val versionRegex = Regex("^[0-9]+(\\.[0-9]+)?")
        }
    
        val version = parseVersion(rawVersion)
    
        override fun toString() = "$name version $version"
    
        private fun parseVersion(rawVersion: String?): String {
            val result = rawVersion?.let { versionRegex.find(it) }
            return result?.value ?: "unknown"
        }
    }
    ```

3. In `commonTest`, create the new `org.kmp.testing/CurrentRuntimeTest.kt` file.
4. Update it with a platform- and framework-agnostic test like this:

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertEquals

    class CurrentRuntimeTest {
        @Test
        fun shouldDisplayDetails() {
            val runtime = CurrentRuntime("MyRuntime", "1.1")
            assertEquals("MyRuntime version 1.1", runtime.toString())
        }
    
        @Test
        fun shouldHandleNullVersion() {
            val runtime = CurrentRuntime("MyRuntime", null)
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    
        @Test
        fun shouldParseNumberFromVersionString() {
            val runtime = CurrentRuntime("MyRuntime", "1.2 Alpha Experimental")
            assertEquals("MyRuntime version 1.2", runtime.toString())
        }
    
        @Test
        fun shouldHandleMissingVersion() {
            val runtime = CurrentRuntime("MyRuntime", "Alpha Experimental")
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    }
    ```

You can run this test using any of the ways [available in the IDE](#run-tests).

### Writing platform-specific tests

> Here, the mechanism of expected and actual declarations is used for brevity and simplicity. In a more complex code, a
> better approach is to use interfaces and factory functions.
>
{type="tip"}

To create an instance of `CurrentRuntime`, declare a function in the common `CurrentRuntime.kt` file as follows:

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

The function should have separate implementations for each supported platform. Otherwise, the build would fail.

As well as implementing this function on each platform, you should provide tests. Let's see how to do it both on Android
and iOS.

#### For Android

1. In `androidMain`, create a new `org.kmp.testing/AndroidRuntime.kt` file.
2. Add the actual implementation of the expected function:

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3 Use the IDE's suggestions to create the `androidUnitTest/kotlin` directory:

![Creating Android test directory](create-android-test-dir.png){width=300}

4. Add the `AndroidRuntimeTest.kt` file to the project:

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class AndroidRuntimeTest {
        @Test
        fun shouldDetectAndroid() {
            val runtime = determineCurrentRuntime()
            assertContains(runtime.name, "OpenJDK")
            assertEquals(runtime.version, "17.0")
        }
    }
    ```

It may seem strange that an Android-specific test is run on a local JVM. This is because these tests run as Local Unit
Tests on the current machine. As described in
the [Android Studio documentation](https://developer.android.com/studio/test/test-in-android-studio), these tests are
distinct from Instrumented Tests, which run on a device or within an emulator.

The **Kotlin Multiplatform App** template project is not configured to support these tests by default. However, it's
possible to add additional dependencies and folders. You can check out this [Touchlab guide](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)
to add support for Instrumented Tests.

#### For iOS

1. In `iosMain`, create a new `org.kmp.testing/IOSRuntimeTest.kt` file.
2. Add the actual implementation of the expected function:

    ```kotlin
    import kotlin.native.Platform
    
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3. In the same way as for Android, create a folder structure for your iOS tests:

   ![Creating iOS test directory](create-ios-test-dir.png){width=300}

4. Add the `IOSRuntimeTest.kt` file to the project:

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertEquals
    
    class IOSRuntimeTest {
        @Test
        fun shouldDetectOS() {
            val runtime = determineCurrentRuntime()
            assertEquals(runtime.name, "ios")
            assertEquals(runtime.version, "unknown")
        }
    }
    ```

## Running multiple tests and reading reports

At this stage, you have the code for common, Android, and iOS implementations, as well as their tests. You should get a
similar directory structure in your project:

![Whole project structure](code-and-test-structure.png){width=300}

You can run individual tests from the context menu or use the shortcut. One more option is to use Gradle tasks. For
example, if you run the `allTests` task, every test in your project will be run with a corresponding test runner.

When you run tests, in addition to the output in your IDE, HTML reports are generated. You can find them in
the `shared/build/tests` directory:

![HTML reports for multiplatform tests](shared-tests-folder-reports.png){width=300}

Examine the report for the `allTests` task:

![HTML report for multiplatform tests](multiplatform-test-report.png){width=700}

* The Android and iOS tests depended on the common tests.
* The common tests are always run before platform-specific ones.

> When writing these tests, remember:
>
> * Tests in the `commonTest` source set should only use multiplatform libraries, like
    the [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) API, to implement the testing functionality.
> * Platform-specific tests can use the functionality of the corresponding framework.
> * The `Asserter` type from the `kotlin.test` API should only be used indirectly.
> * Tests can be run both from the IDE and using Gradle tasks.
> * HTML test reports are automatically generated when you're running tests.
>
{type="tip"}

## What's next?

* Explore the layout of multiplatform projects in [Understand Multiplatform project structure](multiplatform-discover-project.md).
* Check out other multiplatform testing frameworks that the Kotlin ecosystem provides.

  For example, see the [Kotest](https://kotest.io/) library, which allows writing tests in a range of styles and supports
  complementary approaches to regular testing. These include [data-driven](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)
  and [property-based](https://kotest.io/docs/proptest/property-based-testing.html) testing.