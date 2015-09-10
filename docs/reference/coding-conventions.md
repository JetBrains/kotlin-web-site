---
type: doc
layout: reference
category: Basics
title: Coding Conventions
---

# Coding Conventions

This page contains the current coding style for the Kotlin language.

## Naming Style
If in doubt default to the Java Coding Conventions such as:

* use of camelCase for names (and avoid underscore in names)
* types start with upper case
* methods and properties start with lower case
* use 4 space indentation
* public functions should have documentation such that it appears in Kotlin Doc

In some cases, it's necessary to define a [backing property](properties.html#backing-properties) for a property.
(For example, it can be necessary when the public view of a property is a read-only collection, and inside the class
the collection is mutable). In that case, the name of the backing property should use the _ prefix:

```
class Node {
    private val _children = arrayListOf<Node>()

    public val children: List<Node> get() = _children
}
```

## Colon

There is a space before colon where colon separates type and supertype and there's no space where colon separates instance and type:

``` kotlin
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```

## Lambdas

In lambda expressions, spaces should be used around the curly braces, as well as around the arrow which separates the parameters
from the body. Whenever possible, a lambda should be passed outside of parentheses.

``` kotlin
list.filter { it > 10 }.map { element -> element * 2 }
```

In lambdas which are short and not nested, it's recommended to use the `it` convention instead of declaring the parameter
explicitly. In nested lambdas with parameters, parameters should be always declared explicitly.

## Unit

If a function returns Unit, the return type should be omitted:

``` kotlin
fun foo() { // ": Unit" is omitted here

}
```
