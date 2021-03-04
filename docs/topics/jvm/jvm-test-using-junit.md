[//]: # (title: Test code using JUnit in JVM – tutorial)

This tutorial shows you how to write a simple unit test and run it with the Gradle build tool.

The example has the [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/index.html) library under the hood and runs the test using JUnit.

To get started, first download and install the latest version of [IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html).

## Add dependencies

1. Open a Kotlin project in IntelliJ IDEA. If you don't have a project, [create one](jvm-get-started.md#create-an-application).

   > Specify **JUnit 5** as your test framework when creating a project.
   >
   {type="note"} 

2. Open the `build.gradle(.kts)` file and add the following dependencies to the Gradle configuration to work with `kotlin.test` and `JUnit`:

   <tabs>

   ```groovy
   dependencies {
       // Other dependencies.
       testImplementation 'org.jetbrains.kotlin:kotlin-test-junit5'
       testImplementation 'org.junit.jupiter:junit-jupiter-api:5.6.0'
       testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine:5.6.0'
   }
   ```

   ```kotlin
   dependencies {
       // Other dependencies.
       testImplementation(kotlin("test-junit5"))
       testImplementation("org.junit.jupiter:junit-jupiter-api:5.6.0")
       testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.6.0")
   }
   ```

   </tabs>

3. Ensure, that **Project Wizard** automatically created the `test` task in the `build.gradle(.kts)` file:

   <tabs>

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   ```kotlin
   tasks.test {
       useJUnit()
   }
   ```

   </tabs>

## Add code to test

1. Open the `main.kt` file in `src/main/kotlin`.

   The `src` directory contains Kotlin source files and resources. The `main.kt` file contains sample code that will print `Hello World!`.

2. Create the `Sample` class with the `sum()` function that sums two integers:

```kotlin
class Sample() {

    fun sum(a: Int, b: Int): Int {
        return a + b
    }
}
```

## Create a test

1. In IntelliJ IDEA, select **Code** \| **Generate** \| **Test...** of the `Sample` class.

   ![Create a test](create-test.png)

2. Specify the name of the test class. For example, `SampleTest`.

   IDEA creates the `SampleTest.kt` file in the `test` directory. It contains Kotlin test source files and resources.

   > You can also create a `*.kt` file for test in `src/test/kotlin` manually.
   >
   {type="note"}

2. Add the test code that for the `sum()` function in `SampleTest.kt`:
   
   * Define the test `testSum()` function using the [@Test annotation](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html).
   * Check that the `sum()` function returns the value that is equal to the expected one using the [assertEquals()](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/assert-equals.html) function.

   ```kotlin
   import kotlin.test.Test
   import kotlin.test.assertEquals
   
   internal class SampleTest {
   
       private val testSample: Sample = Sample()
   
       @Test
       fun testSum() {
           val expected = 42
           assertEquals(expected, classForTesting.sum(40, 2))
       }
   }
   ```

## Run a test

1. Run the test using the gutter icon.

   ![Run the test](run-test.png)

   > You can also run all project tests via the command-line interface using the `./gradlew test` command.
   > 
   {type="note"} 

2. Check the result of the test run in the **Run** tool window:

   ![Check the reult](check-the-result.png)

   The test function executed successfully.

3. Ensure that the test works correctly – change the `expected` variable value to 43:

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```
   
4. Run the test again and check the result:
   
   ![Check the test result](check-the-result-2.png)

   The test execution has been failed.

## What's next

Once you've finished your first test, you can:

* Try to write another test using other [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) functions. For example, use the [`assertNotEquals`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) function. 
* [Create your first application](jvm-spring-boot-restful.md) with Kotlin and Spring Boot.
* Watch video [tutorials on YouTube](https://www.youtube.com/playlist?list=PL6gx4Cwl9DGDPsneZWaOFg0H2wsundyGr) that show how to use Spring Boot with Kotlin & JUnit 5.
