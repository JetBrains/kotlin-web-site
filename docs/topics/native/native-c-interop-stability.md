[//]: # (title: Stability of using C and Objective-C libraries)

## Intro

Kotlin/Native provides [the ability to use C](native-c-interop.md) and [Objective-C](native-objc-interop.md) libraries.
This document calls them "native libraries" for simplicity.

This feature is currently [in Beta](components-stability.md).
One of the main reasons for this is that using native libraries might affect the compatibility of your code
with different versions of Kotlin, dependencies and Xcode.
In other words, the compatibility might be worse compared to the case when your code doesn't use native libraries.
This document covers this topic.

> This document describes not only problems that do happen often in practice, but also problems that might happen
> (but usually don't), and hypothetical potential problems as well.
>
{style="note"}

There is an important distinction:
- On each platform, Kotlin provides access to "system" native libraries through so-called
  ["platform libraries"](native-platform-libs.md)
- All other native libraries require additional configuration to be used from Kotlin, and this document calls them
  "third-party libraries".

These two kinds of native libraries have different compatibility properties.

## Platform libraries

Platform libraries are shipped with the Kotlin/Native compiler.
So, using different versions of Kotlin in the project results in getting different versions of platform libraries.
For Apple targets (like iOS), platform libraries are generated based on an Xcode version this version of the compiler
supports.

Native APIs of libraries shipped with Xcode SDKs change with an Xcode version.
Even when such changes are source- and binary-compatible within the native language,
they might become breaking for Kotlin due to the way the interoperability is implemented.

As a result, updating the Kotlin version in a project might bring a breaking change in platform libraries.
This might matter in two cases:
- There is a source breaking change in platform libraries that affects the compilation of the source code in your
  project.
  Usually it should be trivial to fix.
- There is a binary breaking change in platform libraries that affects some of your dependencies.
  There is typically no easy workaround, and you will need to wait until the library developer will fix this on their
  side, e.g., by updating the Kotlin version.
  > Such binary incompatibilities manifest as linkage warnings and runtime exceptions.
  > If you prefer to detect them at compilation time, consider raising those warnings to errors by using
  > `-Xpartial-linkage-loglevel=ERROR` compiler flag as explained
  > [here](whatsnew19.md#library-linkage-in-kotlin-native).
  {style="note"}

The JetBrains team, whenever updates the Xcode version used to generate the platform libraries, makes a reasonable
effort to avoid breaking changes in platform libraries: whenever a breaking change might occur, the team conducts impact
analysis and either decides to ignore this particular change (because the affected API is not commonly used) or applies
an ad hoc fix for this problem.

Another potential reason for breaking changes in platform libraries is changes in the algorithm that translates
native APIs to Kotlin.
Just like above, the JetBrains team makes reasonable efforts to avoid breaking changes in such cases as well.

### Using new Objective-C classes from platform libraries

The Kotlin compiler doesn't prevent you from using Objective-C classes that are not available with your deployment
target.

For example, if your deployment target is iOS 17.0, and you use a class that appeared only in iOS 18.0, the compiler
won't warn you, and your application might crash during launch on a device with iOS 17.0.
Moreover, such a crash happens even when the execution never reaches those usages, so guarding them with version checks
is not enough.

See more details [here](native-objc-interop.md#strong-linking).

## Importing third-party native libraries when the Xcode version doesn't match

Apart from system libraries, Kotlin/Native allows importing third-party native libraries.
For example,
by using [CocoaPods integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)
or defining a [cinterops configuration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops).

This has implications for the compatibility of your project with different Xcode versions:
(almost) any native library headers import some "standard" headers (e.g. `stdint.h`), and those standard headers come
from Xcode.

In other words, when processing a native library, the compiler typically uses some header files from the locally
installed Xcode.
This is the reason why the Xcode version affects specifically importing native libraries to Kotlin.
(This is also one of the reasons why [cross-compilation from non-Mac to Apple targets is incompatible with using
third-party native libraries](whatsnew21.md#ability-to-publish-kotlin-libraries-from-any-host)).

Every Kotlin version is compatible the most with a single Xcode version.
You can find the versions
[in this table](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#version-compatibility).
This is the recommended version, which is tested the most with the corresponding Kotlin version. 
Using other Xcode versions is often possible but might lead to problems, usually affecting importing third-party native
libraries.

### Using the Xcode version newer than recommended
When using the Xcode version newer than recommended above, some Kotlin features might be broken.
Importing third-party native libraries is affected by this the most.
It often doesn't work at all with an unsupported version of Xcode.

### Using the Xcode version older than recommended

Typically, Kotlin works fine with older Xcode versions.
There might be occasional issues, most frequently one of the two:
- The Kotlin API of the native library refers to a non-existent type
  (example: [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694)).
- The Kotlin API of the native library includes a type that belongs to a system library.
  I.e., everything compiles well, but some system native type is added to your native library package.
  For example, this system type can be visible in autocompletion in the IDE when and where you don't expect it.

If you develop a Kotlin library, and it compiles with an older Xcode version fine, it is safe to publish (unless you
[use types from the third-party native library in your Kotlin library API](#using-native-types-in-library-api)).

## Using a transitive third-party native dependency

When a Kotlin library used in your project imports a third-party native library as its implementation detail,
your project also gets access to that native library.
This happens because Kotlin/Native doesn't support the separation between `api` and `implementation` dependencies,
so native libraries always end up being `api` dependencies.

Using such a transitive native dependency is prone to more compatibility issues.
For example, a change made by the Kotlin library developer might alter the Kotlin representation of the native library
incompatibly, leading to compatibility issues when you update the Kotlin library.

So, instead of relying on a transitive dependency, please configure interoperability with the same native
library directly.
Use another package name for the native library, similar to how described [here](#use-custom-package-name).

## Future evolution of interoperability

Using native libraries has its issues.
Some of them are listed in this document.
To fix the issues, some breaking changes might be necessary in the future.
This fact itself contributes to the compatibility issues as well.

## Using native types in library API

If you publish a Kotlin library, be careful with using native types in the API of your library:
such usages are expected to be broken at some point in the future to fix the compatibility and other issues.
This would affect the users of your library then.

Of course, there are cases when using native types in a library API is necessary because it is required for
the library purpose.
For example, if a Kotlin library basically provides extensions to the native library.
But if your case doesn't require this, please avoid or limit using native types in the library API.

This section covers usages of native types in library APIs specifically.
The recommendations in the section don't apply to the application code.

They also don't apply to library implementations. In other words, for a library
```kotlin
// Be extra careful! Native types are used in the library API.
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// Be careful as usual: native types are not used in the library API.
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

## Publishing a library using a third-party native library

If you publish a Kotlin library that uses third-party native libraries, here are a few things you might find useful.

### Use custom package name
Using custom package names for third-party native libraries might help to prevent compatibility issues.

When importing a native library to Kotlin, it gets a Kotlin package name.
If this package name is not unique, users of your library might have a clash: for example, if the same native
library is imported with the same package name elsewhere in the user's project or other dependencies, those two usages
will clash.
For example, the compilation might fail with `Linking globals named '...': symbol multiply defined!`. But there might be
other errors or even a successful compilation.

When importing a native library through the CocoaPods integration, use the
[packageName](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html#pod-function)
property in the `pod {}` block of your Gradle build script.

When importing a native library with a `cinterops` configuration, use
[packageName](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops)
in the configuration block.

### Compatibility with older Kotlin versions

When publishing a Kotlin library, the usage of a third-party native library might affect library compatibility
with other Kotlin versions.

More specifically:

* Kotlin Multiplatform libraries don't guarantee forward compatibility (an older compiler being able to
use a library compiled with a newer compiler), but in practice it works in some cases.
Using native libraries might limit forward compatibility further.
* Kotlin Multiplatform libraries provide backward compatibility
  (a newer compiler can use libraries produced with an older version).
  Using a native library in the Kotlin library normally shouldn't affect its backward compatibility.
  But it opens possibilities for more compiler bugs affecting the compatibility.

### Embedding static libraries

When importing a native library, it is possible to include the associated static library (`.a` file) using
the `-staticLibrary` flag or the `staticLibraries` property in a `.def` file.

In that case a user of your library won't need to deal with native dependencies and linker options to use it.
But there is a limitation: users won't have a way to configure the usage of the included static library in any way:
neither exclude it nor replace (substitute) it.

So, they won't be able to resolve potential clashes with other Kotlin libraries that include the same static library
or to adjust the version of the static library.
