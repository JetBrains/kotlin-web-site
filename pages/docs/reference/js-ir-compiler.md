---
type: doc
layout: reference
category: "JavaScript"
title: "Using the experimental IR compiler"
---
# Using the experimental Kotlin/JS IR compiler

The (currently still experimental) Kotlin/JS IR compiler backend is the main focus of innovation around Kotlin/JS paves the way forward for the technology. Its goals are to improve on pain points that the previous compiler had, in areas of developer experience, size of generated code (though dead code elimination), and to improve interoperability with the JavaScript and TypeScript ecosystem, to name just a few.

The experimental IR compiler backend is available starting with Kotlin 1.4 through the Kotlin/JS Gradle plugin. To enable it in your project, pass a compiler type to the `js` function in your Gradle build script:

<!--suppress ALL -->
<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // . . .
    }
}
```

</div>

- `IR` uses the new IR compiler backend for Kotlin/JS.
- `LEGACY` uses the default compiler backend.
- `BOTH` compiles your project with the new IR compiler as well as the default compiler backend. This is mainly useful for authoring libraries that are compatible with both backends, see below.

The compiler type can also be set in the `gradle.properties` file, with the key `kotlin.js.compiler=ir`. (This behaviour is overwritten by any settings in the `build.gradle(.kts)`, however).

## (Current) limitiations of the IR compiler

A major change with the new IR compiler backend is the absence of binary compatibility with the default backend. A lack of such compatibility between the two backends for Kotlin/JS means that a library created with the new IR compiler backend can’t be used from the default backend, and vice versa.

If you want to use the IR compiler backend for your project, you need to update all Kotlin dependencies to versions that support this new backend. Libraries published by JetBrains for Kotlin 1.4+ targeting Kotlin/JS already contain all artifacts required for usage with the new IR compiler backend.

*If you are a library author* looking to provide compatibility with the current compiler backend as well as the new IR compiler backend, additionally check out the “Authoring libraries for the IR compiler” section.

The IR compiler backend also has some discrepancies in comparison to the default backend. When trying out the new backend, it's good to be mindful of these possible pitfalls.
- Currently, the IR backend does not generate source maps for Kotlin code.
- Some libraries, that rely on specific characteristics of the default backend, such as `kotlin-wrappers`, can display some problems.
- The IR backend does not make Kotlin declarations available to JavaScript by default at all. To make Kotlin declarations visible to JavaScript, they **must be** annotated with [`@JsExport`](js-to-kotlin-interop.html#jsexport-annotation).

### Preview: Generation of TypeScript declaration files (d.ts)
The Kotlin/JS IR compiler is capable of generating TypeScript definitions from your Kotlin code. These definitions can be used by JavaScript tools and IDEs when working on hybrid apps to provide autocompletion, support static analyzers, and make it easier to include Kotlin code in JS and TS projects.
Top-level declarations marked with `@JsExport` in a project that produces executable files (`binaries.executable()`) will get a `.d.ts` file generated, which contains the TypeScript definitions for the exported Kotlin code.
In Kotlin 1.4, these declarations can be found in `build/js/packages/<package_name>/kotlin` alongside the corresponding, un-webpacked JavaScript code.

The generation of TypeScript declaration files is a feature exclusive to the IR compiler, and is in active development. If you run into any problems, please submit them to the Kotlin [issue tracker](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) or vote for submitted issues that impact you. 

## Authoring libraries for the IR compiler with backwards compatibility

If you're a library maintainer who is looking to provide compatibility with the default backend as well as the new IR compiler backend, a setting for the compiler selection is available that allows you to create artifacts for both backends, allowing you to keep compatibility for your exisiting users while providing support for the next generation of Kotlin compiler. This so-called `both`-mode can be turned on using the `kotlin.js.compiler=both` setting in your `gradle.properties` file, or can be set as one of the project-specific options inside your `js` block inside the `build.gradle(.kts)` file:

```groovy
kotlin {
    js(BOTH) {
        // . . .
    }
}
```

When in `both` mode, the IR compiler backend and default compiler backend are both used when building a library from your sources (hence the name). This means that both `klib` files with Kotlin IR as well as `js` files for the default compiler will be generated. When published under the same Maven coordinate, Gradle will automatically choose the right artifact depending on the use case – `js` for the old compiler, `klib` for the new one. This enables you to compile and publish your library for projects that are using either of the two compiler backends.
