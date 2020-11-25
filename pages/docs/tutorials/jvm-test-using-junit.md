---
type: doc
layout: tutorial
title: "Test code using JUnit in JVM"
description: "This tutorial shows you how to write a simple unit test and run it with the Gradle build tool."
authors: Andrey Polyakov
date: 2020-10-20
showAuthorInfo: false
---

The example has the [kotlin.test](/api/latest/kotlin.test/index.html) library under the hood and runs the test using JUnit.

## Add dependencies

1. Open a Kotlin project in IntelliJ IDEA. If you don't have a project, [create one](/docs/tutorials/jvm-get-started.html#create-an-application).

2. Open the `build.gradle(.kts)` file and add the following dependencies to the Gradle configuration to work with `kotlin.test` and `JUnit`:

   <div class="multi-language-sample" data-lang="groovy">
   <div class="sample" markdown="1" theme="idea" mode='groovy'>

   ```groovy
   dependencies {
       // Other dependencies.
       // ...
       testImplementation "org.jetbrains.kotlin:kotlin-test:1.3.11"
       testImplementation "org.jetbrains.kotlin:kotlin-test-junit:1.3.11"
   }
   ```

   </div>
   </div>

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

   ```kotlin
   dependencies {
       // Other dependencies.
       // ...
       testImplementation(kotlin("test"))
       testImplementation(kotlin("test-junit"))
   }
   ```

   </div>
   </div>


## Write code to test

1. Open the `main.kt` file in `src/main/kotlin`.

   The `src` directory contains Kotlin source files and resources. The `main.kt` file contains sample code that will print `Hello World!`.

2. Create the `Sample` class with the `sum()` function that sums two integers:

<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
class Sample() {

    fun sum(a: Int, b: Int): Int {
        return a + b
    }
}
```
</div>

## Create a test

1. In IntelliJ IDEA, select **Code** \| **Generate** \| **Test...** of the `main.kt` file in `src/main/kotlin`.

2. Specify the name of the test class. For example, `SampleTest`.

   IDEA creates the `SampleTest.kt` file in the `test` directory. It contains Kotlin test source files and resources.

2. Add the test code that for the `sum()` function in `SampleTest.kt`:
   
   * Define the test `testSum()` function using the [@Test](/api/latest/kotlin.test/kotlin.test/-test/index.html) annotation.
   * Check that the `sum()` function returns the value that is equal to the expected one using the [assertEquals](/api/latest/kotlin.test/kotlin.test/-test/assert-equals.html) function.


   <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

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
   </div>

## Run a test

1. Use the gutter icon to execute it. Also, you can run a test via the command-line interface using the `./gradlew` command.
2. Check the result of the test run. 

