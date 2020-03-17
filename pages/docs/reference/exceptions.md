---
type: doc
layout: reference
category: "Syntax"
title: "Exceptions: try, catch, finally, throw, Nothing"
---

# Exceptions

## Exception Classes

All exception classes in Kotlin are descendants of the class `Throwable`.
Every exception has a message, stack trace and an optional cause.

To throw an exception object, use the *throw*{: .keyword }-expression:

<div class="sample" markdown="1" theme="idea">
```kotlin

fun main() {
//sampleStart
    throw Exception("Hi There!")
//sampleEnd
}
```
</div>

To catch an exception, use the *try*{: .keyword }-expression:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
try {
    // some code
}
catch (e: SomeException) {
    // handler
}
finally {
    // optional finally block
}
```
</div>

There may be zero or more *catch*{: .keyword } blocks. *finally*{: .keyword } block may be omitted.
However at least one *catch*{: .keyword } or *finally*{: .keyword } block should be present.

### Try is an expression

*try*{: .keyword } is an expression, i.e. it may have a return value:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val a: Int? = try { parseInt(input) } catch (e: NumberFormatException) { null }
```
</div>

The returned value of a *try*{: .keyword }-expression is either the last expression in the *try*{: .keyword } block or the
last expression in the *catch*{: .keyword } block (or blocks).
Contents of the *finally*{: .keyword } block do not affect the result of the expression.

## Checked Exceptions

Kotlin does not have checked exceptions. There are many reasons for this, but we will provide a simple example.

The following is an example interface of the JDK implemented by `StringBuilder` class:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` java
Appendable append(CharSequence csq) throws IOException;
```
</div>

What does this signature say? It says that every time I append a string to something (a `StringBuilder`, some kind of a log, a console, etc.)
I have to catch those `IOExceptions`. Why? Because it might be performing IO (`Writer` also implements `Appendable`)...
So it results in this kind of code all over the place:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
try {
    log.append(message)
}
catch (IOException e) {
    // Must be safe
}
```
</div>

And this is no good, see [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 77: *Don't ignore exceptions*.

Bruce Eckel says about checked exceptions:

> Examination of small programs leads to the conclusion that requiring exception specifications could both enhance developer productivity and enhance code quality, but experience with large software projects suggests a different result – decreased productivity and little or no increase in code quality.

Other citations of this sort:

* [Java's checked exceptions were a mistake](http://radio-weblogs.com/0122027/stories/2003/04/01/JavasCheckedExceptionsWereAMistake.html) (Rod Waldhoff)
* [The Trouble with Checked Exceptions](http://www.artima.com/intv/handcuffs.html) (Anders Hejlsberg)

If you want to alert callers of possible exceptions when calling Kotlin code from Java, Swift, or Objective-C, you can use the `@Throws` annotation. Read more about using this annotation [for Java](https://kotlinlang.org/docs/reference/java-to-kotlin-interop.html#checked-exceptions) as well as [for Swift and Objective-C](https://kotlinlang.org/docs/reference/native/objc_interop.html#errors-and-exceptions).

## The Nothing type

`throw` is an expression in Kotlin, so you can use it, for example, as part of an Elvis expression:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val s = person.name ?: throw IllegalArgumentException("Name required")
```
</div>

The type of the `throw` expression is the special type `Nothing`.
The type has no values and is used to mark code locations that can never be reached.
In your own code, you can use `Nothing` to mark a function that never returns:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
}
```
</div>

When you call this function, the compiler will know that the execution doesn't continue beyond the call:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val s = person.name ?: fail("Name required")
println(s)     // 's' is known to be initialized at this point
```
</div>

Another case where you may encounter this type is type inference. The nullable variant of this type,
`Nothing?`, has exactly one possible value, which is `null`. If you use `null` to initialize
a value of an inferred type and there's no other information that can be used to determine a more
specific type, the compiler will infer the `Nothing?` type:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val x = null           // 'x' has type `Nothing?`
val l = listOf(null)   // 'l' has type `List<Nothing?>
```
</div>

## Java Interoperability

Please see the section on exceptions in the [Java Interoperability section](java-interop.html) for information about Java interoperability.
