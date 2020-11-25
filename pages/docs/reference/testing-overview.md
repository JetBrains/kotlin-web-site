---
type: doc
layout: reference
category: "Testing"
title: "Testing Overview"
---

# Testing overview

Code testing is necessary when the codebase is expanding. When you write code for a new feature, you should be sure that the previously written code remains valid and works as expected.

Testing the code usually means writing [unit tests](#unit-tests) and [integration tests](#integration-tests). Kotlin allows you to use different tools and frameworks to write tests.

> Unit and integration tests are common concepts for most programming languages, so if you're familiar with it, you can skip this introduction and proceed to [the tutorials](../tutorials/jvm-test-using-junit.html).
{:.note}

## Unit tests

Unit tests cover distinct entities of your code — functions, methods, classes.
They allow you to compare the actual result of the unit with the expected. You divide the functionality of your code into discrete units and test them separately.
Since unit tests are fast, and you can run them frequently to ensure that your code is correct.

Units test are independent parts of the code and should be placed separately. When you create a new Kotlin project using Project Wizard, IDEA creates a separate module for tests.

To write and run unit tests, you should add a testing framework and test runner engine to your project.
Various frameworks provide their APIs to write tests with annotations – special keywords, that mark test functions and top-level functions for performing assertions in tests.

<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
@Test // A Test annotation.
fun testSum() {
    val expected = 42
    assertEquals(expected, classForTesting.sum(40, 2)) // An assert function
}
```

</div>

When you need to create a specific object with data for test, you can use [mocking](#mocking).

Some frameworks provides annotation and a runner engine, for example [JUnit](https://junit.org/junit5/), [TestNG](https://testng.org/doc/).
The [kotlin.test](/api/latest/kotlin.test/index.html) library provides annotations and asserting functions to unify test code.
It allows writing tests independently of the test runner framework.

### Mocking

A mock object is a stub implementation for an entity (like an interface, or a class), that contains the particular output for testing purposes.
For example, you can create a mock class with data that a testing function will validate during the test running. 

You can create mock objects manually or use a mock framework to simulate these classes.
Using such frameworks, you can create mock objects at runtime and configure their behavior.

<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
// Should we put a mocking example here?
```

</div>

Frameworks:
[MockK](https://mockk.io/), [Mockito](https://github.com/mockito/mockito)

### Run the unit test code

Usually, the build tool runs unit tests. For example, Gradle.

Running tests in a Gradle build is supported by default for JVM, Android, Linux, Windows, and macOS.
You need to configure JS and other Kotlin/Native targets manually to run the tests with an appropriate environment, an emulator, or a test framework.

## Integration tests

Integration tests cover the part of the functionality of an application, different independent modules, user scenarios.
For example, a process of adding items to a product cart and purchasing them. 

Integration tests help to understand that some parts of the code work correctly together. Unlike unit tests, such tests use real objects.
Tests pass objects between modules and check the whole process.


#### What's next

See the following articles for details:
- [Running test in multiplatform projects](../tutorials/mpp/multiplatform-library.html#testing).
- [Running test in JS](../tutorials/javascript/running-tests.html).
- [Running test in JVM using JUnit](../tutorials/jvm-test-using-junit.html).

