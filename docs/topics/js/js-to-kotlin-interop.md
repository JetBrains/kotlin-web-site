[//]: # (title: Use Kotlin code from JavaScript)

Depending on the selected [JavaScript Module](js-modules.md) system, the Kotlin/JS compiler generates different output.
But in general, the Kotlin compiler generates normal JavaScript classes, functions and properties, which you can freely
use from JavaScript code. There are some subtle things you should remember, though.

## Isolating declarations in a separate JavaScript object in plain mode 

If you have explicitly set your module kind to be `plain`, Kotlin creates an object that contains all Kotlin declarations
from the current module. This is done to prevent spoiling the global object. This means that for a module `myModule`,
all declarations are available to JavaScript via the `myModule` object. For example:

```kotlin
fun foo() = "Hello"
```

Can be called from JavaScript like this:

```javascript
alert(myModule.foo());
```

This is not applicable when you compile your Kotlin module to JavaScript modules like UMD (which is the default setting
for both `browser` and `nodejs` targets), ESM, CommonJS or AMD.
In this case, your declarations will be exposed in the format specified by your chosen JavaScript module system.
When using UMD, ESM or CommonJS, for example, your call site could look
like this:

```javascript
alert(require('myModule').foo());
```

Check the article on [JavaScript Modules](js-modules.md) for more information on the topic of JavaScript module systems.

## Package structure

For most of the module systems, Kotlin exposes its package structure to JavaScript,
so unless you define your declarations in the root package, you have to use fully qualified names in JavaScript.
For example:

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

When using UMD or CommonJS, for example, your callsite could look like this:

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

Or, in the case of using `plain` as a module system setting:

```javascript
alert(myModule.my.qualified.packagename.foo());
```

However, there is an exception for `ES` modules.
It loses the package information to improve the final application bundle-size.
So the consumption of the Kotlin declarations with ES modules looks like this:
```javascript
import { foo } from 'myModule';

alert(foo());
```

### @JsName annotation

In some cases (for example, to support overloads), the Kotlin compiler mangles the names of generated functions and attributes
in JavaScript code. To control the generated names, you can use the `@JsName` annotation:

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

Now you can use this class from JavaScript in the following way:

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

If we didn't specify the `@JsName` annotation, the name of the corresponding function would contain a suffix
calculated from the function signature, for example `hello_61zpoe$`.

Note that there are some cases in which the Kotlin compiler does not apply mangling:
- `external` declarations are not mangled.
- Any overridden functions in non-`external` classes inheriting from `external` classes are not mangled.

The parameter of `@JsName` is required to be a constant string literal which is a valid identifier.
The compiler will report an error on any attempt to pass non-identifier string to `@JsName`.
The following example produces a compile-time error:

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExport annotation

> This feature is [Experimental](components-stability.md#stability-levels-explained).
> Its design may change in future versions.
>
{style="warning"} 

By applying the `@JsExport` annotation to a top-level declaration (like a class or function), you make the Kotlin
declaration available from JavaScript. The annotation exports all nested declarations with the name given in Kotlin.
It can also be applied on file-level using `@file:JsExport`.

To resolve ambiguities in exports (like overloads for functions with the same name), you can use the `@JsExport`
annotation together with `@JsName` to specify the names for the generated and exported functions.

In the current [IR compiler backend](js-ir-compiler.md), the `@JsExport` annotation is the only way to make your functions
visible from Kotlin.

For multiplatform projects, `@JsExport` is available in common code as well. It only has an effect when compiling for
the JavaScript target, and allows you to also export Kotlin declarations that are not platform specific.

### @JsStatic

> This feature is [Experimental](components-stability.md#stability-levels-explained). It may be dropped or changed at any time.
> Use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic).
>
{style="warning"}

The `@JsStatic` annotation instructs the compiler to generate additional static methods for the target declaration.
This helps you use static members from your Kotlin code directly in JavaScript.

You can apply the `@JsStatic` annotation to functions defined in named objects, as well as in companion objects declared
inside classes and interfaces. If you use this annotation, the compiler will generate both a static method of the object
and an instance method in the object itself. For example:

```kotlin
// Kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

Now, the `callStatic()` function is static in JavaScript while the `callNonStatic()` function is not:

```javascript
// JavaScript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

It's also possible to apply the `@JsStatic` annotation to a property of an object or a companion object, making its getter
and setter methods static members in that object or the class containing the companion object.

## Kotlin types in JavaScript

See how Kotlin types are mapped to JavaScript ones:

| Kotlin                                                           | JavaScript                | Comments                                                                                   |
|------------------------------------------------------------------|---------------------------|--------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                            |
| `Char`                                                           | `Number`                  | The number represents the character's code.                                                |
| `Long`                                                           | Not supported             | There is no 64-bit integer number type in JavaScript, so it is emulated by a Kotlin class. |
| `Boolean`                                                        | `Boolean`                 |                                                                                            |
| `String`                                                         | `String`                  |                                                                                            |
| `Array`                                                          | `Array`                   |                                                                                            |
| `ByteArray`                                                      | `Int8Array`               |                                                                                            |
| `ShortArray`                                                     | `Int16Array`              |                                                                                            |
| `IntArray`                                                       | `Int32Array`              |                                                                                            |
| `CharArray`                                                      | `UInt16Array`             | Carries the property `$type$ == "CharArray"`.                                              |
| `FloatArray`                                                     | `Float32Array`            |                                                                                            |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                            |
| `LongArray`                                                      | `Array<kotlin.Long>`      | Carries the property `$type$ == "LongArray"`. Also see Kotlin's Long type comment.         |
| `BooleanArray`                                                   | `Int8Array`               | Carries the property `$type$ == "BooleanArray"`.                                           |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | Exposes an `Array` via `KtList.asJsReadonlyArrayView` or `KtMutableList.asJsArrayView`.    |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | Exposes an ES2015 `Map` via `KtMap.asJsReadonlyMapView` or `KtMutableMap.asJsMapView`.     |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | Exposes an ES2015 `Set` via `KtSet.asJsReadonlySetView` or `KtMutableSet.asJsSetView`.     |
| `Unit`                                                           | undefined                 | Exportable when used as return type, but not when used as parameter type.                  |
| `Any`                                                            | `Object`                  |                                                                                            |
| `Throwable`                                                      | `Error`                   |                                                                                            |
| `enum class Type`                                                | `Type`                    | Enum entries are exposed as static class properties (`Type.ENTRY`).                        |
| Nullable `Type?`                                                 | `Type | null | undefined` |                                                                                            |
| All other Kotlin types, except for those marked with `@JsExport` | Not supported             | Includes Kotlin's [unsigned integer types](unsigned-integer-types.md).                     |

Additionally, it is important to know that:

* Kotlin preserves overflow semantics for `kotlin.Int`, `kotlin.Byte`, `kotlin.Short`, `kotlin.Char` and `kotlin.Long`.
* Kotlin cannot distinguish between numeric types at runtime (except for `kotlin.Long`), so the following code works:
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin preserves lazy object initialization in JavaScript.
* Kotlin does not implement lazy initialization of top-level properties in JavaScript.
