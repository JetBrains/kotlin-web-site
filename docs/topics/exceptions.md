[//]: # (title: Exceptions)

## Exception classes

All exception classes in Kotlin inherit the class `Throwable`.
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

There may be zero or more `catch` blocks. `finally` block may be omitted.
However, at least one `catch` or `finally` block should be present.

### Try is an expression

`try` is an expression; thus, it can have a return value:

```kotlin
val a: Int? = try { parseInt(input) } catch (e: NumberFormatException) { null }
```

The returned value of a `try`-expression is either the last expression in the `try` block or the
last expression in the `catch` block (or blocks).
Contents of the `finally` block do not affect the result of the expression.

## Checked exceptions

Kotlin does not have checked exceptions. There are many reasons for this, but we will provide a simple example.

The following is an example interface of the JDK implemented by `StringBuilder` class:

``` java
Appendable append(CharSequence csq) throws IOException;
```

What does this signature say? It says that every time I append a string to something (a `StringBuilder`, some kind of a log, a console, etc.)
I have to catch those `IOExceptions`. Why? Because it might be performing IO (`Writer` also implements `Appendable`)...
So it results in this kind of code all over the place:

```kotlin
try {
    log.append(message)
} catch (IOException e) {
    // Must be safe
}
```

And this is no good, see [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 77: *Don't ignore exceptions*.

Bruce Eckel says about checked exceptions:

> Examination of small programs leads to the conclusion that requiring exception specifications
>could both enhance developer productivity and enhance code quality, but experience with large software projects suggests
>a different result – decreased productivity and little or no increase in code quality.

Other citations of this sort:

* [Java's checked exceptions were a mistake](http://radio-weblogs.com/0122027/stories/2003/04/01/JavasCheckedExceptionsWereAMistake.html) (Rod Waldhoff)
* [The Trouble with Checked Exceptions](http://www.artima.com/intv/handcuffs.html) (Anders Hejlsberg)

If you want to alert callers of possible exceptions when calling Kotlin code from Java, Swift, or Objective-C, 
you can use the `@Throws` annotation. Read more about using this annotation [for Java](java-to-kotlin-interop.md#checked-exceptions) 
as well as [for Swift and Objective-C](native-objc-interop.md#errors-and-exceptions).

## The Nothing type

`throw` is an expression in Kotlin, so you can use it, for example, as part of an Elvis expression:

```kotlin
val s = person.name ?: throw IllegalArgumentException("Name required")
```

The type of the `throw` expression is the special type `Nothing`.
The type has no values and is used to mark code locations that can never be reached.
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

Another case where you may encounter this type is type inference. The nullable variant of this type,
`Nothing?`, has exactly one possible value, which is `null`. If you use `null` to initialize
a value of an inferred type and there's no other information that can be used to determine a more
specific type, the compiler will infer the `Nothing?` type:

```kotlin
val x = null           // 'x' has type `Nothing?`
val l = listOf(null)   // 'l' has type `List<Nothing?>
```

## Java interoperability

Please see the section on exceptions in the [Java Interoperability section](java-interop.md) for information about Java interoperability.
