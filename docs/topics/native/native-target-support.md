[//]: # (title: Kotlin/Native supported targets and hosts)

This document describes which targets and hosts are supported by the Kotlin/Native compiler.

> We can adjust the list of supported targets and hosts, the number of tiers, and their features as we go.
>
{style="tip"}

## Target tiers

The Kotlin/Native compiler supports a number of different targets, though it's hard to provide the same level of
support for all of them. That's why targets are broken into several tiers depending on how well the compiler supports them.

Mind the following terms used in tier tables:

* **Gradle target name** is a [target name](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) that is used in the
    Kotlin Multiplatform Gradle plugin to enable the target.
* **Target triple** is a target name according to the `<architecture>-<vendor>-<system>-<abi>` structure that is commonly
  used by [compilers](https://clang.llvm.org/docs/CrossCompilation.html#target-triple).
* **Running tests** indicates out-of-the-box support for running tests in Gradle and IDE.
  
  This is only available on a native host for the specific target. For example, you can run `macosX64` and `iosX64` tests
  only on the macOS x86-64 host.

### Tier 1

* The target is regularly tested on CI to be able to compile and run.
* We provide a source and [binary compatibility between compiler releases](https://youtrack.jetbrains.com/issue/KT-42293).

| Gradle target name      | Target triple                 | Running tests | Description                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| Apple macOS hosts only: |                               |               |                                                |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple macOS on Apple Silicon platforms         |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple iOS simulator on Apple Silicon platforms |
| `iosArm64`              | `aarch64-apple-ios`           |               | Apple iOS and iPadOS on ARM64 platforms        |

### Tier 2

* The target is regularly tested on CI to be able to compile but may not be automatically tested to be able to run.
* We're doing our best to provide source and [binary compatibility between compiler releases](https://youtrack.jetbrains.com/issue/KT-42293).

| Gradle target name      | Target triple                     | Running tests | Description                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | Linux on x86_64 platforms                          |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | Linux on ARM64 platforms                           |
| Apple macOS hosts only: |                                   |               |                                                    |
| `macosX64`              | `x86_64-apple-macos`              | ✅             | Apple macOS on x86_64 platforms                    |
| `iosX64`                | `x86_64-apple-ios-simulator`      | ✅             | Apple iOS simulator on x86-64 platforms            |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple watchOS simulator on Apple Silicon platforms |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | Apple watchOS 64-bit simulator on x86_64 platforms |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | Apple watchOS on ARM32 platforms                   |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | Apple watchOS on ARM64 platforms with ILP32        |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple tvOS simulator on Apple Silicon platforms    |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | Apple tvOS simulator on x86_64 platforms           |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | Apple tvOS on ARM64 platforms                      |

### Tier 3

* The target is not guaranteed to be tested on CI.
* We can't promise a source and binary compatibility between different compiler releases, though such changes for these
  targets are quite rare.

| Gradle target name      | Target triple                   | Running tests | Description                                                                              |
|-------------------------|---------------------------------|---------------|------------------------------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | [Android NDK](https://developer.android.com/ndk) on ARM32 platforms                      |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | [Android NDK](https://developer.android.com/ndk) on ARM64 platforms                      |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | [Android NDK](https://developer.android.com/ndk) on x86_64 platforms                     |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | [Android NDK](https://developer.android.com/ndk) on x86_64 platforms                     |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | 64-bit Windows 10 and later using [MinGW](https://www.mingw-w64.org) compatibility layer |
| Apple macOS hosts only: |                                 |               |                                                                                          |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | Apple watchOS on ARM64 platforms                                                         |

> The `linuxArm32Hfp` target is deprecated and will be removed in future releases.
> 
{style="note"}

### For library authors

We don't recommend library authors to test more targets or provide stricter guarantees than the Kotlin/Native compiler
does. You can use the following approach when considering support for native targets:

* Support all the targets from tiers 1, 2, and 3.
* Regularly test targets from tiers 1 and 2 that support running tests out of the box.

The Kotlin team uses this approach in the official Kotlin libraries, for example, [kotlinx.coroutines](coroutines-guide.md) and [kotlinx.serialization](serialization.md).

## Hosts

The Kotlin/Native compiler supports the following hosts:

| Host OS                   | Architecture     | Target compilation                             | `.klib` production                                                     |
|---------------------------|------------------|------------------------------------------------|------------------------------------------------------------------------|
| macOS (Apple Silicon)     | ARM64 platforms  | Any supported target                           | Any supported target                                                   |
| macOS (Intel chips)       | x86_64 platforms | Any supported target                           | Any supported target                                                   |
| Linux                     | x86_64 platforms | Any supported target, except for Apple targets | Any supported target, Apple targets only without cinterop dependencies | 
| Windows (MinGW toolchain) | x86_64 platforms | Any supported target, except for Apple targets | Any supported target, Apple targets only without cinterop dependencies | 

* To produce final binaries, you can only compile supported [Kotlin/Native targets](#target-tiers) on supported hosts.

  For example, target compilation is not possible on the FreeBSD OS or on a Linux machine running on the ARM64 architecture.

  Compilation for Apple targets on Linux and Windows is also not possible.

* Generally, Kotlin/Native supports cross-compilation, allowing any supported host to produce the `.klib` artifacts.

  However, artifact production for Apple targets still has some limitations on Linux and Windows. If your project
  uses [cinterop dependencies](native-c-interop.md) (including [CocoaPods](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)),
  you must use a macOS host.
  
  For example, it's possible to produce a `.klib` for `macosArm64` target on a Windows machine running on the x86_64 architecture
  only if there are no cinterop dependencies.

## What's next?

* [Build final native binaries](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)
* [Set up multiplatform library publication](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)