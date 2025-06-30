[//]: # (title: Support for C and Objective-C libraries)
<primary-label ref="beta"/>

Kotlin/Native provides [the ability to use C](native-c-interop.md) and [Objective-C](native-objc-interop.md) libraries.
Support for these libraries is currently [in Beta](components-stability.md#kotlin-native).

One of the main reasons for the Beta status is that using C and Objective-C libraries might affect the compatibility
of your code with different versions of Kotlin, dependencies, and Xcode. This guide lists compatibility problems that
happen often in practice, problems that occur only in some cases, and hypothetical potential issues as well.

In this guide, C and Objective-C libraries, or _native libraries_ for simplicity, are divided into:

* [Platform libraries](#platform-libraries), which Kotlin provides by default to access the "system" native libraries on each platform.
* [Third-party libraries](#third-party-libraries), all other native libraries that require additional configuration for Kotlin use.

These two kinds of native libraries have different compatibility specifics.

## Platform libraries

[_Platform libraries_](native-platform-libs.md) are shipped with the Kotlin/Native compiler.
So, using different versions of Kotlin in the project results in getting different versions of platform libraries.
For Apple targets (like iOS), platform libraries are generated based on the Xcode version supported by the particular
compiler version.

Native library APIs shipped with Xcode SDKs change with every Xcode version.
Even when such changes are source- and binary-compatible within the native language,
they might become breaking for Kotlin due to the interoperability implementation.

As a result, updating the Kotlin version in a project might bring a breaking change in platform libraries.
This might matter in two cases:

* There is a source breaking change in platform libraries that affects the compilation of the source code in your
  project. Usually, it's easy to fix.
* There is a binary breaking change in platform libraries that affects some of your dependencies.
  There is typically no easy workaround, and you'll need to wait until the library developer fixes this on their
  side, for example, by updating the Kotlin version.

  > Such binary incompatibilities manifest as linkage warnings and runtime exceptions.
  > If you prefer to detect them at compilation time, raise warnings to errors with the
  > [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) compiler option.
  >
  {style="note"}

When the JetBrains team updates the Xcode version used to generate the platform libraries, it makes a reasonable
effort to avoid breaking changes in platform libraries. Whenever a breaking change might occur, the team conducts impact
analysis, and either decides to ignore a particular change (because the affected API is not commonly used) or applies
an ad hoc fix.

Another potential reason for breaking changes in platform libraries is changes in the algorithm that translates
native APIs to Kotlin. The JetBrains team makes reasonable efforts to avoid breaking changes in such cases as well.

### Using new Objective-C classes from platform libraries

The Kotlin compiler doesn't prevent you from using Objective-C classes that are not available with your deployment
target.

For example, if your deployment target is iOS 17.0, and you use a class that appeared only in iOS 18.0, the compiler
doesn't warn you, and your application might crash during launch on a device with iOS 17.0.
Moreover, such a crash happens even when the execution never reaches those usages, so guarding them with version checks
is not enough.

For more details, see [Strong linking](native-objc-interop.md#strong-linking).

## Third-party libraries

Apart from system platform libraries, Kotlin/Native allows importing third-party native libraries.
For example, you can use [CocoaPods integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)
or set up a [cinterops configuration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops).

### Importing libraries with mismatched Xcode version

Importing third-party native libraries can lead to compatibility issues with different Xcode versions.

When processing a native library, the compiler typically uses header files from the locally installed Xcode because
almost all native library headers import "standard" headers (for example, `stdint.h`) that come from Xcode.

That's why the Xcode version affects the import of native libraries to Kotlin. This is also one of the reasons
why [cross-compilation of Apple targets from a non-Mac host](whatsnew21.md#ability-to-publish-kotlin-libraries-from-any-host)
is still impossible when using third-party native libraries.

Every Kotlin version is compatible the most with a single Xcode version. This is the recommended version, which is tested
the most against the corresponding Kotlin version. Check the compatibility with a particular Xcode version [in the compatibility table](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#version-compatibility).

Using newer or older Xcode versions is often possible but might lead to problems,
usually affecting the import of third-party native libraries.

#### Xcode version is newer than recommended

Using an Xcode version newer than recommended might break some Kotlin features. Importing third-party
native libraries is most affected by this . It often doesn't work at all with an unsupported version of Xcode.

#### Xcode version is older than recommended

Typically, Kotlin works well with older Xcode versions. There might be occasional issues that most often result in:

* The Kotlin API referring to a non-existent type as in [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694).
* A type from a system library is included in the Kotlin API of the native library.
  In this case, the project compiles successfully, but a system native type is added to your native library package.
  For example, you can then see this type unexpectedly in IDE autocompletion.

If your Kotlin library successfully compiles with an older Xcode version, it's safe to publish unless you
[use types from a third-party library in your Kotlin library API](#using-native-types-in-library-api).

### Using a transitive third-party native dependency

When a Kotlin library in your project imports a third-party native library as part of its implementation,
your project also gets access to that native library.
This happens because Kotlin/Native doesn't distinguish between `api` and `implementation` dependency types,
so native libraries always end up being `api` dependencies.

Using such a transitive native dependency is prone to more compatibility issues.
For example, a change made by the Kotlin library developer might make the Kotlin representation of the native library
incompatible, leading to compatibility issues when you update the Kotlin library.

So, instead of relying on a transitive dependency, configure interoperability with the same native
library directly. To do that, use another package name for the native library, similar to [using custom package name](#use-custom-package-name)
to prevent compatibility issues.

### Using native types in library API

If you publish a Kotlin library, be careful with native types in your library API. Such usages are expected to be broken
in the future to fix compatibility and other issues, which will affect your library users.

There are cases when using native types in a library API is necessary because it's required for
the library's purpose, for example, when a Kotlin library basically provides extensions to the native library.
If that's not your case, avoid or limit using native types in the library API.

This recommendation only applies to usages of native types in library APIs and is not related to
the application code. It also doesn't apply to library implementations, for example:

```kotlin
// Be extra careful! Native types are used in the library API:
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// Be careful as usual; native types are not used in the library API:
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

### Publishing a library that uses third-party library

If you publish a Kotlin library that uses third-party native libraries, there are a few things you can do to avoid
compatibility issues.

#### Use custom package name

Using custom package names for third-party native libraries might help prevent compatibility issues.

When a native library is imported to Kotlin, it gets a Kotlin package name. If it's not unique,
library users might get a clash. For example, if a native library is imported with the same package name elsewhere
in the user's project or other dependencies, those two usages will clash.

In such a case, the compilation might fail with the `Linking globals named '...': symbol multiply defined!` error.
However, there might be other errors or even a successful compilation.

To use a custom name for third-party native libraries:

* When importing a native library through the CocoaPods integration, use the [`packageName`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html#pod-function)
  property in the `pod {}` block of your Gradle build script.
* When importing a native library with a `cinterops` configuration, use the [`packageName`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops)
  property in the configuration block.

#### Check compatibility with older Kotlin versions

When publishing a Kotlin library, the usage of a third-party native library might affect library compatibility
with other Kotlin versions, specifically:

* Kotlin Multiplatform libraries don't guarantee forward compatibility (when an older compiler can
  use a library compiled with a newer compiler).

  In practice, it works in some cases; however, using native libraries
  might further limit forward compatibility.

* Kotlin Multiplatform libraries provide backward compatibility
  (when a newer compiler can use libraries produced with an older version).

  Using a native library in the Kotlin library normally shouldn't affect its backward compatibility.
  But it opens the possibility of more compiler bugs affecting compatibility.

#### Avoid embedding static libraries

When importing a native library, it's possible to include the associated [static library](native-definition-file.md#include-a-static-library)
(`.a` file) using the `-staticLibrary` compiler option or the `staticLibraries` property in a `.def` file.
In that case, your library users don't need to deal with native dependencies and linker options.

However, it's impossible to configure the usage of the included static library in any way:
neither exclude nor replace (substitute) it. So, users won't be able to resolve potential clashes with other Kotlin
libraries that include the same static library or adjust its version.

## Evolution of native library support

Currently, using C and Objective-C in Kotlin projects can lead to compatibility issues; some of which are listed in this guide.
To fix them, some breaking changes might be necessary in the future, which itself contributes to the compatibility problem.
