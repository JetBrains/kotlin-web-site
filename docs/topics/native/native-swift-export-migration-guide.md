[//]: # (title: Migrate from Objective-C interop to Swift export)
<primary-label ref="beta"/>

Previously, Kotlin code was available to Swift only indirectly, through an [Objective-C framework](native-objc-interop.md).
[Swift export](native-swift-export.md) generates a real Swift API from
your Kotlin sources instead, so there's no Objective-C layer in between.

This guide compares the two approaches and describes how to migrate an existing Kotlin Multiplatform project
from the Objective-C framework to Swift export:

1. [Switch the Gradle build](#update-the-gradle-configuration) from `binaries.framework {}` to the
   `export { swift {} }` block.
2. [Switch the Xcode project](#update-the-xcode-project) to the direct integration or the Swift package integration.
3. [Prepare the exported Kotlin API](#prepare-the-kotlin-api) to control which public declarations and dependencies Swift export exposes.
4. [Rewrite the Swift code](#update-the-swift-code) since almost every Kotlin declaration are different in Swift.

> Explore the [public sample project](https://github.com/Kotlin/swift-export-sample) with Swift export already set up.
>
{style="tip"}

## Check the requirements

Swift export is in [Beta](components-stability.md#stability-levels-explained) and has stricter requirements than
interoperability through Objective-C. Check all of them before you start the migration:

| Requirement            | Details                                                                                                                                                                                                                                                                                                                                                          |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Kotlin                 | 2.5.0 or later. Earlier versions only have the deprecated `swiftExport {}` DSL. Compiler plugins and KSP processors must have versions compatible with that Kotlin version.                                                                                                                                                                        |
| Build tools            | Gradle 8.14 or later, and Android Gradle plugin 8.8.2 or later if your project includes an Android target.                                                                                                                                                                                                                                                       |
| Deployment target      | iOS 18.0, macOS 15.0, tvOS 18.0, or watchOS 11.0 and later. The generated concurrency support relies on newer Apple runtime APIs, and the build fails with a lower deployment target.                                                                                                                                                                            |
| Xcode                  | Xcode 16 or later, with `ENABLE_USER_SCRIPT_SANDBOXING` set to `NO`.                                                                                                                                                                                                                                                                                             |
| Xcode integration type | [CocoaPods integration](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) is not supported. Move the project to [Swift package integration](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html) or [direct integration](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html) first before the migration. |

If your project can't meet one of these requirements yet, for example because the app must support older iOS versions,
postpone the migration instead of partially applying it.

> Swift export and Objective-C interop can coexist in the same Gradle module, but don't link both into the same
> Xcode target, as it would embed two Kotlin runtimes. If your project has several Apple targets, migrate them one at a time.
>
{style="note"}

## Review your current setup

Before changing anything, collect the following information about your project:

* The umbrella Kotlin module that the Apple app consumes, the framework's `baseName`, and the dependencies
  listed in `export()`.
* The Xcode project and targets that link the framework, together with their build phases and build settings,
  and the integration type they use: direct integration, CocoaPods, or a Swift package produced by a custom
  XCFramework setup.
* The Kotlin dependencies and compiler plugins involved in the Objective-C export, especially
  [SKIE](https://skie.touchlab.co/) and KMP-NativeCoroutines.
* Kotlin annotations specific to Objective-C interop: `@ObjCName`, `@HiddenFromObjC`, `@ShouldRefineInSwift`,
  and `@Throws`, plus KMP-NativeCoroutines annotations such as `@NativeCoroutines`.
* The Objective-C idioms used in Swift code: `FooKt.` file facades, `KotlinInt` and other boxed types,
  `companion`, `doCopy()`, completion handlers, and SKIE helpers such as `onEnum(of:)`.

Build the project once before you start, so that any later failure is attributable to the migration.

## Update the Gradle configuration

Replace the framework declaration in the umbrella module with the `export {}` block of the `kotlin {}` extension:

<compare first-title="Before" second-title="After">
    <code-block lang="kotlin">
        kotlin {
            listOf(iosArm64(), iosSimulatorArm64()).forEach {
                it.binaries.framework {
                    baseName = "Shared"
                    isStatic = true
                    export(project(":models"))
                }
            }
        }
    </code-block>
    <code-block lang="kotlin">
        kotlin {
            iosArm64()
            iosSimulatorArm64()
            export {
                swift {
                    // Keeps the old framework name for this module; exported dependencies have their own Swift module names
                    moduleName = "Shared"
                    // Removes the package prefix from the generated Swift code
                    rootPackage = "com.example.shared"
                    // Enables the Xcode integration for this module
                    xcodeIntegration {
                        // Optional: overrides the options of an exported dependency
                        configure(project(":models")) {
                            moduleName = "Models"
                            rootPackage = "com.example.models"
                        }
                    }
                }
            }
            sourceSets {
                commonMain.dependencies {
                    // Direct api dependencies are exported fully
                    api(project(":models"))
                }
            }
        }
    </code-block>
</compare>

Each exported Gradle project gets its own Swift module. Keeping the old framework name preserves imports only for
declarations from that module. In a multimodule app, also update imports for declarations from exported dependencies
to their new module names.

When you rewrite the build file, keep in mind the following differences:

* Swift export builds its own static library, so the `binaries.framework {}` block is no longer necessary.
  Remove it unless another consumer still relies on the Objective-C framework. The `baseName`, `isStatic`,
  `export()`, `transitiveExport`, and `linkerOpts` options have no effect on Swift export.
* There's no `export()` list anymore. Direct `api` dependencies are exported fully, while `implementation` and
  transitive dependencies are exported only as far as they are reachable from the exported public API. Use the
  `configure()` function inside the `xcodeIntegration {}` or `swiftPackageIntegration {}` block to override the
  options of a dependency or to exclude it with `SwiftExportVisibility.HIDDEN`.
* The umbrella module must declare the integration it uses. `xcodeIntegration()` registers the
  `embedSwiftExportForXcode` task for the direct integration, and `swiftPackageIntegration()` registers the
  `export<BuildType>SwiftPackage` tasks for the Swift package integration. Without one of them, no integration
  task is registered. You can declare both if different consumers need different outputs.
* Never combine the `export { swift {} }` block with the deprecated `swiftExport {}` block, as it's a build error.
  In the old DSL, `flattenPackage` corresponds to `rootPackage`.
* Compiler arguments belong to the regular `compilerOptions {}` block. The `-Xexport-kdoc` argument isn't needed,
  as KDoc comments are exported by default.

### Remove the tooling related to Objective-C

Most tools that work around the limitations of Objective-C interop have an equivalent in Swift export:

<deflist type="medium">
    <def title="CocoaPods plugin">
        <p>Remove the <code>kotlin("native.cocoapods")</code> plugin and the <code>cocoapods {}</code> block, as well as the pod from the <code>Podfile</code>. Swift export doesn't support CocoaPods, so move the project to a local Swift package as a separate step before the migration, then use the Swift package integration.</p>
    </def>
    <def title="SKIE">
        <p>Remove the plugin and the <code>skie {}</code> block. Swift export covers the main SKIE features natively: sealed hierarchies become Swift <code>enum</code> types with the <code>sealedType()</code> function, suspending functions become <code>async</code> functions, and flows become <code>AsyncSequence</code>.</p>
    </def>
    <def title="KMP-NativeCoroutines">
        <p>Remove the Gradle plugin, the KSP processor, and the <code>@NativeCoroutines</code>, <code>@NativeCoroutinesState</code>, <code>@NativeCoroutineScope</code>, and <code>@NativeCoroutinesIgnore</code> annotations. Remove the Swift packages after you migrate the call sites.</p>
    </def>
    <def title="XCFramework and Swift package distribution">
        <p>Replace custom XCFramework publishing, KMMBridge, or the <code>multiplatform-swiftpackage</code> plugin with the <code>swiftPackageIntegration()</code> function in the <code>swift {}</code> block, which is the built-in Swift package integration.</p>
    </def>
</deflist>

Also remove the leftover Gradle properties, such as `kotlin.native.cocoapods.*` and SKIE-specific ones.
Coroutine support in Swift export is enabled automatically when `kotlinx.coroutines` is in the dependency graph.

## Update the Xcode project

Swift export supports two integration types, and the Xcode changes depend on the one you choose:

* The [direct integration](#migrate-to-the-direct-integration) keeps a **Run Script** build phase that calls Gradle
  on every build.
* The [Swift package integration](#migrate-to-the-swift-package-integration) produces a local Swift package that the
  Xcode project consumes as a package dependency.

Choose Swift export integration type based on how your Xcode project consumes the Kotlin code now:

<deflist type="medium">
    <def title="Direct integration">
        <p>Stay with the direct integration. It's the closest equivalent of your current setup, so the migration only affects the run script phase and the build settings.</p>
    </def>
    <def title="CocoaPods">
        <p>CocoaPods are deprecated and not supported by Swift export. First, move the project from CocoaPods to a local Swift package, and only then migrate to Swift export. Don't do both at the same time: each step changes a different part of the project.</p>
        <p>Remove the pod from the `Podfile` after the migration.</p>
    </def>
    <def title="XCFramework">
        <p>First, wrap your XCFramework in a Swift package to establish the remote integration and then switch to Swift export. You can also do both at once, as the Swift package generation built into Swift export replaces your custom packaging.</p>
        <p>Remove custom XCFramework dependency from the Xcode project after the migration.</p>
    </def>
</deflist>

### Migrate to the direct integration

For every application or extension target that linked the Kotlin framework:

1. On the **Build Phases** tab, replace the `embedAndSignAppleFrameworkForXcode` task in the **Run Script** phase with
   the `embedSwiftExportForXcode` task:

   ```bash
   cd "$SRCROOT/.."
   ./gradlew :shared:embedSwiftExportForXcode
   ```

   The phase must still run before the **Compile Sources** phase.
2. Update the build settings in both the `Debug` and `Release` configurations:

   | Setting                         | Value                                                                                                                                                                                               |
   |---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `IPHONEOS_DEPLOYMENT_TARGET`    | `18.0` or later. For other platforms, use the corresponding setting: `15.0` for macOS, `18.0` for tvOS, and `11.0` for watchOS. Bump the `platforms` option in local `Package.swift` files as well. |
   | `ENABLE_USER_SCRIPT_SANDBOXING` | `NO`                                                                                                                                                                                                |
   | `OTHER_LDFLAGS`                 | Remove the `-framework <baseName>` flag. The generated library is autolinked. Add system libraries only if linking fails, for example `-lsqlite3`.                                                  |
   | `FRAMEWORK_SEARCH_PATHS`        | Remove the path to the `build/xcode-frameworks` directory of your Kotlin module.                                                                                                                    |

3. Remove the Swift packages of KMP-NativeCoroutines and SKIE once nothing in the project uses them.

The build output lands in the `BUILT_PRODUCTS_DIR` directory: the `lib<Module>.a` static library, one `.swiftmodule` file
per exported module, and the `KotlinRuntime`, `KotlinRuntimeSupport`, and `KotlinCoroutineSupport` modules.

> With the direct integration, Swift export tasks are registered only when the Xcode environment variables are
> available. Build the project through Xcode or `xcodebuild` rather than by invoking Gradle directly.
>
{style="note"}

### Migrate to the Swift package integration

Swift export can produce a local Swift package instead of relying on a build phase.
Add the `swiftPackageIntegration()` function to the `swift {}` block:

```kotlin
export {
    swift {
        moduleName = "Shared"

        swiftPackageIntegration {
            // Optional: the default is the SwiftPackage directory of the module
            outputDirectory = layout.projectDirectory.dir("SwiftPackage")
        }
    }
}
```

Then update the Xcode project:

1. Generate the package with the export task for the build type you need:

   ```bash
   ./gradlew :shared:exportReleaseSwiftPackage
   ```

   Unlike the direct integration, this task doesn't need the Xcode environment, so you can run it from the
   command line or from CI. Re-run it after every change in the Kotlin code.
2. In Xcode, remove the **Run Script** phase and the pod or XCFramework dependency, and then select
   **File** | **Add Package Dependencies** | **Add Local** and choose the build type subdirectory of the output
   directory, such as `SwiftPackage/Debug`. Link the `<Module>Library` product to the application target.

   If the app already has a `Package.swift` manifest, declare the dependency there instead:

   ```swift
   dependencies: [
       .package(name: "Shared", path: "../shared/SwiftPackage/Release")
   ],
   targets: [
       .target(name: "App", dependencies: [.product(name: "SharedLibrary", package: "Shared")])
   ]
   ```
3. Update the deployment target and `OTHER_LDFLAGS` build settings as described for the
   [direct integration](#migrate-to-the-direct-integration), and remove the Swift packages of KMP-NativeCoroutines
   and SKIE once nothing in the project uses them.

The two integrations are configured independently, so if you keep both, repeat the per-dependency `configure()`
overrides in the `swiftPackageIntegration {}` block as well.

> Point the dependency at the build type subdirectory, not at the output directory itself. The export task
> deletes unknown files in that subdirectory, so don't keep anything of your own there, and exclude it from
> version control. All Apple targets must export the same set of modules.
>
{style="note"}

## Prepare the Kotlin API

Each exported Gradle project can define its own `export { swift {} }` block to set `moduleName` and `rootPackage` in the
Gradle build file. Use them to name exported modules; otherwise Swift export derives a long
module name from the Gradle coordinates.

Swift export exports every public declaration of the exported modules, plus the parts of dependencies reachable
from them. Like Objective-C interop, it doesn't prune declarations that Swift never references. A large public API
surface leads to slow builds, a lot of generated code, and a confusing Swift API, so it's worth shrinking it:

* Make the code that Swift never calls `internal`: dependency injection modules, HTTP clients, repository
  implementations, mappers, and utility extensions.
* Consider enabling `explicitApi()` in exported modules, so that every public declaration is a deliberate choice
  and has an explicit return type.
* Consider keeping third-party library types out of public signatures. Expose an interface with a top-level factory function
  and keep the implementation `internal`, use `internal` constructors, and return `Unit` or your own types from
  Swift-facing entry points.
* Mark dependencies that are only used internally as `implementation`, not `api`. If their types still leak into
  the exported public API, hide the dependency with
  `xcodeIntegration { configure(libs.example, SwiftExportVisibility.HIDDEN) }`. Hidden modules are translated as
  shallow declarations, so they neither break the build nor pollute the Swift API.

### Adjust unsupported constructs

Some Kotlin constructs don't translate well, and the declarations using them are either missing from the generated
Swift code or break the build. Update your Kotlin code:

| Kotlin pattern                                                                                                                    | Problem                                                         | What to do                                                                                        |
|-----------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `MutableList`, `MutableSet`, and `MutableMap` parameters | Mutable collection types are not supported | Use read-only `List`, `Set`, and `Map` parameters |
| Custom types that inherit from `List`, `Set`, or `Map` | The generated bridge compiles, but Swift cannot instantiate the type | Expose a wrapper type or use a read-only collection supertype |
| Parameters typed with a generic class with a concrete type argument, like `Box<String>`                                           | The function isn't exported                                     | Take the upper bound or a star projection, or introduce a non-generic wrapper type                |
| Generic classes, interfaces, and sealed hierarchies in the Swift-facing API                                                       | Type arguments are erased, so Swift code is full of casts       | Expose non-generic wrappers mapped in Kotlin, like `ProfileState` or `ProfileRepository`          |
| Default argument values                                                                                                           | Not exported                                                    | Add explicit overloads or secondary constructors for the Swift call shapes                        |
| `inline fun` with a `reified` type parameter                                                                                      | Not exported                                                    | Add a variant with a `KClass` parameter                                                           |
| `protected` members                                                                                                               | Not visible in Swift, including Swift subclasses                | Make them public or add a public accessor                                                         |
| Declarations named like members of `NSObject`, such as `hash` or `description`                                                    | Dropped from the export because Swift resolves them to inherited `NSObject` members ([KT-90497](https://youtrack.jetbrains.com/issue/KT-90497)) | Rename them in Kotlin or use `@ObjCName(swiftName = "...")`                                       |
| Declarations named like Swift and SwiftUI types, such as `Shape`, `Color`, or `Result`                                            | Ambiguous in Swift files that also import SwiftUI or Foundation | Rename them in Kotlin, or qualify the name in Swift with the module name                          |
| Exceptions thrown from non-suspending functions                                                                                   | Terminate the app when they reach Swift                         | Annotate the function with `@Throws`                                                              |

You can also drop the workarounds that existed only because of Objective-C interop:
* `@Throws` functions that forced a type into the generated header.
* `@ObjCName` annotations that only fixed Objective-C name mangling.
*  Renames that avoided the `doInit` prefix.

`@HiddenFromObjC` still hides declarations from Swift export, and `@ObjCName(swiftName = "...")` still renames them.

## Update the Swift code

Build the project and then work through the compiler errors file by file.
Apply the mechanical changes first, such as imports, file facades, and boxed types, and then the semantic ones,
such as coroutines and sealed hierarchies.

### Names and namespaces

| Objective-C interop                     | Swift export                                                                                                                                                                |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `import shared`                         | `import Shared` for declarations from the umbrella module. Each exported Gradle module has its own Swift module name, so import the module that owns the declaration you use. KotlinRuntime and KotlinCoroutineSupport are re-exported automatically. |
| `Item` for any package                  | `Item` only for declarations in `rootPackage`; otherwise `remote.Item` or `ExportedKotlinPackages.com.example.shared.remote.Item`                                           |
| `PlatformKt.platformName()`             | `platformName()` in the root package, or `packageName.platformName()` otherwise                                                                                              |
| `UiStateSuccess`                        | `UiState.Success`, as nested types stay nested                                                                                                                              |
| `doInit()`, `doCopy()`, `doSomething()` | The original Kotlin names: `init()`, `copy()`, `something()`                                                                                                                |
| `MyObject()`                            | `MyObject.shared`                                                                                                                                                           |
| `Foo.companion.bar`                     | `Foo.Companion.shared.bar`                                                                                                                                                  |

### Types and functions

| Objective-C interop                                            | Swift export                                                                                            |
|----------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `KotlinInt(value: 1)`, `[KotlinInt]`, `KotlinBoolean(bool: b)` | `Int32(1)`, `[Int32]`, `b`. Optional values are passed as is, for example as `Int32?`                   |
| `KotlinUnit()`, `KotlinNothing`                                | `()`, `Never`                                                                                           |
| `NSString`, `NSNumber`, `NSArray`, and `NSDictionary` wrappers | Plain Swift values                                                                                      |
| `MyEnum.entryOne`, `.name`, `.ordinal`, `values()`             | `MyEnum.ENTRY_ONE` with the exact Kotlin name, `.description`, `.rawValue`, `allCases`                  |
| `Box<NSString>(value:)`, `Repository<User>`                    | `Box(value:)`, `Repository`, with an `as!` cast when reading erased values                              |
| `f(param_: 2.0)` for overloads                                 | `f(param: 2.0 as Float)` with the real parameter label                                                  |
| `a.plus(other: b)`, `a.get(index: i)`                          | `a + b`, `a[i]`                                                                                         |
| `receiver.extensionFunction()` for any package                 | `receiver.extensionFunction()` for root-package extensions, `pkg.extensionFunction(receiver)` otherwise |
| `catch let error as NSError`                                   | `catch let error as MyKotlinException`, as `kotlin.Throwable` conforms to `Swift.Error`                 |

### Coroutines

Suspending functions no longer have completion handler variants, and you don't need the helpers from SKIE or
KMP-NativeCoroutines:

```swift
// Before, with the Objective-C completion handler
repository.loadItem(id: 1) { item, error in /* ... */ }

// Before, with KMP-NativeCoroutines
let item = try await asyncFunction(for: repository.loadItem(id: 1))

// After
Task {
    do {
        let item = try await repository.loadItem(id: 1)
    } catch is CancellationError {
        // The Swift task was cancelled, which also cancels the coroutine
    } catch {
        print(error)
    }
}
```

Flows become `AsyncSequence` instances with a typed element, and the current value of a `StateFlow` is available
through the `value` property:

```swift
// Before, with the Objective-C collector
try await repository.numbers().collect(collector: NumberCollector())

// Before, with SKIE
for await value in repository.numbers() { /* ... */ }

// After
for try await value in repository.numbers().asAsyncSequence() { /* ... */ }

let current = viewModel.state.value
```

### Sealed hierarchies

Replace the chains of `as?` casts and the SKIE `onEnum(of:)` function with the `sealedType()` function, which
returns a Swift `enum` and allows exhaustive `switch` statements:

```swift
// Before
if let success = state as? UiStateSuccess {
    // ...
} else if let error = state as? UiStateError {
    // ...
}

// After
switch state.sealedType() {
    case .success(let success): print(success.value.items)
    case .error(let error): print(error.value.message)
    case .loading: break
}
```

Note the `value` property: each enum case wraps the corresponding Kotlin instance.

Generic sealed interfaces don't have the `sealedType()` function. Either keep the casts against the nested
Swift names or expose a non-generic hierarchy from Kotlin.

## Verify the migration

After you've completed the migration steps, check that everything works as expected. Some things are visible only at
runtime, so compiling the project isn't enough. To verify the migration:

1. Build the project through Xcode or `xcodebuild`, and review the warnings about casts that always fail or
   have no effect, as they usually indicate a runtime crash. With the Swift package integration, re-run the
   `export<BuildType>SwiftPackage` task first, so that the package reflects the current Kotlin code.
2. Run the application in the simulator and go through every screen that touches Kotlin code. Look for missing
   overrides of abstract members, failing `as!` casts, and undeclared Kotlin exceptions.
3. Build the other Apple targets that consumed the framework, as well as the Android and JVM targets.
   The visibility changes in the Kotlin code affect them as well.

### Troubleshooting

| Problem                                                                                | Solution                                                                                                                  |
|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Task 'embedSwiftExportForXcode' not found`                                            | Add `xcodeIntegration()` to the `export { swift {} }` block of the module.                                                |
| The build fails because the `swiftExport {}` and `export { swift {} }` blocks conflict | Remove the deprecated `swiftExport {}` block.                                                                             |
| `Swift Export needs IPHONEOS_DEPLOYMENT_TARGET to be 18.0 or newer`                    | Raise the deployment target of the Xcode target.                                                                          |
| Two exported modules resolve to the same Swift module name                             | Rename one of them with `configure(dependency) { moduleName = "..." }`.                                                   |
| The compilation of the generated Kotlin bridges fails in your own module               | A declaration uses an unsupported construct. Adjust the Kotlin signature or hide the declaration. Help us fix such cases by reportig them to [YouTrack](https://kotl.in/issue). |
| The build fails inside the generated code of a dependency                              | Hide the dependency with `configure(dependency, SwiftExportVisibility.HIDDEN)` and expose only the wrappers your Swift code needs from your own module.  |
| A declaration is missing from the generated Swift code or is marked as unavailable     | Check the Kotlin signature against the [limitations](native-swift-export.md#current-limitations) and adjust it.          |
| A function of your module fails at runtime with a fatal error                          | The declaration mentions a type from a hidden dependency. Replace it with a wrapper that doesn't expose that type.        |
| The Swift export worker runs out of memory                                             | Shrink the exported API surface, or raise the memory limit with the `kotlin.swift-export.jvmArgs=-Xmx4g` Gradle property. |
| The Swift package export fails because the Apple targets export different module sets  | Align the exported modules across all Apple targets, as a Swift package has a single module set.                          |

## What's next

* [Check how Kotlin declarations are mapped to Swift](native-swift-export.md#mappings)
* [Compare with the Objective-C interop mappings](native-objc-interop.md#mappings)
* [Learn more about the Swift package export setup](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html)
* [Explore the sample project with Swift export already set up](https://github.com/Kotlin/swift-export-sample)
