---
type: doc
layout: reference
category: "Syntax"
title: "Annotations"
---

# Annotations

## Annotation Declaration
Annotations are means of attaching metadata to code. To declare an annotation, put the *annotation*{: .keyword } keyword in front of a class

``` kotlin
annotation class fancy {}
```

### Usage

``` kotlin
[fancy] class Foo {
  [fancy] fun baz([fancy] foo : Int) : Int {
    return [fancy] 1
  }
}
```

In most cases, the square brackets are optional and only required when annotating expressions or local declarations:

``` kotlin
fancy class Foo() {
  fancy fun baz(fancy foo: Int) {
    [fancy] fun bar() { ... }
    return [fancy] 1
  }
}
```

### Constructors

Annotations may have constructors that take parameters.

``` kotlin
annotation class special(val why : String)

special("example") class Foo {}
```

## Java Annotations

Java annotations are 100% compatible with Koltin

``` kotlin
import org.junit.Test
import org.junit.Assert.*

class Tests {
  Test fun simple() {
    assertEquals(42, getTheAnswer())
  }
}
```

Java annotations can also be made to look like modifiers by renaming them on import

``` kotlin
import org.junit.Test as test

class Tests {
  test fun simple() {
    ...
  }
}
```


