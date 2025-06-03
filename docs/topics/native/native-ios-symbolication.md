[//]: # (title: Symbolicating iOS crash reports)

Debugging an iOS application crash sometimes involves analyzing crash reports in detail.

Crash reports typically require symbolication, the process of translating memory addresses into readable source code
locations. This guide describes how to symbolicate crash reports for iOS applications built with Kotlin/Native.

## Get `.dSYM` files for Kotlin binaries

To symbolicate addresses in Kotlin code (for example, for stack trace elements corresponding to Kotlin code), you need a
special debug symbol (`.dSYM`) file. This file maps memory addresses in crash reports with actual locations in the
source code, such as functions or line numbers.

The Kotlin/Native compiler generates `.dSYM` files for release (optimized) binaries on Apple platforms by default.
On other platforms, you need to explicitly enable it using the `-Xadd-light-debug` compiler option:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions{
        freeCompilerArgs.add("-Xadd-light-debug=enable")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions{
            freeCompilerArgs.add("-Xadd-light-debug=enable")
        }
    }
}
```

</tab>
</tabs>

When building in Xcode, the IDE looks for `.dSYM` files in standard locations and uses them automatically for
symbolication. Xcode automatically detects `.dSYM` files in projects created from IntelliJ IDEA templates.

For more information about crash reports, see the [Apple documentation](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs).
