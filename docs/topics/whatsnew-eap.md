[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, 
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{type="note"}

The Kotlin %kotlinEapVersion% release is out!
Here are some details of this EAP release:

* [Language: Data class copy function to have the same visibility as constructor](#language-data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [Kotlin/Native: support for bitcode embedding removed](#kotlin-native-support-for-bitcode-embedding-removed)
* [Kotlin/Wasm: Error in default export usage](#kotlin-wasm-error-in-default-export-usage)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio. 
You don't need to update the Kotlin plugin in your IDE. 
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-release) for details.

## Language: Data class copy function to have the same visibility as constructor

Currently, if you create a data class using a `private` constructor, 
the automatically generated `.copy()` function doesn't have the same visibility. 
This can cause problems later in your code. 
In future Kotlin releases, we will introduce the behavior that the default visibility of the `.copy()` function is the same as the constructor.
This change will be introduced gradually to help you migrate your code as smoothly as possible.

Our migration plan starts with Kotlin %kotlinEapVersion%, 
where we issue warnings in your code where the visibility will change in the future. 
For example:

```kotlin
// Triggers a warning in %kotlinEapVersion%
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // Triggers a warning in %kotlinEapVersion%
    val negativeNumber = positiveNumber.copy(number = -1)
    // warning: non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

For the latest information about our migration plan,
see the corresponding issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914).

To give you more control over this behavior, in Kotlin %kotlinEapVersion% we’ve introduced two annotations:
`@ConsistentCopyVisibility` to opt in to the behavior now before we make it the default in a later release.
`@ExposedCopyVisibility` to opt out of the behavior and suppress warnings at the declaration site. 
Note that even with this annotation, the compiler still reports warnings when the `.copy()` function is called.

If you want to opt in to the new behavior already in %kotlinEapVersion% for a whole module rather than in individual classes,
you can use the `-Xconsistent-data-class-copy-visibility` compiler option.
This option has the same effect as adding the '@ConsistentCopyVisibility' annotation to all data classes in a module.

## Kotlin/Native: support for bitcode embedding removed

Starting with Kotlin %kotlinEapVersion%, the Kotlin/Native compiler no longer supports bitcode embedding.
Bitcode embedding was deprecated in Xcode 14 and removed in Xcode 15 for all Apple targets.

Now, the `embedBitcode` parameter for the framework configuration, 
as well as the `-Xembed-bitcode` and `-Xembed-bitcode-marker` command line arguments are deprecated.

If you still use earlier versions of Xcode but want to upgrade to %kotlinEapVersion%, 
disable bitcode embedding in your Xcode projects.

## Kotlin/Wasm: Error in default export usage

As part of the migration towards named exports, 
a warning message was previously printed to the console when using a default import for Kotlin/Wasm exports in JavaScript.

To fully support named exports, this warning has now upgraded to an error. 
If you use a default import, you encounter the following error message:

```text
Do not use default import. Use the corresponding named import instead.
```

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a 
bundled plugin included in your IDE. This means that you can't install the plugin from JetBrains Marketplace anymore. 
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version) 
to %kotlinEapVersion% in your build scripts.
