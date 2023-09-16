[//]: # (title: Test your multiplatform app − tutorial)

In this tutorial, you'll learn how to create, configure, and run tests in Kotlin Multiplatform applications.

Tests for multiplatform projects can be divided into two categories:

* Tests for common code. These tests can be run on any platform using any supported framework.
* Tests for platform-specific code. These are essential to test platform-specific logic. They use a platform-specific
  framework and can benefit from its additional features, such as a richer API and a wider range of assertions.

Both categories are supported in multiplatform projects. This tutorial will show you how to set up, create, and run unit
tests in a simple Multiplatform project. Then you'll work with a more complex example that requires tests both for common
and platform-specific code.

> This tutorial assumes that you are familiar with:
> * The layout of a Kotlin Multiplatform project. If this is not the case,
    complete [this tutorial](multiplatform-mobile-getting-started.md) to get started.
> * The basics of popular unit testing frameworks, such as [JUnit](https://junit.org/junit5/).
>
{type="tip"}

## Test a simple Multiplatform project

### Create your project

1. Check your environment for multiplatform
   development. [Install all the necessary tools and update them to the latest versions](multiplatform-mobile-setup.md).
2. In Android Studio, select **File | New | New Project**.
3. Select **Kotlin Multiplatform App** in the list of project templates, and click **Next**.

   ![Mobile Multiplatform project template](multiplatform-mobile-project-wizard-1.png){width=700}

4. Name your application and click **Next**.

   ![Mobile Multiplatform project - general settings](multiplatform-mobile-project-wizard-2.png){width=700}

5. Leave the **Add sample tests for Shared Module** option unchecked.

   This option adds extra source sets and sample code to assist you with code testing. However, to understand how to
   create and configure tests better, you'll add them manually in this tutorial.

   ![Mobile Multiplatform project. Additional settings](multiplatform-mobile-project-wizard-3.png){width=700}

6. Keep all other options default values. Click **Finish**.

### Write code

1. To view the complete structure of your multiplatform project, switch the view from **Android** to **Project**:

   ![Select the Project view](select-project-view.png){width=200}

2. In `shared/src/commonMain/kotlin`, create a new `common.example.search` directory.
3. In this directory, create a Kotlin file, `Grep.kt`, and add the following function:

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

### Add tests

Let's test the common code. An essential part will be a source set for common tests,
which has the [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API library as a dependency.

1. In the `shared` directory, open the `build.gradle.kts` file. You'll see that this template project already has
   a source set for testing the common code. Within its declaration, there is a dependency on the `kotlin.test` library:

    ```kotlin
    val commonTest by getting {
        dependencies {
            implementation(kotlin("test"))
        }
    }
    ```

   Each multiplatform project has a `commonTest` source set by default. This is where the common tests are stored.
   All you need to do is to create a corresponding folder in your project, which must have the same name.

2. Start creating a new directory in `shared/src`. Choose `commonTest` containing the `kotlin` folder
   from the list of standard options provided by the IDE:

   ![Creating common test directory](create-common-test-dir.png){width=300}

3. In the `kotlin` folder, create a new `common.example.search` directory.
4. In this directory, create the `Grep.kt` file and update it with the following unit test:

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

As you can see, imported annotations and assertions are neither platform nor framework-specific.
When you run this test later, a platform-specific framework will provide the test runner.

#### Explore the `kotlin.test` API {initial-collapse-state="collapsed"}

The [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) library provides platform-agnostic
annotations and assertions for you to use in your tests. Annotations, such as `Test`,
map to those provided by the selected framework or their nearest equivalent.

Assertions are executed through an implementation of the [`Asserter` interface](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/).
This interface defines the different checks commonly performed in testing. The API has a default implementation,
but typically you will use a framework-specific implementation.

For example, the JUnit 4, JUnit 5, and TestNG frameworks are all supported on JVM. On Android, a call to `assertEquals()`
might result in a call to `asserter.assertEquals()`, where the `asserter` object is an instance of `JUnit4Asserter`.
On iOS, the default implementation of the `Asserter` type is used in conjunction with the Kotlin/Native test runner.

### Run tests

You can execute the test by running:

* The `shouldFindMatches()` test function using the **Run** icon in the gutter
* The test file using its context menu
* The `GrepTest` test class using the **Run** icon in the gutter

There's also a handy **Ctrl + Shift + R**/**Ctrl + Shift + F10** shortcut. Regardless of the option you choose,
you'll see a list of targets to run the test on:

![Run test task](run-test-tasks.png){width=300}

For the `android` option, tests are run using JUnit 4. For `iosSimulatorArm64`, the Kotlin compiler detects testing
annotations and creates a _test binary_ that is executed by Kotlin/Native's own test runner.

Here is an example of the output generated by a successful test run:

![Test output](run-test-results.png){width=700}

## Work with more complex projects

### Write tests for common code

You've already created a test for common code with the `grep()` function. Now let's consider a more advanced common code
test with the `CurrentRuntime` class. This class contains details of the platform on which the code is executed.
For example, it might have the values "OpenJDK" and "17.0" for Android unit tests that run on a local JVM.

An instance of `CurrentRuntime` should be created with the name and version of the platform as strings, where the
version is optional. When the version is present, you only need the number at the start of the string, if available.

1. In the `commonMain/kotlin` folder, create a new `org.kmp.testing` directory.
2. In this directory, create the `CurrentRuntime.kt` file and update it with the following implementation:

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

3. In the `commonTest` folder, create a new `org.kmp.testing` directory.
4. In this directory, create the `CurrentRuntimeTest.kt` and update it with following platform and framework-agnostic test:

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

### Add platform-specific tests

> Here, the mechanism of expected and actual declarations is used for brevity and simplicity. In more complex code, a
> better approach is to use interfaces and factory functions.
>
{type="note"}

Now you have experience writing tests for common code. Let's explore writing platform-specific tests for Android and iOS.

To create an instance of `CurrentRuntime`, declare a function in the common `CurrentRuntime.kt` file as follows:

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

The function should have separate implementations for each supported platform. Otherwise, the build will fail.
As well as implementing this function on each platform, you should provide tests. Let's create them for Android and iOS.

#### For Android

1. In the `androidMain/kotlin` folder, create a new `org.kmp.testing` directory.
2. In this directory, create the `AndroidRuntime.kt` file and update it with the actual implementation of the expected
   `determineCurrentRuntime()` function:

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3. Use the IDE's suggestions to create the `androidUnitTest/kotlin` directory:

   ![Creating Android test directory](create-android-test-dir.png){width=300}

4. In the `kotlin` folder, create a new `org.kmp.testing` directory.
5. In this directory, create the `AndroidRuntimeTest.kt` file and update it with the following Android test:

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

It may seem strange that an Android-specific test is run on a local JVM. This is because these tests run as local unit
tests on the current machine. As described in the [Android Studio documentation](https://developer.android.com/studio/test/test-in-android-studio),
these tests are different from instrumented tests, which run on a device or an emulator.

The **Kotlin Multiplatform App** template project is not configured to support these tests by default. However, it's
possible to add additional dependencies and folders. To learn about adding support for instrumented tests, see this [Touchlab guide](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)

#### For iOS

1. In the `iosMain/kotlin` folder, create a new `org.kmp.testing` directory.
2. In this directory, create the `IOSRuntime.kt` file and update it with the actual implementation of the expected
   `determineCurrentRuntime()` function:

    ```kotlin
    import kotlin.native.Platform
    
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3. Use the IDE's suggestions to create the `iosTest/kotlin` directory:

   ![Creating iOS test directory](create-ios-test-dir.png){width=300}

4. In the `kotlin` folder, create a new `org.kmp.testing` directory.
5. In this directory, create the `IOSRuntimeTest.kt` file and update it with the following iOS test:

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

### Run multiple tests and read reports

At this stage, you have the code for common, Android, and iOS implementations, as well as their tests. You should have a
similar directory structure to this in your project:

![Whole project structure](code-and-test-structure.png){width=300}

You can run individual tests from the context menu or use the shortcut. One more option is to use Gradle tasks. For
example, if you run the `allTests` Gradle task, every test in your project will be run with a corresponding test runner.

When you run tests, in addition to the output in your IDE, HTML reports are generated. You can find them in
the `shared/build/tests` directory:

![HTML reports for multiplatform tests](shared-tests-folder-reports.png){width=300}

Run the `allTests` task and examine its report. You'll see that:

* Android and iOS tests depended on common tests.
* Common tests are always run before platform-specific ones.

![HTML report for multiplatform tests](multiplatform-test-report.png){width=700}

## Rules for using tests in multiplatform projects

You've now created, configured, and executed tests in Kotlin Multiplatform applications.
When working with tests in your future projects, remember:

* When writing tests for common code, use only multiplatform libraries, like [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/). Add dependencies to
  the `commonTest` source set.
* The `Asserter` type from the `kotlin.test` API should only be used indirectly.
  Although the `Asserter` instance is visible, you don't need to use it in your tests.
* Always stay within the testing library API. Fortunately,
  the compiler and the IDE prevent you from using framework-specific functionality.
* Although it doesn't matter which framework you use for running tests in `commonTest`, it's a good idea to run your
    tests with each framework you intend to use to check that your development environment is set up correctly.
* When writing tests for platform-specific code, you can use the functionality of the corresponding framework, for example,
  annotations and extensions.
* You can run tests both from the IDE and using Gradle tasks.
* When you're running tests, HTML test reports are generated automatically.

## What's next?

* Explore the layout of multiplatform projects in [Understand Multiplatform project structure](multiplatform-discover-project.md).
* Check out [Kotest](https://kotest.io/), another multiplatform testing framework that the Kotlin ecosystem provides.
  Kotest allows writing tests in a range of styles and supports complementary approaches to regular testing.
  These include [data-driven](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)
  and [property-based](https://kotest.io/docs/proptest/property-based-testing.html) testing.