---
type: doc
layout: reference
category: "Syntax"
title: "Dynamic Type"
---

# Dynamic Type

> The dynamic type is not supported in code targeting the JVM
{:.note}

Being a statically typed language, Kotlin still has to interoperate with untyped or loosely typed environments,
such as the JavaScript ecosystem. To facilitate these use cases, the `dynamic` type is available in the language:

``` kotlin
val dyn: dynamic = ...
```

The `dynamic` type basically turns off Kotlin's type checker:

  - a value of this type can be assigned to any variable or passed anywhere as a parameter,
  - any value can be assigned to a variable of type `dynamic` or passed to a function that takes `dynamic` as a parameter,
  - `null`-checks are disabled for such values.

The most peculiar feature of `dynamic` is that we are allowed to call **any** property or function with any parameters
on a `dynamic` variable:

``` kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```

On the JavaScript platform this code will be compiled "as is": `dyn.whatever(1)` in Kotlin becomes `dyn.whatever(1)` in
the generated JavaScript code.

A dynamic call always returns `dynamic` as a result, so we can chain such calls freely:

``` kotlin
dyn.foo().bar.baz()
```

When we pass a lambda to a dynamic call, all of its parameters by default have the type `dynamic`:

``` kotlin
dyn.foo {
  x -> x.bar() // x is dynamic
}
```

For a more technical description, see the [spec document](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md).


