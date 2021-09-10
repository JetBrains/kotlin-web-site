[//]: # (title: Exceptions)

## Exception classes

All exception classes in Kotlin inherit the `Throwable` class.
Every exception has a message, a stack trace, and an optional cause.

To throw an exception object, use the `throw` expression:

```kotlin
fun main() {
//sampleStart
    throw Exception("Hi There!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To catch an exception, use the `try`...`catch` expression:

```kotlin
try {
    // some code
} catch (e: SomeException) {
    // handler
} finally {
    // optional finally block
}
```

There may be zero or more `catch` blocks, and the `finally` block may be omitted.
However, at least one `catch` or `finally` block is required.

### Try is an expression

`try` is an expression, which means it can have a return value:

```kotlin
val a: Int? = try { input.toInt() } catch (e: NumberFormatException) { null }
```

The returned value of a `try` expression is either the last expression in the `try` block or the
last expression in the `catch` block (or blocks).
The contents of the `finally` block don't affect the result of the expression.

## Checked exceptions

Kotlin does not have checked exceptions. There are many reasons for this, but we will provide a simple example that illustrates why it is the case.

The following is an example interface from the JDK implemented by the `StringBuilder` class:

``` java
Appendable append(CharSequence csq) throws IOException;
```

This signature says that every time I append a string to something (a `StringBuilder`, some kind of a log, a console, etc.),
I have to catch the `IOExceptions`. Why? Because the implementation might be performing IO operations (`Writer` also implements `Appendable`).
The result is code like this all over the place.:

```kotlin
try {
    log.append(message)
} catch (IOException e) {
    // Must be safe
}
```

And that’s not good. Just take a look at [Effective Java, 3rd Edition](https://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 77: *Don't ignore exceptions*.

Bruce Eckel says this about checked exceptions:

> Examination of small programs leads to the conclusion that requiring exception specifications
>could both enhance developer productivity and enhance code quality, but experience with large software projects suggests
>a different result – decreased productivity and little or no increase in code quality.

And here are some additional thoughts on the matter:

* [Java's checked exceptions were a mistake](https://radio-weblogs.com/0122027/stories/2003/04/01/JavasCheckedExceptionsWereAMistake.html) (Rod Waldhoff)
* [The Trouble with Checked Exceptions](https://www.artima.com/intv/handcuffs.html) (Anders Hejlsberg)

If you want to alert callers about possible exceptions when calling Kotlin code from Java, Swift, or Objective-C,
you can use the `@Throws` annotation. Read more about using this annotation [for Java](java-to-kotlin-interop.md#checked-exceptions)
and [for Swift and Objective-C](native-objc-interop.md#errors-and-exceptions).

## The Nothing type

`throw` is an expression in Kotlin, so you can use it, for example, as part of an Elvis expression:

```kotlin
val s = person.name ?: throw IllegalArgumentException("Name required")
```

The `throw` expression has the type `Nothing`.
This type has no values and is used to mark code locations that can never be reached.
In your own code, you can use `Nothing` to mark a function that never returns:

```kotlin
fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
}
```

When you call this function, the compiler will know that the execution doesn't continue beyond the call:

```kotlin
val s = person.name ?: fail("Name required")
println(s)     // 's' is known to be initialized at this point
```

You may also encounter this type when dealing with type inference. The nullable variant of this type,
`Nothing?`, has exactly one possible value, which is `null`. If you use `null` to initialize
a value of an inferred type and there's no other information that can be used to determine a more
specific type, the compiler will infer the `Nothing?` type:

```kotlin
val x = null           // 'x' has type `Nothing?`
val l = listOf(null)   // 'l' has type `List<Nothing?>
```

## Java interoperability

Please see the section on exceptions in the [Java interoperability page](java-interop.md) for information about Java interoperability.
