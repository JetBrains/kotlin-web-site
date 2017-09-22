---
type: doc
layout: reference
category: "JavaScript"
title: "Calling Kotlin from JavaScript"
---

# Calling Kotlin from JavaScript

Kotlin compiler generates normal JavaScript classes, functions and properties you can freely use from
JavaScript code. Nevertheless, there are some subtle things you should remember.

## Isolating declarations in a separate JavaScript object

To prevent spoiling the global object, Kotlin creates an object that contains all Kotlin declarations
from the current module. So if you name your module as `myModule`, all declarations are available to JavaScript
via `myModule` object. For example:

``` kotlin
fun foo() = "Hello"
```

Can be called from JavaScript like this:

``` javascript
alert(myModule.foo());
```

This is not applicable when you compile your Kotlin module to JavaScript module (see [JavaScript Modules](js-modules.html) for more information on this).
In this case there won't be a wrapper object, instead, declarations will be exposed as a JavaScript module of a corresponding kind. For example,
in case of CommonJS you should write:

``` javascript
alert(require('myModule').foo());
```


## Package structure

Kotlin exposes its package structure to JavaScript, so unless you define your declarations in the root package,
you have to use fully-qualified names in JavaScript. For example:

``` kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

Can be called from JavaScript like this:

``` javascript
alert(myModule.my.qualified.packagename.foo());
```


### `@JsName` annotation

In some cases (for example, to support overloads), Kotlin compiler mangles names of generated functions and attributes
in JavaScript code. To control the generated names, you can use the `@JsName` annotation:

``` kotlin
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

Now you can use this class from JavaScript in the following way:

``` javascript
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

If we didn't specify the `@JsName` annotation, the name of the corresponding function would contain a suffix
calculated from the function signature, for example `hello_61zpoe$`.

Note that Kotlin compiler does not apply such mangling to `external` declarations, so you don't have to
use `@JsName` on them. Another case worth noticing is inheriting non-external classes from external classes.
In this case any overridden functions won't be mangled as well.

The parameter of `@JsName` is required to be a constant string literal which is a valid identifier.
The compiler will report an error on any attempt to pass non-identifier string to `@JsName`.
The following example produces a compile-time error:

``` kotlin
@JsName("new C()")   // error here
external fun newC()
```


## Representing Kotlin types in JavaScript

* Kotlin numeric types, except for `kotlin.Long` are mapped to JavaScript Number.
* `kotlin.Char` is mapped to JavaScript Number representing character code.
* Kotlin can't distinguish between numeric types at run time (except for `kotlin.Long`), i.e. the following code works:

  ``` kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin preserves overflow semantics for `kotlin.Int`, `kotlin.Byte`, `kotlin.Short`, `kotlin.Char` and `kotlin.Long`.
* There's no 64 bit integer number in JavaScript, so `kotlin.Long` is not mapped to any JavaScript object,
  it's emulated by a Kotlin class.
* `kotlin.String` is mapped to JavaScript String.
* `kotlin.Any` is mapped to JavaScript Object (i.e. `new Object()`, `{}`, etc).
* `kotlin.Array` is mapped to JavaScript Array.
* Kotlin collections (i.e. `List`, `Set`, `Map`, etc) are not mapped to any specific JavaScript type.
* `kotlin.Throwable` is mapped to JavaScript Error.
* Kotlin preserves lazy object initialization in JavaScript.
* Kotlin does not implement lazy initialization of top-level properties in JavaScript.

Starting with version 1.1.50 primitive array translation utilizes JavaScript TypedArray:

* `kotlin.ByteArray`, `-.ShortArray`, `-.IntArray`, `-.FloatArray`, and `-.DoubleArray` are mapped to
   JavaScript Int8Array, Int16Array, Int32Array, Float32Array, and Float64Array correspondingly.
* `kotlin.BooleanArray` is mapped to JavaScript Int8Array with a property `$type$ == "BooleanArray"`
* `kotlin.CharArray` is mapped to JavaScript UInt16Array with a property `$type$ == "CharArray"`
* `kotlin.LongArray` is mapped to JavaScript Array of `kotlin.Long` with a property `$type$ == "LongArray"`.

