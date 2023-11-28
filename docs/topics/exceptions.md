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
### Author is mistaked in the above, the StringBuilder.append(...) methods doesn't throw IOExceptions, thus relevant part is removed as false information.
### (Javadoc proof: https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html#append-java.lang.CharSequence-)

Bruce Eckel says this about checked exceptions:

> Examination of small programs leads to the conclusion that requiring exception specifications
>could both enhance developer productivity and enhance code quality, but experience with large software projects suggests
>a different result – decreased productivity and little or no increase in code quality.

### Bruce Exckel is never said the above, he stated that some C# developer said it, the original part from his book "Effective Java" is:
### https://www.linuxtopia.org/online_books/programming_books/thinking_in_java/TIJ311_020.htm
```kotlin
The scale of the program seems to be a significant issue. This is a problem because most discussions tend to use small programs as demonstrations. # One of the C# designers observed that:

“Examination of small programs leads to the conclusion that requiring exception specifications could both enhance developer productivity and enhance code quality, but experience with large software projects suggests a different result—decreased productivity and little or no increase in code quality.”
```
### And Bruce Eckel's real opinion is:
```kotlin
I now think that Java’s important step was to unify the error reporting model, so that all errors are reported using exceptions.
```
and
```kotlin
the great benefits actually come from:

A unified error-reporting model via exceptions, regardless of whether the programmer is forced by the compiler to handle them.
```
#
And here are some additional thoughts on the matter:
* [Java's checked exceptions were a mistake](https://radio-weblogs.com/0122027/stories/2003/04/01/JavasCheckedExceptionsWereAMistake.html) (Rod Waldhoff)
* [The Trouble with Checked Exceptions](https://www.artima.com/intv/handcuffs.html) (Anders Hejlsberg)

### The above links doesn't have any usefull information since they not provide enough explanation to the subject. They shows how exceptions can be used wrong, and such articles more relevant to category "How to write a bad code" rather than be a discusson of programming language feature. 
### Moreover the Rod Waldhoff conclusion is: "By the way, I still think checked exceptions offer some advantage in the cases I enumerated above."
### Anders Hejlsberg just gave example of wrong usage in case of Client-Server communication and stated that below by:
```kotlin
Anders Hejlsberg: No, because in a lot of cases, people don't care. They're not going to handle any of these exceptions. There's a bottom level exception handler around their message loop. That handler is just going to bring up a dialog that says what went wrong and continue. The programmers protect their code by writing try finally's everywhere, so they'll back out correctly if an exception occurs, but they're not actually interested in handling the exceptions.
```
### Thus the wrong exceptions usage is not their existance but wrong understanding of it by developers

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
