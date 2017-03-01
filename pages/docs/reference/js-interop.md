---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript Interoperability"
---

# JavaScript Interoperability

## Calling JavaScript from Kotlin

Kotlin was designed for easy interoperation with Java platform. It sees Java classes as Kotlin classes, and
Java sees Kotlin classes as Java classes. However, JavaScript is a dynamically-typed language, which means
it does not check types in compile-time. You can freely talk to JavaScript from Kotlin via 
[dynamic](dynamic-type.html) types, but if you want full power of Kotlin
type system, you can create Kotlin headers for JavaScript libraries.

Note that this document covers Kotlin 1.1 approach. Approach used by Kotlin 1.0 is deprecated and is no more supported.


### Inline JavaScript

You can inline some JavaScript code into your Kotlin code using `js("...")` function (
or, more specifically, `kotlin.js.js`).
For example:

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

Kotlin imposes one restriction on `js` function: you can only pass string constant there. So, the following
code is incorrect:

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}
fun getTypeof() = "typeof"
```


### `external` modifier

To tell Kotlin that a certain declaration is written in pure JavaScript, you should mark it with `external` modifier.
When Kotlin compiler sees such declaration it assumes that the implementation for corresponding class, function or 
property is provided by developer, and therefore does not try to generate any JavaScript code from the declaration.
This means that you should omit bodies of `external` declarations. For example:

```kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}

external val window: Window
```

Note that `external` modifier is inherited by nested declarations, i.e. in `Node` class we do not put `external`
before member functions and properties.

`external` modifier has important limitation: it is only allowed on package-level declarations. You can't
declare `external` member of non-`external` class.


### Declaring (static) members of a class

In JavaScript you can define members either on prototype or class itself. I.e.:

```javascript
function MyClass() {
}
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

There's no such syntax in Kotlin. However, in Kotlin we have `companion` objects. Kotlin treats companion objects
of `external` class in special way: instead of expecting object, it assumes members of companion objects
to be members of class itself. To describe `MyClass` from the example above, you can write:

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```


### Declaring optional parameters

External function can have optional parameters.
How JavaScript implementation actually computes default values for these parameters, is unknown to Kotlin,
thus it's impossible to use usual syntax to declare such parameters in Kotlin.
You should use the following syntax:

```kotlin
external fun myFunWithOptionalArgs(x: Int, y: String = definedExternally, z: Long = definedExternally)
```

This means you can call `myFunWithOptionalArgs` with one required argument and two optional arguments (their
default values are calculated by some JavaScript code).


### Extending JavaScript classes

You can easily extend JavaScript classes as they were Kotlin classes. Just define `external` class and
extend it by non-`external` class. For example:

```kotlin
external open class HTMLElement : Element() {
    /* members */
}

class CustomElement : HTMLElement() {
    fun foo() {
        alert("bar")
    }
}
```

There are some limitations:

1. When a function of external base class is overloaded by signature, you can't override it in a derived class.
2. You can't override function with default arguments.

Note that you can't extend non-external class by external classes.


### `external` interfaces

There's no such thing in JavaScript like interfaces. When a function expects its parameter to support `foo`
and `bar` methods, you just pass objects that actually have these methods. You can use interfaces to express this
for statically-typed Kotlin, for example:

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

Another use case for external interfaces is to describe settings objects. For example:

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) -> Unit

    // etc
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) ->
            window.alert("Request complete")
        }
    })
}
```

External interfaces have some restrictions:

1. They can't be used on right-hand-side of `is` checks.
2. `as` cast to external interface always succeeds (and produces warning in compile-time).
3. They can't be passed as reified type arguments.
4. Then can't be used in class literal expression (i.e. `I::class`).


## Calling Kotlin from JavaScript

Kotlin compiler generates normal JavaScript classes, functions and properties you can freely use from
JavaScript code. Nevertheless, there are some subtle things you should remember.


### Isolating declarations in a separate JavaScript object

To prevent spoiling global object, Kotlin creates an object that contains all other Kotlin declarations
from current module. So if you name your module as `myModule`, all declarations are available to JavaScript
via `myModule` object. For example:

```kotlin
fun foo() = "Hello"
```

Can be called from JavaScript like this:

```javascript
alert(myModule.foo());
```

This is not applicable when you compile your Kotlin module to JavaScript module. In this case there won't be
wrapper object, instead, declarations will be exposed as a JavaScript module of a corresponding kind. For example,
in case of CommonJS you should write:

```javascript
alert(require('myModule').foo());
```


### Package structure

Kotlin exposes its package structure to JavaScript, so unless you define your declarations in default package,
you have to use fully-qualified names in JavaScript. For example:

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

Can be called from JavaScript like this:

```javascript
alert(myModule.my.qualified.packagename.foo());
```


### `@JsName` annotation

In some cases (for example, to support overloads), Kotlin compiler mangles names of generated functions and attributes
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
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

If we didn't specify the `@JsName` annotation, the name of the corresponding function would contain a suffix
calculated from the function signature, for example `hello_61zpoe$`.

Note that Kotlin compiler does not apply such mangling to `external` declarations, so you don't *have to*
use `@JsName` to them. Another case worth noticing is inheriting non-external classes from external classes.
In this case any overridden functions won't be mangled as well.

