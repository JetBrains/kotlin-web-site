---
layout: api
title: kotlin.test
---
[stdlib](../index.html) / [kotlin.test](index.html)

# kotlin.test

```
package kotlin.test
```
## Members
| Name | Summary |
|------|---------|
|[Asserter](Asserter/index.html)|A plugin for performing assertions which can reuse JUnit or TestNG<br>&nbsp;&nbsp;`abstract public trait Asserter`<br>|
|[DefaultAsserter](DefaultAsserter/index.html)|Default implementation to avoid dependency on JUnit or TestNG<br>&nbsp;&nbsp;`class DefaultAsserter`<br>|
|[_asserter](_asserter.html)|&nbsp;&nbsp;`private val _asserter: Asserter`<br>|
|[assertEquals](assertEquals.html)|Asserts that the expected value is equal to the actual value, with an optional message<br>&nbsp;&nbsp;`public fun assertEquals(expected: Any, actual: Any, message: String): Unit`<br>|
|[assertFalse](assertFalse.html)|Asserts that the expression is false with an optional message<br>&nbsp;&nbsp;`public fun assertFalse(actual: Boolean, message: String): Unit`<br>|
|[assertNot](assertNot.html)|Asserts that the given block returns false<br>&nbsp;&nbsp;`public fun assertNot(message: String, block: ()->Boolean): Unit`<br>&nbsp;&nbsp;`public fun assertNot(block: ()->Boolean): Unit`<br>|
|[assertNotNull](assertNotNull.html)|Asserts that the expression is not null, with an optional message and a function block to process the not-null value<br>&nbsp;&nbsp;`public fun <T, R> assertNotNull(actual: T, block: (T)->R): Unit`<br>&nbsp;&nbsp;`public fun <T, R> assertNotNull(actual: T, message: String, block: (T)->R): Unit`<br><br>Asserts that the expression is not null, with an optional message<br>&nbsp;&nbsp;`public fun <T> assertNotNull(actual: T, message: String): T`<br>|
|[assertNull](assertNull.html)|Asserts that the expression is null, with an optional message<br>&nbsp;&nbsp;`public fun assertNull(actual: Any, message: String): Unit`<br>|
|[assertTrue](assertTrue.html)|A number of helper methods for writing Kool unit tests<br>&nbsp;&nbsp;`public fun assertTrue(message: String, block: ()->Boolean): Unit`<br><br>Asserts that the given block returns true<br>&nbsp;&nbsp;`public fun assertTrue(block: ()->Boolean): Unit`<br><br>Asserts that the expression is true with an optional message<br>&nbsp;&nbsp;`public fun assertTrue(actual: Boolean, message: String): Unit`<br>|
|[asserter](asserter/index.html)|&nbsp;&nbsp;`public val asserter: Asserter`<br>|
|[expect](expect.html)|Asserts that given function block returns the given expected value<br>&nbsp;&nbsp;`public fun <T> expect(expected: T, block: ()->T): Unit`<br><br>Asserts that given function block returns the given expected value and use the given message if it fails<br>&nbsp;&nbsp;`public fun <T> expect(expected: T, message: String, block: ()->T): Unit`<br>|
|[fail](fail.html)|Marks a test as having failed if this point in the execution path is reached, with an optional message<br>&nbsp;&nbsp;`public fun fail(message: String): Unit`<br>|
|[fails](fails.html)|Asserts that given function block fails by throwing an exception<br>&nbsp;&nbsp;`public fun fails(block: ()->Unit): Throwable`<br>|
|[failsWith](failsWith.html)|Asserts that a block fails with a specific exception being thrown<br>&nbsp;&nbsp;`public fun <T : T> failsWith(exceptionClass: Class<T>, block: ()->Any): T`<br>|
|[todo](todo.html)|Comments out a block of test code until it is implemented while keeping a link to the code<br>&nbsp;&nbsp;`public fun todo(block: ()->Any): Unit`<br>|
