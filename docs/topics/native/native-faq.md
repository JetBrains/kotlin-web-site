[//]: # (title: Kotlin/Native FAQ)

## How do I run my program?

Define a top-level function `fun main(args: Array<String>)` or just  `fun main()` if you are not interested
in passed arguments, please ensure it's not in a package.
Also compiler switch `-entry` could be used to make any function taking `Array<String>` or no arguments
and return `Unit` as an entry point.

## What is Kotlin/Native memory management model?

Kotlin/Native provides an automated memory management scheme, similar to what Java or Swift provides.
The current implementation includes an automated reference counter with a cycle collector to collect cyclical
garbage.

## How do I create a shared library?

Use the `-produce dynamic` compiler switch, or `binaries.sharedLib()` in Gradle.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

It will produce a platform-specific shared object (`.so` on Linux, `.dylib` on macOS, and `.dll` on Windows targets) and a
C language header, allowing the use of all public APIs available in your Kotlin/Native program from C/C++ code.
See [this example](https://github.com/JetBrains/kotlin-native/tree/master/samples/python_extension) of using such a
shared object to provide a bridge between Python and Kotlin/Native.

## How do I create a static library or an object file?

Use the `-produce static` compiler switch, or `binaries.staticLib()` in Gradle.

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

It will produce a platform-specific static object (`.a` library format) and a C language header, allowing you to
use all the public APIs available in your Kotlin/Native program from C/C++ code.

## How do I run Kotlin/Native behind a corporate proxy?

As Kotlin/Native needs to download a platform specific toolchain, you need to specify
`-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` as the compiler's or `gradlew` arguments,
or set it via the `JAVA_OPTS` environment variable.

## How do I specify a custom Objective-C prefix/name for my Kotlin framework?

Use the `-module-name` compiler option or matching Gradle DSL statement.

<tabs>

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</tabs>

## How do I rename the iOS framework?

The default name is for an iOS framework  is `<project name>.framework`.
To set a custom name, use the `baseName` option. This will also set the module name.

```kotlin
kotlin {
    iosArm64("myapp") {
       binaries {
          framework {
              baseName = "TheName"
          }
       }
    }
}
```

## How do I enable bitcode for my Kotlin framework?

By default gradle plugin adds it on iOS target.
 * For debug build it embeds placeholder LLVM IR data as a marker.
 * For release build it embeds bitcode as data.

Or commandline arguments: `-Xembed-bitcode` (for release) and `-Xembed-bitcode-marker` (debug)

Setting this in a Gradle DSL: 

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries {
            framework {
                // Use "marker" to embed the bitcode marker (for debug builds).
                // Use "disable" to disable embedding.
                embedBitcode("bitcode") // for release binaries.
            }
        }
    }
}
```

These options have nearly the same effect as clang's `-fembed-bitcode`/`-fembed-bitcode-marker`
and swiftc's `-embed-bitcode`/`-embed-bitcode-marker`.

## Why do I see `InvalidMutabilityException`?

It likely happens, because you are trying to mutate a frozen object. An object can transfer to the
frozen state either explicitly, as objects reachable from objects on which the `kotlin.native.concurrent.freeze` is called,
or implicitly (i.e. reachable from `enum` or global singleton object - see the next question).

## How do I make a singleton object mutable?

Currently, singleton objects are immutable (i.e. frozen after creation), and it's generally considered
good practise to have the global state immutable. If for some reason you need a mutable state inside such an
object, use the `@konan.ThreadLocal` annotation on the object. Also the `kotlin.native.concurrent.AtomicReference` class could be
used to store different pointers to frozen objects in a frozen object and automatically update them.

## How can I compile my project against the Kotlin/Native master?

One of the following should be done:

For the CLI, you can compile using gradle as stated in the README (and if you get errors, you can try to do a <code>./gradlew clean</code>)

```bash
./gradlew dependencies:update
./gradlew dist distPlatformLibs
```

You can then set the `KONAN_HOME` env variable to the generated `dist` folder in the git repository.

For Gradle, you can use <a href="https://docs.gradle.org/current/userguide/composite_builds.html">Gradle composite builds</a> like this:

```bash
# Set with the path of your kotlin-native clone
export KONAN_REPO=$PWD/../kotlin-native

# Run this once since it is costly, you can remove the `clean` task if not big changes were made from the last time you did this
pushd $KONAN_REPO && git pull && ./gradlew clean dependencies:update dist distPlatformLibs && popd

# In your project, you set have to the org.jetbrains.kotlin.native.home property, and include as composite the shared and gradle-plugin builds
./gradlew check -Porg.jetbrains.kotlin.native.home=$KONAN_REPO/dist --include-build $KONAN_REPO/shared --include-build $KONAN_REPO/tools/kotlin-native-gradle-plugin
```
