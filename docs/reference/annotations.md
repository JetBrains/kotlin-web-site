---
type: doc
layout: reference
category: "Syntax"
title: "Annotations"
---

# Annotations

## Annotation Declaration
Annotations are means of attaching metadata to code. To declare an annotation, put the *annotation*{: .keyword } keyword in front of a class:

``` kotlin
annotation class fancy
```

### Usage

``` kotlin
@fancy class Foo {
  @fancy fun baz(@fancy foo: Int): Int {
    return (@fancy 1)
  }
}
```

In most cases, the `@ `sign is optional. It is only required when annotating expressions or local declarations:

``` kotlin
fancy class Foo {
  fancy fun baz(fancy foo: Int): Int {
    @fancy fun bar() { ... }
    return (@fancy 1)
  }
}
```

If you need to annotate the primary constructor of a class, you need to add the *constructor*{: .keyword} keyword
to the constructor declaration, and add the annotations before it:


``` kotlin
class Foo @inject constructor(dependency: MyDependency) {
  // ...
}
```

You can also annotate property accessors:

``` kotlin
class Foo {
    var x: MyDependency? = null
        @inject set
}
```

### Constructors

Annotations may have constructors that take parameters.

``` kotlin
annotation class special(val why: String)

special("example") class Foo {}
```

### Lambdas

Annotations can also be used on lambdas. They will be applied to the `invoke()` method into which the body
of the lambda is generated. This is useful for frameworks like [Quasar](http://www.paralleluniverse.co/quasar/),
which uses annotations for concurrency control.

``` kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```


## Java Annotations

Java annotations are 100% compatible with Kotlin:

``` kotlin
import org.junit.Test
import org.junit.Assert.*

class Tests {
  Test fun simple() {
    assertEquals(42, getTheAnswer())
  }
}
```

Java annotations can also be made to look like modifiers by renaming them on import:

``` kotlin
import org.junit.Test as test

class Tests {
  test fun simple() {
    ...
  }
}
```

Since the order of parameters for an annotation written in Java is not defined, you can't use a regular function
call syntax for passing the arguments. Instead, you need to use the named argument syntax.

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

``` kotlin
// Kotlin
Ann(intValue = 1, stringValue = "abc") class C
```

Just like in Java, a special case is the `value` parameter; its value can be specified without an explicit name.

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

``` kotlin
// Kotlin
AnnWithValue("abc") class C
```

If the `value` argument in Java has an array type, it becomes a `vararg` parameter in Kotlin:

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

``` kotlin
// Kotlin
AnnWithArrayValue("abc", "foo", "bar") class C
```

If you need to specify a class as an argument of an annotation, use a Kotlin class
([KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)). The Kotlin compiler will
automatically convert it to a Java class, so that the Java code will be able to see the annotations and arguments
normally.

``` kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any?>)

Ann(String::class, Int::class) class MyClass
```

Values of an annotation instance are exposed as properties to Kotlin code.

``` java
// Java
public @interface Ann {
    int value();
}
```

``` kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```
