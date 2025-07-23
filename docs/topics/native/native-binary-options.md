[//]: # (title: Kotlin/Native binary options)

This page lists helpful Kotlin/Native binary options that you can use to configure Kotlin/Native projects and the ways
to set them up in your project.

## How to enable

You can enable binary options in the `gradle.properties` file, your build file, or pass them as compiler arguments.

### In Gradle properties

You can set binary options in your project's `gradle.properties` file using `kotlin.native.binary`, for example:

```none
kotlin.native.binary.gc=cms
kotlin.native.binary.latin1Strings=true
```

### In your build file

You can set binary options for your project in your `build.gradle.kts` file:

* For specific binaries using the `binaryOption` attribute, for example:

  ```kotlin
  kotlin {
      iosX64("ios") {
          binaries {
              executable {
                  binaryOption("smallBinary", "true")
              }
          }
      }
  }
  ```

* As `-Xbinary=$option=$value` compiler options in the `freeCompilerArgs` attribute, for example:

  ```kotlin
  kotlin {
      iosX64("ios") {
          compilations.configureEach {
              compilerOptions.configure {
                  freeCompilerArgs.add("-Xbinary=smallBinary=true")
              }
          }
      }
  }
  ```

### In the command-line compiler

You can pass binary options as `-Xbinary=$option=$value` directly in the command line when executing the [Kotlin/Native compiler](native-get-started.md#using-the-command-line-compiler),
for example:

```bash
kotlinc-native main.kt -Xbinary=enableSafepointSignposts=true tracking-pauses
```

## Binary options

| Option                                                                                          | Values                                                                                                                                                                         | Description                                                                                                                                                                                               | Status                                                   |
|-------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| [`smallBinary`](whatsnew-eap.md#smaller-binary-size-for-ios-targets)                            | <list><li>`true`</li><li>`false` (default)</li></list>                                                                                                                         | Decreases the binary size for iOS targets.                                                                                                                                                                | Experimental since 2.2.20                                |
| [`stackProtector`](whatsnew-eap.md#support-for-stack-canaries-in-binaries)                      | <list><li>`yes`</li><li>`strong`</li><li>`all`</li><li>`no` (default)</li></list>                                                                                              | Enables stack canaries: use `yes` for vulnerable functions, `all` for all functions, and `strong` to utilize stronger heuristic.                                                                          | Available since 2.2.20                                   |
| [`pagedAllocator`](native-memory-manager.md#disable-allocator-paging)                           | <list><li>`true` (default)</li><li>`false`</li></list>                                                                                                                         | Controls paging of allocations (buffering). When `false`, the memory allocator reserves memory on a per-object basis.                                                                                     | Experimental since 2.2.0                                 |
| [`latin1Strings`](native-memory-manager.md#enable-support-for-latin-1-strings)                  | <list><li>`true`</li><li>`false` (default)</li></list>                                                                                                                         | Controls support for Latin-1-encoded strings to reduce application binary size and adjust memory consumption.                                                                                             | Experimental since 2.2.0                                 |
| [`mmapTag`](native-memory-manager.md#track-memory-consumption-on-apple-platforms)               | `UInt`                                                                                                                                                                         | Controls memory tagging, necessary for memory consumption tracking on Apple platforms. Values `240`-`255` are available (default is `246`); `0` disables tagging                                          | Available since 2.2.0                                    |
| `disableMmap`                                                                                   | <list><li>`true`</li><li>`false` (default)</li></list>                                                                                                                         | Controls the default allocator. When `true`, uses the `malloc` memory allocator instead of `mmap`.                                                                                                        | Available since 2.2.0                                    |
| `gc`                                                                                            | <list><li>[`cms`](native-memory-manager.md#optimize-gc-performance)</li><li>[`noop`](native-memory-manager.md#disable-garbage-collection)</li><li>`stms` (default)</li></list> | Controls garbage collection behavior: `cms` enables concurrent marking to decrease GC pause time, `noop` disables garbage collection.                                                                     | `cms` is Experimental since 2.0.20                       |
| [`gcMarkSingleThreaded`](native-memory-manager.md#garbage-collector)                            | <list><li>`true`</li><li>`false` (default)</li></list>                                                                                                                         | Disables parallelization of the mark phase in garbage collection. May increase GC pause time on large heaps.                                                                                              | Available since 1.7.20                                   |
| [`enableSafepointSignposts`](native-memory-manager.md#monitor-gc-performance)                   | <list><li>`true`</li><li>`false` (default)</li></list>                                                                                                                         | Enables tracking GC-related pauses in the project for debugging in Xcode Instruments.                                                                                                                     | Available since 2.0.20                                   |
| `preCodegenInlineThreshold`                                                                     | `UInt`                                                                                                                                                                         | Configures the inlining optimization pass, which comes before the actual code generation phase. The recommended number of tokens is 40.                                                                   | Experimental since 2.1.20                                |
| [`objcDisposeOnMain`](native-arc-integration.md#deinitializers)                                 | <list><li>`true` (default)</li><li>`false`</li></list>                                                                                                                         | Controls deinitialization of Swift/Objective-C objects. When `false`, deinitialization happens on a special GC thread instead of the main one.                                                            | Available since 1.9.0                                    |
| [`appStateTracking`](native-arc-integration.md#support-for-background-state-and-app-extensions) | <list><li>`enabled`</li><li>`disabled` (default)</li></list>                                                                                                                   | Controls timer-based invocation of the garbage collector. When `enabled`, GC is called only when memory consumption becomes too high.                                                                     | Experimental since 1.7.20                                |
| `bundleId`                                                                                      | <list><li>`String`</li></list>                                                                                                                                                 | Sets bundle ID (`CFBundleIdentifier`) in the `Info.plst` file.                                                                                                                                            | Available since 1.7.20                                   |
| `bundleShortVersionString`                                                                      | <list><li>`String`</li></list>                                                                                                                                                 | Sets short bundle version (`CFBundleShortVersionString`) in the `Info.plst` file.                                                                                                                         | Available since 1.7.20                                   |
| `bundleVersion`                                                                                 | <list><li>`String`</li></list>                                                                                                                                                 | Sets bundle version (`CFBundleVersion`) in the `Info.plst` file.                                                                                                                                          | Available since 1.7.20                                   |
| `sourceInfoType`                                                                                | <list><li>`libbacktrace`</li><li>`coresymbolication`</li><li>`noop` (default)</li></list>                                                                                      | Controls stack trace generation. `libbacktrace` enables better stack traces with file locations and line numbers.                                                                                         | Experimental since 1.6.20                                |
| `memoryModel`                                                                                   | <list><li>`experimental` (default)</li><li>`relaxed`</li><li>`strict`</li></list>                                                                                              | Controls the memory manager behavior.                                                                                                                                                                     | The experimental mode is enabled by default since 1.7.20 |
| `unitSuspendFunctionObjCExport`                                                                 | <list><li>`proper` (default)</li><li>`legacy`</li></list>                                                                                                                      | Controls how Unit-returning suspend functions are presented in Swift. When set to `proper`, such functions are translated to `async` Swift functions with the `Void` return type instead of `KotlinUnit`. | Enabled by default in 1.7.0                              |
| `objcExportSuspendFunctionLaunchThreadRestriction`                                              | <list><li>`none` (default)</li><li>`main`</li></list>                                                                                                                          | Controls the restriction on calling Kotlin suspend functions from Swift/Objective-C from threads other than the main one.                                                                                 | Enabled by default in 2.0.20                             |

> For more information on stability levels, see the [documentation](components-stability.md#stability-levels-explained).
>
{style="tip"}