[//]: # (title: Kotlin/JS IR compiler)

The Kotlin/JS IR compiler backend is the main focus of innovation around Kotlin/JS, and paves the way forward for the
technology. 

Rather than directly generating JavaScript code from Kotlin source code, the Kotlin/JS IR compiler backend leverages a
new approach. Kotlin source code is first transformed into a
[Kotlin intermediate representation (IR)](whatsnew14.md#unified-backends-and-extensibility), 
which is subsequently compiled into JavaScript. For Kotlin/JS, this enables aggressive optimizations, and allows improvements
on pain points that were present in the previous compiler, such as generated code size (through dead code elimination),
and JavaScript and TypeScript ecosystem interoperability, to name some examples.

The IR compiler backend is available starting with Kotlin 1.4.0 through the Kotlin Multiplatform Gradle plugin. To enable it in your
project, pass a compiler type to the `js` function in your Gradle build script:

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
        binaries.executable() // not applicable to BOTH, see details below
    }
}
```

* `IR` uses the new IR compiler backend for Kotlin/JS.
* `LEGACY` uses the old compiler backend.
* `BOTH` compiles your project with the new IR compiler as well as the default compiler backend. Use this mode for [authoring libraries compatible with both backends](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility).

> The old compiler backend has been deprecated since Kotlin 1.8.0. Starting with Kotlin 1.9.0, using compiler types `LEGACY` or `BOTH` leads to an error.
>
{type="warning"}

The compiler type can also be set in the `gradle.properties` file, with the key `kotlin.js.compiler=ir`.
This behaviour is overwritten by any settings in the `build.gradle(.kts)`, however.

## Lazy initialization of top-level properties

For better application startup performance, the Kotlin/JS IR compiler initializes top-level properties lazily. This way,
the application loads without initializing all the top-level properties used in its code. It initializes
only the ones needed at startup; other properties receive their values later when the code that uses them actually runs.

```kotlin
val a = run { 
    val result = // intensive computations
    println(result)
    result 
} // value is computed upon the first usage
```

If for some reason you need to initialize a property eagerly (upon the application start), mark it with the 
[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} annotation.

## Incremental compilation for development binaries

The JS IR compiler provides the _incremental compilation mode for development binaries_ that speeds up the development process.
In this mode, the compiler caches the results of `compileDevelopmentExecutableKotlinJs` Gradle task on the module level.
It uses the cached compilation results for unchanged source files during subsequent compilations, making them complete faster,
especially with small changes.

Incremental compilation is enabled by default. To disable incremental compilation for development binaries, add the following line to the project's `gradle.properties`
or `local.properties`:

```none
kotlin.incremental.js.ir=false // true by default
```

> The clean build in the incremental compilation mode is usually slower because of the need to create and populate the caches.
>
{type="note"}

## Output .js files: one per module or one for the whole project

As a compilation result, the JS IR compiler outputs separate `.js` files for each module of a project. 
Alternatively, you can compile the whole project into a single `.js` file by adding the following line to `gradle.properties`:

```none
kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
```

## Ignoring compilation errors

> _Ignore compilation errors_ mode is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

Kotlin/JS IR compiler provides a new compilation mode unavailable in the default backend – _ignoring compilation errors_.
In this mode, you can try out your application even while its code contains errors.
For example, when you're doing a complex refactoring or working on a part of the system that is completely unrelated to
a compilation error in another part.

With this new compiler mode, the compiler ignores all broken code. Thus, you can run the application and try its parts
that don't use the broken code. If you try to run the code that was broken during compilation, you'll get a
runtime exception.

Choose between two tolerance policies for ignoring compilation errors in your code:
- `SEMANTIC`. The compiler will accept code that is syntactically correct but doesn't make sense semantically.
  For example, assigning a number to a string variable (type mismatch).
- `SYNTAX`. The compiler will accept any code, even if it contains syntax errors. Regardless of what you write, the
  compiler will still try to generate a runnable executable.

As an experimental feature, ignoring compilation errors requires an opt-in.
To enable this mode, add the `-Xerror-tolerance-policy={SEMANTIC|SYNTAX}` compiler option:

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xerror-tolerance-policy=SYNTAX")
            }
        }
    }
}
```

