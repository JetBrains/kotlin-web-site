---
type: doc
layout: reference
category: "Syntax"
title: "Exceptions"
---

# Exceptions

## Exception Classes

All exception classes in Kotlin are descendants of the class *Exception*. Every exception has a message, stack trance and an optional cause.

To throw an exception object, use the *throw*{: .keyword } expression

``` kotlin
throw MyException("Hi There!")
```

To catch an exception, use the *try*{: .keyword } expression

``` kotlin
try {
  // some code
}
catch (e : SomeException) {
  // handler
}
finally {
  // optional finally block
}
```

There may be zero or more *catch*{: .keyword } blocks. *finally*{: .keyword } blocks may be omitted. However at least one *catch*{: .keyword } or *finally*{: .keyword } block
should be present.

### Try is an expression

*try*{: .keyword } is an expression, i.e. it may have a return value.

``` kotlin
val a : Int? = try { parseInt(input) } catch (e : NumberFormatException) { null }
```

The returned value of a *try*{: .keyword } expression with no *finally*{: .keyword } is either the last expression in the *try*{: .keyword } block or the
last expression in the *catch*{: .keyword } block (or blocks).

If *finally*{: .keyword } block is present, its last expression is the value of the *try*{: .keyword } expression.

## Checked Exceptions

Kotlin does not have checked exceptions. There are many reasons for this, but we will provide a simple example.

The following is an example interface of the JDK implemented by *StringBuilder* class

``` kotlin
Appendable append(CharSequence csq) throws IOException;
```

What does this signature say? It says that every time I append a string to something (a StringBuilder, some kind of a log, a console, etc) I have to catch those IOExceptions. Why? Because it might be performing IO (Writer also implements Appendable)... So it results into this kind of code all over the place:

``` kotlin
try {
  log.append(message);
}
catch (IOException e) {
  // Must be safe
}
```

And this is no good, see [Effective Java Item 65](http://java.sun.com/docs/books/effective): Don't ignore exceptions.

Bruce Eckel says in [Does Java need Checked Exceptions?](http://www.mindview.net/Etc/Discussions/CheckedExceptions) :

Examination of small programs leads to the conclusion that requiring exception specifications could both enhance developer productivity and enhance code quality, but experience with large software projects suggests a different result – decreased productivity and little or no increase in code quality.

Other citations of this sort:

[Java's checked exceptions were a mistake](http://radio-weblogs.com/0122027/stories/2003/04/01/JavasCheckedExceptionsWereAMistake.html) (Rod Waldhoff)
[The Trouble with Checked Exceptions](http://www.artima.com/intv/handcuffs.html) (Anders Hejlsberg]

## Java Interoperability

Please see the section on exceptions in the [Java Interoperability section](java-interop.html) for information about Java interoperability.

