[//]: # (title: Test code using JUnit in JVM)

This tutorial shows you how to write a simple unit test and run it with the Gradle build tool.

The example has the [kotlin.test](/api/latest/kotlin.test/index.html) library under the hood and runs the test using JUnit.

## Add dependencies

1. Open a Kotlin project in IntelliJ IDEA. If you don't have a project, [create one](/docs/tutorials/jvm-get-started.html#create-an-application).

   > Specify **JUnit 4** as your test framework when creating a project.
   >
   {type="note"} 

2. Open the `build.gradle(.kts)` file and add the following dependencies to the Gradle configuration to work with `kotlin.test` and `JUnit`:

<tabs>

   ```groovy
   dependencies {
       // Other dependencies.
       // ...
       testImplementation "org.jetbrains.kotlin:kotlin-test:1.3.11"
       testImplementation "org.jetbrains.kotlin:kotlin-test-junit:1.3.11"
   }
   ```

   ```kotlin
   dependencies {
       // Other dependencies.
       // ...
       testImplementation(kotlin("test"))
       testImplementation(kotlin("test-junit"))
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

1. In IntelliJ IDEA, select **Code** \| **Generate** \| **Test...** of the `main.kt` file in `src/main/kotlin`.

   ![Create a test](create-test.png)
   
   > You can also create a `*.kt` file for test in `src/main/kotlin` manually.
   > 
   {type="note"} 

2. Specify the name of the test class. For example, `SampleTest`.

   IDEA creates the `SampleTest.kt` file in the `test` directory. It contains Kotlin test source files and resources.

2. Add the test code that for the `sum()` function in `SampleTest.kt`:
   
   * Define the test `testSum()` function using the [@Test](/api/latest/kotlin.test/kotlin.test/-test/index.html) annotation.
   * Check that the `sum()` function returns the value that is equal to the expected one using the [assertEquals](/api/latest/kotlin.test/kotlin.test/-test/assert-equals.html) function.

   ```kotlin
   import kotlin.test.Test
   import kotlin.test.assertEquals
   
   internal class SampleTest {
   
       private val classForTesting: Sample = Sample()
   
       @Test
       fun testSum() {
           val expected = 42
           assertEquals(expected, classForTesting.sum(40, 2))
       }
   }
   ```

## Run a test

1. Run the test using the gutter icon. You can also run a test via the command-line interface using the `./gradlew` command.
   
   ![Run the test](run-test.png)
   
2. Check the result of the test run. 

## What's next

* Look tutorial on Spring Boot, JUnit on YouTube
* Watch videos on Spring Boot with Kotlin & JUnit 5 Tutorials [on YouTube](https://www.youtube.com/playlist?list=PL6gx4Cwl9DGDPsneZWaOFg0H2wsundyGr).