## Minification of member names in production

The Kotlin/JS IR compiler uses its internal information about the relationships of your Kotlin classes and functions to apply more efficient minification, shortening the names of functions, properties, and classes. This reduces the size of resulting bundled applications.

This type of minification is automatically applied when you build your Kotlin/JS application in [production](js-project-setup.md#building-executables) mode, and enabled by default. To disable member name minification, use the `-Xir-minimized-member-names` compiler option:

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## Preview: generation of TypeScript declaration files (d.ts)

> The generation of TypeScript declaration files (`d.ts`) is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D).
>
{type="warning"}

The Kotlin/JS IR compiler is capable of generating TypeScript definitions from your Kotlin code. These definitions can be
used by JavaScript tools and IDEs when working on hybrid apps to provide autocompletion, support static analyzers, and
make it easier to include Kotlin code in JavaScript and TypeScript projects.

If your project produces executable files (`binaries.executable()`), the Kotlin/JS IR compiler collects 
any top-level declarations marked with [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) and automatically 
generates TypeScript definitions in a `.d.ts` file.

If you want to generate TypeScript definitions, you have to explicitly configure this in your Gradle build file. 
Add `generateTypeScriptDefinitions()` to your `build.gradle.kts` file in the [`js` section](js-project-setup.md#execution-environments). 
For example:

```kotlin
kotlin {
   js {
       binaries.executable()
       browser {
       }
       generateTypeScriptDefinitions()
   }
}
```

The definitions can be found in `build/js/packages/<package_name>/kotlin` alongside the corresponding
un-webpacked JavaScript code.

## Current limitations of the IR compiler

A major change with the new IR compiler backend is the **absence of binary compatibility** with the default backend.
A library created with the new IR compiler uses a [`klib` format](native-libraries.md#library-format) and can't be used 
from the default backend. In the meantime, a library created with the old compiler is a `jar` with `js` files, which 
can't be used from the IR backend.

If you want to use the IR compiler backend for your project, you need to **update all Kotlin dependencies to versions
that support this new backend**. Libraries published by JetBrains for Kotlin 1.4+ targeting Kotlin/JS already contain all
artifacts required for usage with the new IR compiler backend.

**If you are a library author** looking to provide compatibility with the current compiler backend as well as the new IR
compiler backend, additionally check out the [section about authoring libraries for the IR compiler](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)
section.

The IR compiler backend also has some discrepancies in comparison to the default backend. When trying out the new backend,
it's good to be mindful of these possible pitfalls.

* Some **libraries that rely on specific characteristics** of the default backend, such as `kotlin-wrappers`, can display some problems. You can follow the investigation and progress [on YouTrack](https://youtrack.jetbrains.com/issue/KT-40525).
* The IR backend **does not make Kotlin declarations available to JavaScript** by default at all. To make Kotlin declarations visible to JavaScript, they **must be** annotated with [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation).

## Migrating existing projects to the IR compiler

Due to significant differences between the two Kotlin/JS compilers, making your Kotlin/JS code work with the IR compiler
may require some adjustments. Learn how to migrate existing Kotlin/JS projects to the IR compiler in the [Kotlin/JS IR
compiler migration guide](js-ir-migration.md).

## Authoring libraries for the IR compiler with backwards compatibility

If you're a library maintainer who is looking to provide compatibility with the default backend as well as the new IR
compiler backend, a setting for the compiler selection is available that allows you to create artifacts for both backends,
allowing you to keep compatibility for your existing users while providing support for the next generation of Kotlin compiler.
This so-called `both`-mode can be turned on using the `kotlin.js.compiler=both` setting in your `gradle.properties` file,
or can be set as one of the project-specific options inside your `js` block inside the `build.gradle(.kts)` file:

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

When in `both` mode, the IR compiler backend and default compiler backend are both used when building a library from your
sources (hence the name). This means that both `klib` files with Kotlin IR as well as `jar` files for the default compiler
will be generated. When published under the same Maven coordinate, Gradle will automatically choose the right artifact
depending on the use case – `js` for the old compiler, `klib` for the new one. This enables you to compile and publish
your library for projects that are using either of the two compiler backends.
