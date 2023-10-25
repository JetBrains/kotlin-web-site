[//]: # (title: Kotlin/Native target support)

The Kotlin/Native compiler supports a great number of different targets, though it is hard to provide the same level of
support for all of them. This document describes which targets Kotlin/Native supports and breaks them into several
tiers depending on how well the compiler supports them.

> We can adjust the number of tiers, the list of supported targets, and their features as we go.
> 
{type="tip"}

Mind the following terms used in tier tables:

* **Gradle target name** is a [target preset](multiplatform-set-up-targets.md) that is used in the
    Kotlin Multiplatform Gradle plugin to enable the target.
* **Target triple** is a target name according to the `<architecture>-<vendor>-<system>-<abi>` structure that is commonly
  used by [compilers](https://clang.llvm.org/docs/CrossCompilation.html#target-triple).
* **Running tests** indicates out of the box support for running tests in Gradle and IDE.
  
    This is only available on a native host for the specific target. For example, you can run `macosX64` and `iosX64` tests
    only on macOS x86-64 host.

## Tier 1

* The target is regularly tested on CI to be able to compile and run.
* We provide a source and [binary compatibility between compiler releases](https://youtrack.jetbrains.com/issue/KT-42293).

| Gradle target name      | Target triple                 | Running tests | Description                                    |
|-------------------------|-------------------------------|---------------|------------------------------------------------|
| Apple macOS hosts only: |                               |               |                                                |
| `macosX64`              | `x86_64-apple-macos`          | ✅             | Apple macOS on x86_64 platforms                |
| `macosArm64`            | `aarch64-apple-macos`         | ✅             | Apple macOS on Apple Silicon platforms         |
| `iosSimulatorArm64`     | `aarch64-apple-ios-simulator` | ✅             | Apple iOS simulator on Apple Silicon platforms |
| `iosX64`                | `x86_64-apple-ios-simulator`  | ✅             | Apple iOS simulator on x86-64 platforms        |

## Tier 2

* The target is regularly tested on CI to be able to compile, but may not be automatically tested to be able to run.
* We're doing our best to provide a source and [binary compatibility between compiler releases](https://youtrack.jetbrains.com/issue/KT-42293).

| Gradle target name      | Target triple                     | Running tests | Description                                        |
|-------------------------|-----------------------------------|---------------|----------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅             | Linux on x86_64 platforms                          |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | Linux on ARM64 platforms                           |
| Apple macOS hosts only: |                                   |               |                                                    |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple watchOS simulator on Apple Silicon platforms |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | Apple watchOS 64-bit simulator on x86_64 platforms |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | Apple watchOS on ARM32 platforms                   |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | Apple watchOS on ARM64 platforms with ILP32        |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple tvOS simulator on Apple Silicon platforms    |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | Apple tvOS simulator on x86_64 platforms           |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | Apple tvOS on ARM64 platforms                      |
| `iosArm64`              | `aarch64-apple-ios`               |               | Apple iOS and iPadOS on ARM64 platforms            |

> We're doing our best to move `iosArm64` to Tier 1, as it's a crucial target for [Kotlin Multiplatform](multiplatform-getting-started.md).
> To do that, we need first to create a dedicated testing infrastructure because platform limitations make it difficult
> to run compiler tests on Apple devices.
> 
> Meanwhile, we sometimes run tests manually on iOS devices and rely on testing
> similar targets, like `iosSimulatorArm64`, which should be sufficient in most cases.
> 
{type="tip"}

## Tier 3

* The target is not guaranteed to be tested on CI.
* We can't promise a source and binary compatibility between different compiler releases, though such changes for these
  targets are quite rare.

| Gradle target name      | Target triple                   | Running tests | Description                                                          |
|-------------------------|---------------------------------|---------------|----------------------------------------------------------------------|
| `androidNativeArm32`    | `arm-unknown-linux-androideabi` |               | [Android NDK](https://developer.android.com/ndk) on ARM32 platforms  |
| `androidNativeArm64`    | `aarch64-unknown-linux-android` |               | [Android NDK](https://developer.android.com/ndk) on ARM64 platforms  |
| `androidNativeX86`      | `i686-unknown-linux-android`    |               | [Android NDK](https://developer.android.com/ndk) on x86 platforms    |
| `androidNativeX64`      | `x86_64-unknown-linux-android`  |               | [Android NDK](https://developer.android.com/ndk) on x86_64 platforms |
| `mingwX64`              | `x86_64-pc-windows-gnu`         | ✅             | 64-bit [MinGW](https://www.mingw-w64.org) on Windows 7 and later     |
| Apple macOS hosts only: |                                 |               |                                                                      |
| `watchosDeviceArm64`    | `aarch64-apple-watchos`         |               | Apple watchOS on ARM64 platforms                                     |

> The `linuxArm32Hfp` target is deprecated and will be removed in future releases.
> 
{type="note"}

## For library authors

We don't recommend library authors to test more targets or provide stricter guarantees than the Kotlin/Native compiler
does. You can use the following approach when considering support for native targets:

* Support all the targets from tier 1, 2, and 3.
* Regularly test targets from tier 1 and 2 that support running tests out of the box.

The Kotlin team uses this approach in the official Kotlin libraries, for example, [kotlinx.coroutines](coroutines-guide.md) and [kotlinx.serialization](serialization.md).