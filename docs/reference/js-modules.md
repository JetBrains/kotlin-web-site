---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript Modules"
---

# JavaScript Modules

Since Kotlin version 1.0.4 you can compile your Kotlin projects to JS modules for popular module systems. Here is
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

## From IDEA

Open File -> Settings, select "Build, Execution, Deployment" -> "Compiler" -> "Kotlin compiler". Choose appropriate
module system in "Module kind" field.


## From Maven

To select module system when compiling via Maven, you should set `moduleKind` configuration property, i.e. your
`pom.xml` should look like this:

``` xml
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


## From Gradle

To select module system when compiling via Gradle, you should set `moduleKind` property, i.e.

    compileKotlin2Js.kotlinOptions.moduleKind = "commonjs"

Available values are similar to Maven


## Notes

We ship `kotlin.js` standard library as a single file, which is itself compiled as an UMD module, so
you can use it with any module system described above.

Although for now we don't support WebPack and Browserify directly, we tested `.js` files produced by Kotlin
compiler with WebPack and Browserify, so Kotlin should work with these tools properly.
