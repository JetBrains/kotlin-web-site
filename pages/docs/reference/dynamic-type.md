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

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val dyn: dynamic = ...
```
</div>

The `dynamic` type basically turns off Kotlin's type checker:

  - a value of this type can be assigned to any variable or passed anywhere as a parameter;
  - any value can be assigned to a variable of type `dynamic` or passed to a function that takes `dynamic` as a parameter;
  - `null`-checks are disabled for such values.

The most peculiar feature of `dynamic` is that we are allowed to call **any** property or function with any parameters
on a `dynamic` variable:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```
</div>

On the JavaScript platform this code will be compiled "as is": `dyn.whatever(1)` in Kotlin becomes `dyn.whatever(1)` in
the generated JavaScript code.

When calling functions written in Kotlin on values of `dynamic` type, keep in mind the name mangling performed by the
Kotlin to JavaScript compiler. You may need to use the [@JsName annotation](js-to-kotlin-interop.html#jsname-annotation)
to assign well-defined names to the functions that you need to call.

A dynamic call always returns `dynamic` as a result, so we can chain such calls freely:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
dyn.foo().bar.baz()
```
</div>

When we pass a lambda to a dynamic call, all of its parameters by default have the type `dynamic`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
dyn.foo {
    x -> x.bar() // x is dynamic
}
```
</div>

Expressions using values of `dynamic` type are translated to JavaScript "as is", and do not use the Kotlin operator conventions.
The following operators are supported:

* binary: `+`, `-`, `*`, `/`, `%`, `>`, `<` `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* unary
    * prefix: `-`, `+`, `!`
    * prefix and postfix: `++`, `--`
* assignments: `+=`, `-=`, `*=`, `/=`, `%=`
* indexed access:
    * read: `d[a]`, more than one argument is an error
    * write: `d[a1] = a2`, more than one argument in `[]` is an error

`in`, `!in` and `..` operations with values of type `dynamic` are forbidden.

For a more technical description, see the [spec document](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md).
