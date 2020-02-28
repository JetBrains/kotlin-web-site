---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript Modules"
---

# JavaScript Modules

Kotlin allows you to compile your Kotlin projects to JavaScript modules for popular module systems. Here is
the list of available options:

1. Plain. Don't compile for any module system. As usual, you can access a module by its name in the global scope.
   This option is used by default.
2. [Asynchronous Module Definition (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD), which is in particular
   used by require.js library.
3. [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) convention, widely used by node.js/npm
   (`require` function and `module.exports` object)
4. Unified Module Definitions (UMD), which is compatible with both *AMD* and *CommonJS*, and works as "plain"
   when neither *AMD* nor *CommonJS* is available at runtime.

## Targeting the browser
 
If you're targeting the browser, you can specify the desired module type in the `webpackTask` configuration block:
 
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackOutput.Target.COMMONJS

kotlin {
    target {
        browser {
            webpackTask {
                output.libraryTarget = COMMONJS 
                //output.libraryTarget = "commonjs" // alternative
             }
        }
    }
}

```

</div>
  
This way, you'll get a single JS file with all dependencies included.

## Creating libraries and node.js files

If you're creating a JS library or a node.js file, define the module kind as described below.

### Choosing the target module system

To select module kind, set the `moduleKind` compiler option in the Gradle build script.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
compileKotlinJs.kotlinOptions.moduleKind = "commonjs"

```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.named("compileKotlinJs") {
    this as KotlinJsCompile
    kotlinOptions.moduleKind = "commonjs"
}
```

</div>
</div>

Available values are: `plain`, `amd`, `commonjs`, `umd`.

In Kotlin Gradle DSL, there is also a shortcut for setting the CommonJS module kind:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```
kotlin {
    target {
         useCommonJs()
    }
}
```
</div>

## `@JsModule` annotation

To tell Kotlin that an `external` class, package, function or property is a JavaScript module, you can use `@JsModule`
annotation. Consider you have the following CommonJS module called "hello":

<div class="sample" markdown="1" theme="idea" mode="java">

``` javascript
module.exports.sayHello = function(name) { alert("Hello, " + name); }
```

</div>

You should declare it like this in Kotlin:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

</div>


### Applying `@JsModule` to packages

Some JavaScript libraries export packages (namespaces) instead of functions and classes.
In terms of JavaScript, it's an object that has members that *are* classes, functions and properties.
Importing these packages as Kotlin objects often looks unnatural.
The compiler allows to map imported JavaScript packages to Kotlin packages, using the following notation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

external class C
```

</div>

where the corresponding JavaScript module is declared like this:

<div class="sample" markdown="1" theme="idea" mode="js">

``` javascript
module.exports = {
    foo:  { /* some code here */ },
    C:  { /* some code here */ }
}
```

</div>

Important: files marked with `@file:JsModule` annotation can't declare non-external members.
The example below produces compile-time error:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```

</div>

### Importing deeper package hierarchies

In the previous example the JavaScript module exports a single package.
However, some JavaScript libraries export multiple packages from within a module.
This case is also supported by Kotlin, though you have to declare a new `.kt` file for each package you import.

For example, let's make our example a bit more complicated:

<div class="sample" markdown="1" theme="idea" mode="js">

``` javascript
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

</div>

To import this module in Kotlin, you have to write two Kotlin source files:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")
package extlib.pkg1

external fun foo()

external fun bar()
```
</div>

and

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")
package extlib.pkg2

external fun baz()
```

</div>

### `@JsNonModule` annotation

When a declaration has `@JsModule`, you can't use it from Kotlin code when you don't compile it to a JavaScript module.
Usually, developers distribute their libraries both as JavaScript modules and downloadable `.js` files that you
can copy to project's static resources and include via `<script>` element. To tell Kotlin that it's ok
to use a `@JsModule` declaration from non-module environment, you should put `@JsNonModule` declaration. For example,
given JavaScript code:

<div class="sample" markdown="1" theme="idea" mode="js">

``` javascript
function topLevelSayHello(name) { alert("Hello, " + name); }
if (module && module.exports) {
    module.exports = topLevelSayHello;
}
```

</div>

can be described like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

</div>


### Notes

Kotlin is distributed with `kotlin.js` standard library as a single file, which is itself compiled as an UMD module, so
you can use it with any module system described above. It is available on NPM as [`kotlin` package](https://www.npmjs.com/package/kotlin)


