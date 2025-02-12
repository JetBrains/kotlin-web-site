[//]: # (title: Platform libraries)

To provide access to native services of operating systems, Kotlin/Native distribution includes a set of prebuilt
libraries specific to each target. These are called _platform libraries_.

The packages from platform libraries are available by default. You don't need to specify additional link options to use
them. The Kotlin/Native compiler automatically detects which platform libraries are accessed and automatically links
the necessary ones.

However, platform libraries in the compiler distribution are merely wrappers and bindings to the native libraries. That
means you need to install native libraries themselves (`.so`, `.a`, `.dylib`, `.dll`, and so on) on your local machine.

## POSIX bindings

Kotlin provides the POSIX platform library for all UNIX- and Windows-based targets, including Android and iOS.
These platform libraries contain bindings to the platform's implementation in the [POSIX standard](https://en.wikipedia.org/wiki/POSIX).

To use the library, import it into your project:

```kotlin
import platform.posix.*
```

> The `platform.posix` contents differ across platforms because of variations in POSIX implementations.
>
{style="note"}

You can explore the contents of the `posix.def` file for each supported platform here:

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

The POSIX platform library is not available for the [WebAssembly](wasm-overview.md) target.

## Popular native libraries

Kotlin/Native provides bindings for various popular native libraries that are commonly used on different platforms,
such as, OpenGL, zlib, and Foundation.

On Apple platforms, the `objc` library is included to enable [interoperability with Objective-C](native-objc-interop.md)
APIs.

You can explore the native libraries available for Kotlin/Native targets in your compiler distribution:

* If you [installed a standalone Kotlin/Native compiler](native-get-started.md#download-and-install-the-compiler):

  1. Go to the unpacked archive with the compiler distribution, for example, `kotlin-native-prebuilt-macos-aarch64-2.1.0`.
  2. Navigate to the `klib/platform` directory.
  3. Choose the folder with the corresponding target.

* If you use the Kotlin plugin in your IDE (bundled with IntelliJ IDEA and Android Studio):

  1. In your command line tool, run the following to navigate to the `.konan` folder:

     <tabs>
     <tab title="macOS and Linux">

     ```none
     ~/.konan/
     ```

     </tab>
     <tab title="Windows">

     ```none
     %\USERPROFILE%\.konan
     ```

     </tab>
     </tabs>

  2. Open the Kotlin/Native compiler distribution, for example, `kotlin-native-prebuilt-macos-aarch64-2.1.0`.
  3. Navigate to the `klib/platform` directory.
  4. Choose the folder with the corresponding target.

> If you'd like to explore the definition file for each supported platform library, in the compiler distribution folder,
> navigate to the `konan/platformDef` directory and choose the necessary target.
> 
{style="tip"}

## What's next

[Learn more about interoperability with Swift/Objective-C](native-objc-interop.md)
