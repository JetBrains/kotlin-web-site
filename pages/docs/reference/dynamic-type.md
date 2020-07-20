---
type: doc
layout: reference
category: "Syntax"
title: "Dynamic Type"
---

# Dynamic Type

> The dynamic type is not supported in code targeting the JVM.
{:.note}

Kotlin is a statically typed language, which makes it different from the dynamically typed JavaScript. In order to facilitate interoperation with JavaScript code, Kotlin/JS offers the `dynamic` type:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val dyn: dynamic = ...
```
</div>

The `dynamic` type basically turns off Kotlin's type checker:

  - A `dynamic` value can be assigned to variables of any type, or passed anywhere as a parameter.
  - A `dynamic` variable can have a value of any type.
  - A function that takes a `dynamic` parameter can take arguments of any type. 
  - `null`-checks are disabled for values of type `dynamic`.

On a `dynamic` variable, you can call **any** property or function, with any parameters: 

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```
</div>

This code will be compiled "as is": `dyn.whatever(1)` in Kotlin becomes `dyn.whatever(1)` in
the generated JavaScript code.

When calling functions written in Kotlin on values of `dynamic` type, keep in mind the name mangling performed by the
Kotlin to JavaScript compiler. You may need to use the [@JsName annotation](js-to-kotlin-interop.html#jsname-annotation) or the [@JsExport annotation](js-to-kotlin-interop.html#jsexport-annotation) to assign well-defined names to the functions that you want to call.

A dynamic call always returns `dynamic` as a result. This means such calls can be chained freely:

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
