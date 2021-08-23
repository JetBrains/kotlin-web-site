[//]: # (title: Migrating Kotlin/JS projects to the IR compiler)

> The Kotlin/JS IR compiler is in [Alpha](components-stability.md). It may change incompatibly and require manual migration
>in the future. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

We are replacing the current Kotlin/JS compiler with [the IR-based compiler](js-ir-compiler.md) in order to unify
Kotlin’s behavior on all platforms and to make it possible to implement new JS-specific optimizations, among other reasons.
You can learn more about the internal differences between the two compilers in the blog post
[Migrating our Kotlin/JS app to the new IR compiler](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i)
by Sebastian Aigner.

Due to the significant differences between the compilers, switching your Kotlin/JS project from the old backend to the new one
may require adjusting your code. On this page, we've compiled a list of known migration issues along with suggested solutions.

Note that this guide may change over time as we fix issues and find new ones. Please help us keep it complete –
report any issues you encounter when switching to the IR compiler by submitting them to our issue tracker [YouTrack](https://kotl.in/issue)
or filling out [this form](https://surveys.jetbrains.com/s3/ir-be-migration-issue).

## Convert JS- and React-related classes and interfaces to external interfaces

**Issue**: Using Kotlin interfaces and classes (including data classes) that derive from pure JS classes, such as React's `RState` and
`RProps`, can cause a `ClassCastException`. Such exceptions appear because the compiler attempts to work with instances of
these classes as if they were Kotlin objects, when they actually come from JS.

**Solution**: convert all classes and interfaces that derive from pure JS classes to [external interfaces](js-interop.md#external-interfaces):

```kotlin
// Replace this
interface AppState : RState { }
interface AppProps : RProps { }
data class CustomComponentState(var name: String) : RState
```

```kotlin
// With this
external interface AppState : RState { }
external interface AppProps : RProps { }
external interface CustomComponentState : RState {
   var name: String
}
```

In IntelliJ IDEA, you can use these [structural search and replace](https://www.jetbrains.com/help/idea/structural-search-and-replace.html)
templates to automatically mark interfaces as `external`:
* [Template for `RState`](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [Template for `RProps`](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## Convert properties of external interfaces to var

**Issue**: properties of external interfaces in Kotlin/JS code can't be read-only (`val`) properties because their values can be
assigned only after the object is created with `js()` or `jsObject()` (a helper function from [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)):

```kotlin
val myState = js("{}") as CustomComponentState
myState.name = "name"
```

**Solution**: convert all properties of external interfaces to `var`:

```kotlin
// Replace this
external interface CustomComponentState : RState {
   val name: String
}
```

```kotlin
// With this
external interface CustomComponentState : RState {
   var name: String
}
```

## Make boolean properties nullable in external interfaces

**Issue**: JavaScript treats the `null` or undefined value of a boolean variable as `false`. So, boolean properties can be used
in expressions without being defined. This is okay in JavaScript, but not in Kotlin.

```kotlin
external interface ComponentProps: RProps {
   var isInitialized: Boolean
   var visible: Boolean
}
```

```kotlin
val props = js("{}") as ComponentProps
props.isInitialized = true
// visible is not initialized - OK in JS – means it's false
```

If you try to use such a property in a function overridden in Kotlin (for example, a React `button`), you'll get a `ClassCastException`:

```kotlin
button {
   attrs {
       autoFocus = props.visible // ClassCastException here
   }
}
```

**Solution**: make all `Boolean` properties of external interfaces nullable (`Boolean?`):

```kotlin
// Replace this
external interface ComponentProps: RProps {
   var visible: Boolean
}
```

```kotlin
// With this
external interface ComponentProps: RProps {
   var visible: Boolean?
}
```

## Convert functions with receivers in external interfaces to regular functions

**Issue**: external declarations can't contain functions with receivers, such as extension functions or properties with corresponding
functional types.

**Solution**: convert such functions and properties to regular functions by adding the receiver object as an argument:

```kotlin
// Replace this
external interface ButtonProps : RProps {
   var inside: StyledDOMBuilder<BUTTON>.() -> Unit
}
```

```kotlin
external interface ButtonProps : RProps {
   var inside: (StyledDOMBuilder<BUTTON>) -> Unit
}
```

## Create plain JS objects for interoperability

**Issue**: properties of a Kotlin object that implements an external interface are not _enumerable_. This means that they are not
visible for operations that iterate over the object's properties, for example:
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

Although they are still accessible by the name: `obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
   val jsApp = js("{name: 'App1'}") as AppProps // plain JS object
   println("Kotlin sees: ${jsApp.name}") // "App1"
   println("JSON.stringify sees:" + JSON.stringify(jsApp)) // {"name":"App1"} - OK

   val ktApp = AppPropsImpl("App2") // Kotlin object
   println("Kotlin sees: ${ktApp.name}") // "App2"
   // JSON sees only the backing field, not the property
   println("JSON.stringify sees:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**Solution 1**: create plain JavaScript objects with `js()` or `jsObject()` (a helper function from [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)):

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// Replace this
val ktApp = AppPropsImpl("App1") // Kotlin object
```

```kotlin
// With this
val jsApp = js("{name: 'App1'}") as AppProps // or jsObject {}
```

**Solution 2**: create objects with `kotlin.js.json()`:

```kotlin
// or with this
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## Replace toString() calls on function references with .name

**Issue**: in the IR backend, calling `toString()` on function references doesn't produce unique values.

**Solution**: use the `name` property instead of `toString()`.


