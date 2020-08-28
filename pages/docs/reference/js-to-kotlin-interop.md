---
type: doc
layout: reference
category: "JavaScript"
title: "Calling Kotlin from JavaScript"
---

# Calling Kotlin from JavaScript

Depending on the selected [JavaScript Module](js-modules.html) system, the Kotlin/JS compiler generates different output. But in general, the Kotlin compiler generates normal JavaScript classes, functions and properties, which you can freely use from JavaScript code. There are some subtle things you should remember, though.

## Isolating declarations in a separate JavaScript object in `plain` mode 
If you have explicitly set your module kind to be `plain`, Kotlin creates an object that contains all Kotlin declarations from the current module. This is done to prevent spoiling the global object. This means that for a module `myModule`, all declarations are available to JavaScript via the `myModule` object. For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun foo() = "Hello"
```
</div>

Can be called from JavaScript like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
alert(myModule.foo());
```
</div>

This is not applicable when you compile your Kotlin module to JavaScript modules like UMD (which is the default setting for both `browser` and `nodejs` targets), CommonJS or AMD. In this case, your declarations will be exposed in the format specified by your chosen JavaScript module system. When using UMD or CommonJS, for example, your call site could look like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
alert(require('myModule').foo());
```
</div>

Check the article on [JavaScript Modules](js-modules.html) for more information on the topic of JavaScript module systems.

## Package structure

Kotlin exposes its package structure to JavaScript, so unless you define your declarations in the root package,
you have to use fully qualified names in JavaScript. For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```
</div>

When using UMD or CommonJS, for example, your callsite could look like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
alert(require('myModule').my.qualified.packagename.foo())
```
</div>

Or, in the case of using `plain` as a module system setting:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
alert(myModule.my.qualified.packagename.foo());
```
</div>


### `@JsName` annotation

In some cases (for example, to support overloads), the Kotlin compiler mangles the names of generated functions and attributes
in JavaScript code. To control the generated names, you can use the `@JsName` annotation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
// Module 'kjs'
class Person(val name: String) {
    fun hello() {
        println("Hello $name!")
    }

    @JsName("helloWithGreeting")
    fun hello(greeting: String) {
        println("$greeting $name!")
    }
}
```
</div>

Now you can use this class from JavaScript in the following way:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```
</div>

If we didn't specify the `@JsName` annotation, the name of the corresponding function would contain a suffix
calculated from the function signature, for example `hello_61zpoe$`.

Note that there are some cases in which the Kotlin compiler does not apply mangling:
- `external` declarations are not mangled.
- Any overridden functions in non-`external` classes inheriting from `external` classes are not mangled.


The parameter of `@JsName` is required to be a constant string literal which is a valid identifier.
The compiler will report an error on any attempt to pass non-identifier string to `@JsName`.
The following example produces a compile-time error:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@JsName("new C()")   // error here
external fun newC()
```
</div>

### `@JsExport` annotation
> The `@JsExport` annotation is currently marked as experimental. Its design may change in future versions.
{:.note} 

By applying the `@JsExport` annotation to a top-level declaration (like a class or function), you make the Kotlin declaration available from JavaScript. The annotation exports all nested declarations with the name given in Kotlin. It can also be applied on file-level using `@file:JsExport`.

To resolve ambiguities in exports (like overloads for functions with the same name), you can use the `@JsExport` annotation together with `@JsName` to specify the names for the generated and exported functions.

The `@JsExport` annotation is available in the current default compiler backend and the new [IR compiler backend](js-ir-compiler.html). If you are targeting the IR compiler backend, you **must** use the `@JsExport` annotation to make your functions visible from Kotlin in the first place.

For multiplatform projects, `@JsExport` is available in common code as well. It only has an effect when compiling for the JavaScript target, and allows you to also export Kotlin declarations that are not platform specific.

## Representing Kotlin types in JavaScript

* Kotlin numeric types, except for `kotlin.Long` are mapped to JavaScript Number.
* `kotlin.Char` is mapped to JavaScript Number representing character code.
* Kotlin can't distinguish between numeric types at run time (except for `kotlin.Long`), so the following code works:
  <div class="sample" markdown="1" theme="idea" data-highlight-only>
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```
  </div>

* Kotlin preserves overflow semantics for `kotlin.Int`, `kotlin.Byte`, `kotlin.Short`, `kotlin.Char` and `kotlin.Long`.
* `kotlin.Long` is not mapped to any JavaScript object, as there is no 64-bit integer number type in JavaScript. It is emulated by a Kotlin class. 
* `kotlin.String` is mapped to JavaScript String.
* `kotlin.Any` is mapped to JavaScript Object (`new Object()`, `{}`, etc).
* `kotlin.Array` is mapped to JavaScript Array.
* Kotlin collections (`List`, `Set`, `Map`, etc.) are not mapped to any specific JavaScript type.
* `kotlin.Throwable` is mapped to JavaScript Error.
* Kotlin preserves lazy object initialization in JavaScript.
* Kotlin does not implement lazy initialization of top-level properties in JavaScript.

Starting with version 1.1.50 primitive array translation utilizes JavaScript TypedArray:

* `kotlin.ByteArray`, `-.ShortArray`, `-.IntArray`, `-.FloatArray`, and `-.DoubleArray` are mapped to
   JavaScript Int8Array, Int16Array, Int32Array, Float32Array, and Float64Array correspondingly.
* `kotlin.BooleanArray` is mapped to JavaScript Int8Array with a property `$type$ == "BooleanArray"`
* `kotlin.CharArray` is mapped to JavaScript UInt16Array with a property `$type$ == "CharArray"`
* `kotlin.LongArray` is mapped to JavaScript Array of `kotlin.Long` with a property `$type$ == "LongArray"`.