`@JsName` annotation is not intended to write some JavaScript login.
Compiler will report error on any attempt to pass non-identifier string to `@JsName`.
To write some inline JavaScript code in your Kotlin code, please, use [`js("...")`](#inline-javascript) function.
The following example produces compile-time error:

```kotlin
@JsName("new C()")   // error here
external fun newC()
```


## Representing Kotlin types in JavaScript

* Kotlin numeric types, except for `kotlin.Long` are mapped to JavaScript Number.
* `kotlin.Char` is mapped to JavaScript Number representing character code.
* Kotlin can't distinguish between numeric types at run time, i.e. the following code works:

  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin preserves overflow semantics for `kotlin.Int`, `kotlin.Byte`, `kotlin.Short` and `kotlin.Char`.
* There's no 64 bit integer number in JavaScript, so `kotlin.Long` is not mapped to arbitrary JavaScript object,
  it's emulated by Kotlin class.
* `kotlin.String` is mapped to JavaScript String.
* `kotlin.Any` is mapped to JavaScript Object (i.e. `new Object()`, `{}`, etc).
* `kotlin.Array` is mapped to JavaScript Array.
* Kotlin collections (i.e. `List`, `Set`, `Map`, etc) are not mapped to any arbitrary JavaScript type.
* `kotlin.Throwable` is mapped to JavaScript Error.
* Kotlin preserves lazy object initialization in JavaScript.
* Kotlin does not implement lazy initialization of top-level properties in JavaScript.


## JavaScript Modules

Kotlin allows you to compile your Kotlin projects to JavaScript modules for popular module systems. Here is
the list of available options:

1. Plain. Don't compile for any module system. As usual, you can access module `moduleName`
   via `kotlin.modules.moduleName`, or by just `moduleName` identifier put in the global scope.
   This option is used by default.
2. [Asynchronous Module Definition (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD), which is in particular
   used by require.js library.
3. [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) convention, widely used by node.js/npm
   (`require` function and `module.exports` object)
4. Unified Module Definitions (UMD), which is compatible with both *AMD* and *CommonJS*, and works as "plain"
   when neither *AMD* nor *CommonJS* is available.

Choosing the target module system depends on your build environment:

### From IDEA

Open File -> Settings, select "Build, Execution, Deployment" -> "Compiler" -> "Kotlin compiler". Choose appropriate
module system in "Module kind" field.


### From Maven

To select module system when compiling via Maven, you should set `moduleKind` configuration property, i.e. your
`pom.xml` should look like this:

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>
    <executions>
        <execution>
            <id>compile</id>
            <goals>
                <goal>js</goal>
            </goals>
        </execution>
    </executions>
    <!-- Insert these lines -->
    <configuration>
        <moduleKind>commonjs</moduleKind>
    </configuration>
    <!-- end of inserted text -->
</plugin>
```

Available values are: `plain`, `amd`, `commonjs`, `umd`.


### From Gradle

To select module system when compiling via Gradle, you should set `moduleKind` property, i.e.

```groovy
compileKotlin2Js.kotlinOptions.moduleKind = "commonjs"
```

Available values are similar to Maven


### `@JsModule` annotation

To tell Kotlin that an `external` class, package, function or property is a JavaScript module, you can use `@JsModule`
annotation. Consider you have following CommonJS module called "hello":

```javascript
module.exports.sayHello = function(name) { alert("Hello, " + name); }
```

You should declare it like this in Kotlin:

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```


### Applying `@JsModule` to packages

Some JavaScript libraries export packages (namespaces) instead of functions and classes.
In terms of JavaScript is's an object that has members that *are* classes, functions and properties. 
Importing these packages as Kotlin objects often looks unnatural.
Compiler allows to map imported JavaScript packages to Kotlin packages, you can use following notation:
 
```kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

external class C
```

where corresponding JavaScript module declared like this:

```javascript
module.exports = {
    foo:  { /* some code here */ },
    C:  { /* some code here */ }
}
```

Important: files marked with `@file:JsModule` annotation can't declare non-external members.
Example below produces compile-time error: 

```kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```


### Importing deeper package hierarchies

In the previous example JavaScript module exports single package.
However, some JavaScript libraries export multiple packages from within a module.
This case is also supported by Kotlin, though you have to declare a new `.kt` file for each package you import.

For example, let's make our example a bit more complicated:

```javascript
module.exports = {
    mylib: {
        pkg1: {
            foo: function() { /* some code here */ },
            bar: function() { /* some code here */ }
        },
        pkg2: {
            baz: function() { /* some code here */ }
        }
    }
}
```

To import this module in Kotlin, you have two write two Kotlin source files:

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")
package extlib.pkg1

external fun foo()

external fun bar()
```

and

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")
package extlib.pkg2

external fun baz()
```

### `@JsNonModule` annotation

When a declaration has `@JsModule`, you can't use it from Kotlin code when you don't compile it to JavaScript module.
Usually, developers distribute their libraries both as JavaScript modules and downloadable `.js` files that user
can copy to project's static resources and include via `<script>` element. To tell Kotlin that it's ok
to use `@JsModule` declaration from non-module environment, you should put `@JsNonModule` declaration. For example,
given JavaScript code:

```javascript
function topLevelSayHello(name) { alert("Hello, " + name); }
if (module && module.exports) {
    module.exports.sayHello = topLevelSayHello;
}
```

can be described like this:

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```


### Notes

Kotlin is distributed with `kotlin.js` standard library as a single file, which is itself compiled as an UMD module, so
you can use it with any module system described above.

