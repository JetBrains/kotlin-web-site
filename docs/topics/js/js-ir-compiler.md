[//]: # (title: Kotlin/JS IR compiler)

> The Kotlin/JS IR compiler is in [Beta](components-stability.md). It is almost stable, but migration steps may be required
> in the future. We'll do our best to minimize any changes you have to make.
>
{type="warning"}

The Kotlin/JS IR compiler backend is the main focus of innovation around Kotlin/JS, and paves the way forward for the
technology. 

Rather than directly generating JavaScript code from Kotlin source code, the Kotlin/JS IR compiler backend leverages a
new approach. Kotlin source code is first transformed into a
[Kotlin intermediate representation (IR)](whatsnew14.md#unified-backends-and-extensibility), 
which is subsequently compiled into JavaScript. For Kotlin/JS, this enables aggressive optimizations, and allows improvements
on pain points that were present in the previous compiler, such as generated code size (through dead code elimination),
and JavaScript and TypeScript ecosystem interoperability, to name some examples.

The IR compiler backend is available starting with Kotlin 1.4.0 through the Kotlin/JS Gradle plugin. To enable it in your
project, pass a compiler type to the `js` function in your Gradle build script:

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable() // not applicable to BOTH, see details below
}
```

- `IR` uses the new IR compiler backend for Kotlin/JS.
- `LEGACY` uses the default compiler backend.
- `BOTH` compiles your project with the new IR compiler as well as the default compiler backend. Use this mode for [authoring libraries compatible with both backends](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility).

The compiler type can also be set in the `gradle.properties` file, with the key `kotlin.js.compiler=ir`.
This behaviour is overwritten by any settings in the `build.gradle(.kts)`, however.

## Ignoring compilation errors

>_Ignore compilation errors_ mode is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

Kotlin/JS IR compiler provides a new compilation mode unavailable in the default backend – _ignoring compilation errors_.
In this mode, you can try out your application even while its code contains errors.
For example, when you’re doing a complex refactoring or working on a part of the system that is completely unrelated to
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
           compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xerror-tolerance-policy=SYNTAX")
       }
   }
}
```

## Lazy initialization of top-level properties

> Lazy initialization of top-level properties is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320).
>
{type="warning"}

For better application startup performance, the Kotlin/JS IR compiler offers an option to initialize top-level properties
lazily. This way, the application loads without initializing all the top-level properties used in its code. It initializes
only the ones needed at startup; other properties receive their values later when the code that uses them actually runs. 

As an experimental feature, lazy initialization of top-level properties requires an opt-in. To use the lazy initialization
of top-level properties, add the `-Xir-property-lazy-initialization` option when compiling the code with the JS IR compiler:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<Kotlin2JsCompile> {
   kotlinOptions {
     freeCompilerArgs += "-Xir-property-lazy-initialization"
   }
}
```

</tab>
<tab title="Groovy" group-key="groovy">
    
```groovy
tasks.withType(Kotlin2JsCompile) {
   kotlinOptions {
     freeCompilerArgs += "-Xir-property-lazy-initialization"
   }
}
```

</tab>
</tabs>

## Preview: generation of TypeScript declaration files (d.ts)

> The generation of TypeScript declaration files (`d.ts`) is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D).
>
{type="warning"}

The Kotlin/JS IR compiler is capable of generating TypeScript definitions from your Kotlin code. These definitions can be
used by JavaScript tools and IDEs when working on hybrid apps to provide autocompletion, support static analyzers, and
make it easier to include Kotlin code in JavaScript and TypeScript projects.

Top-level declarations marked with [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) in a project that produces
executable files (`binaries.executable()`) will get a `.d.ts` file generated, which contains the TypeScript definitions
for the exported Kotlin declarations.
These declarations can be found in `build/js/packages/<package_name>/kotlin` alongside the corresponding
un-webpacked JavaScript code.

## Current limitations of the IR compiler

A major change with the new IR compiler backend is the **absence of binary compatibility** with the default backend.
A lack of such compatibility between the two backends for Kotlin/JS means that a library created with the new IR compiler
backend can’t be used from the default backend, and vice versa.

If you want to use the IR compiler backend for your project, you need to **update all Kotlin dependencies to versions
that support this new backend**. Libraries published by JetBrains for Kotlin 1.4+ targeting Kotlin/JS already contain all
artifacts required for usage with the new IR compiler backend.

**If you are a library author** looking to provide compatibility with the current compiler backend as well as the new IR
compiler backend, additionally check out the [section about authoring libraries for the IR compiler](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)
section.

The IR compiler backend also has some discrepancies in comparison to the default backend. When trying out the new backend,
it's good to be mindful of these possible pitfalls.

- Some **libraries that rely on specific characteristics** of the default backend, such as `kotlin-wrappers`, can display some problems. You can follow the investigation and progress [on YouTrack](https://youtrack.jetbrains.com/issue/KT-40525).
- The IR backend **does not make Kotlin declarations available to JavaScript** by default at all. To make Kotlin declarations visible to JavaScript, they **must be** annotated with [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation).

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
