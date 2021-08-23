[//]: # (title: Test code using JUnit in JVM – tutorial)

This tutorial will show you how to write a simple unit test and run it with the Gradle build tool.

The example in the tutorial has the [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/index.html) library under the hood and runs the test using JUnit.

To get started, first download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## Add dependencies

1. Open a Kotlin project in IntelliJ IDEA. If you don't already have a project, [create one](jvm-get-started.md#create-an-application).

   > Specify **JUnit 5** as your test framework when creating your project.
   >
   {type="note"}

2. Open the `build.gradle(.kts)` file and add the following dependency to the Gradle configuration. This dependency will allow you to work with `kotlin.test` and `JUnit`:

   <tabs>

   ```groovy
   dependencies {
       // Other dependencies.
       testImplementation 'org.jetbrains.kotlin:kotlin-test'
   }
   ```

   ```kotlin
   dependencies {
       // Other dependencies.
       testImplementation(kotlin("test"))
   }
   ```

   </tabs>

3. Add the `test` task to the `build.gradle(.kts)` file:

   <tabs>

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   ```kotlin
   tasks.test {
       useJUnitPlatform()
   }
   ```

   </tabs>

   > If you created the project using the **Project Wizard**, the task will be added automatically.
   > 
   {type="note"}

## Add the code to test it

1. Open the `main.kt` file in `src/main/kotlin`.

   The `src` directory contains Kotlin source files and resources. The `main.kt` file contains sample code that will print `Hello, World!`.

2. Create the `Sample` class with the `sum()` function that adds two integers together:

   ```kotlin
   class Sample() {

       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## Create a test

1. In IntelliJ IDEA, select **Code** \| **Generate** \| **Test...** for the `Sample` class.

   ![Create a test](create-test.png)

2. Specify the name of the test class. For example, `SampleTest`.

   IntelliJ IDEA creates the `SampleTest.kt` file in the `test` directory. This directory contains Kotlin test source files and resources.

   > You can also manually create a `*.kt` file for tests in `src/test/kotlin`.
   >
   {type="note"}

2. Add the test code for the `sum()` function in `SampleTest.kt`:

   * Define the test `testSum()` function using the [@Test annotation](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html).
   * Check that the `sum()` function returns the expected value by using the [assertEquals()](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) function.

   ```kotlin
   import kotlin.test.Test
   import kotlin.test.assertEquals

   internal class SampleTest {

       private val testSample: Sample = Sample()

       @Test
       fun testSum() {
           val expected = 42
           assertEquals(expected, testSample.sum(40, 2))
       }
   }
   ```

## Run a test

1. Run the test using the gutter icon.

   ![Run the test](run-test.png)

   > You can also run all project tests via the command-line interface using the `./gradlew check` command.
   >
   {type="note"}

2. Check the result in the **Run** tool window:

   ![Check the test result. The test passed successfully](check-the-result.png)

   The test function was executed successfully.

3. Make sure that the test works correctly by changing the `expected` variable value to 43:

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. Run the test again and check the result:

   ![Check the test result. The test has been failed](check-the-result-2.png)

   The test execution failed.

## What's next

Once you've finished your first test, you can:

* Try to write another test using other [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) functions. For example, you could use the [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) function.
* [Create your first application](jvm-spring-boot-restful.md) with Kotlin and Spring Boot.
* Watch [these video tutorials](https://www.youtube.com/playlist?list=PL6gx4Cwl9DGDPsneZWaOFg0H2wsundyGr) on YouTube, which demonstrate how to use Spring Boot with Kotlin and JUnit 5.
