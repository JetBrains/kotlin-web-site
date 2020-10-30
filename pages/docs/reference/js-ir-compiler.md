---
type: doc
layout: reference
category: "JavaScript"
title: "Using the IR compiler"
---
# Using the Kotlin/JS IR compiler

> As of Kotlin 1.4.0, the Kotlin/JS IR compiler has _[Alpha](evolution/components-stability.html)_ stability level. You are welcome to use the IR compiler backend, but all of the functionality, language and tooling features described in this document are subject to change in future Kotlin versions.
{:.note}

The Kotlin/JS IR compiler backend is the main focus of innovation around Kotlin/JS, and paves the way forward for the technology. 

Rather than directly generating JavaScript code from Kotlin source code, the Kotlin/JS IR compiler backend leverages a new approach. Kotlin source code is first transformed into a [Kotlin intermediate representation (IR)](whatsnew14.html#unified-backends-and-extensibility), which is subsequently compiled into JavaScript. For Kotlin/JS, this enables aggressive optimizations, and allows improvements on pain points that were present in the previous compiler, such as generated code size (through dead code elimination), and JavaScript and TypeScript ecosystem interoperability, to name some examples.

The IR compiler backend is available starting with Kotlin 1.4.0 through the Kotlin/JS Gradle plugin. To enable it in your project, pass a compiler type to the `js` function in your Gradle build script:

<!--suppress ALL -->
<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // . . .
        binaries.executable()
    }
}
```

</div>

- `IR` uses the new IR compiler backend for Kotlin/JS.
- `LEGACY` uses the default compiler backend.
- `BOTH` compiles your project with the new IR compiler as well as the default compiler backend. This is mainly useful for authoring libraries that are compatible with both backends, see [below](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility).

The compiler type can also be set in the `gradle.properties` file, with the key `kotlin.js.compiler=ir`. (This behaviour is overwritten by any settings in the `build.gradle(.kts)`, however).

## Current limitations of the IR compiler

A major change with the new IR compiler backend is the **absence of binary compatibility** with the default backend. A lack of such compatibility between the two backends for Kotlin/JS means that a library created with the new IR compiler backend can’t be used from the default backend, and vice versa.

If you want to use the IR compiler backend for your project, you need to **update all Kotlin dependencies to versions that support this new backend**. Libraries published by JetBrains for Kotlin 1.4+ targeting Kotlin/JS already contain all artifacts required for usage with the new IR compiler backend.

**If you are a library author** looking to provide compatibility with the current compiler backend as well as the new IR compiler backend, additionally check out the [“Authoring libraries for the IR compiler”](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility) section.

The IR compiler backend also has some discrepancies in comparison to the default backend. When trying out the new backend, it's good to be mindful of these possible pitfalls.
- Currently, the IR backend **does not generate source maps for Kotlin code**. You can follow the progress [on YouTrack](https://youtrack.jetbrains.com/issue/KT-39447).
- Some **libraries that rely on specific characteristics** of the default backend, such as `kotlin-wrappers`, can display some problems. You can follow the investigation and progress [on YouTrack](https://youtrack.jetbrains.com/issue/KT-40525).
- The IR backend **does not make Kotlin declarations available to JavaScript** by default at all. To make Kotlin declarations visible to JavaScript, they **must be** annotated with [`@JsExport`](js-to-kotlin-interop.html#jsexport-annotation).

## Preview: Generation of TypeScript declaration files (d.ts)
The Kotlin/JS IR compiler is capable of generating TypeScript definitions from your Kotlin code. These definitions can be used by JavaScript tools and IDEs when working on hybrid apps to provide autocompletion, support static analyzers, and make it easier to include Kotlin code in JavaScript and TypeScript projects.
Top-level declarations marked with [`@JsExport`](js-to-kotlin-interop.html#jsexport-annotation) in a project that produces executable files (`binaries.executable()`) will get a `.d.ts` file generated, which contains the TypeScript definitions for the exported Kotlin declarations.
In Kotlin 1.4, these declarations can be found in `build/js/packages/<package_name>/kotlin` alongside the corresponding, un-webpacked JavaScript code.

The generation of TypeScript declaration files is a feature exclusive to the IR compiler, and is in active development. If you run into any problems, please submit them to the Kotlin [issue tracker](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) or vote for submitted issues that impact you. 

## Authoring libraries for the IR compiler with backwards compatibility

If you're a library maintainer who is looking to provide compatibility with the default backend as well as the new IR compiler backend, a setting for the compiler selection is available that allows you to create artifacts for both backends, allowing you to keep compatibility for your existing users while providing support for the next generation of Kotlin compiler. This so-called `both`-mode can be turned on using the `kotlin.js.compiler=both` setting in your `gradle.properties` file, or can be set as one of the project-specific options inside your `js` block inside the `build.gradle(.kts)` file:

```groovy
kotlin {
    js(BOTH) {
        // . . .
    }
}
```

When in `both` mode, the IR compiler backend and default compiler backend are both used when building a library from your sources (hence the name). This means that both `klib` files with Kotlin IR as well as `jar` files for the default compiler will be generated. When published under the same Maven coordinate, Gradle will automatically choose the right artifact depending on the use case – `js` for the old compiler, `klib` for the new one. This enables you to compile and publish your library for projects that are using either of the two compiler backends.
