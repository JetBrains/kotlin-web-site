[//]: # (title: Dynamic type)

> The dynamic type is not supported in code targeting the JVM.
>
{type="note"}

Being a statically typed language, Kotlin still has to interoperate with untyped or loosely typed environments,
such as the JavaScript ecosystem. To facilitate these use cases, the `dynamic` type is available in the language:

```kotlin
val dyn: dynamic = ...
```

The `dynamic` type basically turns off Kotlin's type checker:

- A value of the `dynamic` type can be assigned to any variable or passed anywhere as a parameter.
- Any value can be assigned to a variable of the `dynamic` type or passed to a function that takes `dynamic` as a parameter.
- `null`-checks are disabled for the `dynamic` type values.

The most peculiar feature of `dynamic` is that we are allowed to call **any** property or function with any parameters
on a `dynamic` variable:

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```

On the JavaScript platform this code will be compiled "as is": `dyn.whatever(1)` in Kotlin becomes `dyn.whatever(1)` in
the generated JavaScript code.

When calling functions written in Kotlin on values of `dynamic` type, keep in mind the name mangling performed by the
Kotlin to JavaScript compiler. You may need to use the [@JsName annotation](js-to-kotlin-interop.md#jsname-annotation)
to assign well-defined names to the functions that you need to call.

A dynamic call always returns `dynamic` as a result, so you can chain such calls freely:

```kotlin
dyn.foo().bar.baz()
```

When you pass a lambda to a dynamic call, all of its parameters by default have the type `dynamic`:

```kotlin
dyn.foo {
    x -> x.bar() // x is dynamic
}
```

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
