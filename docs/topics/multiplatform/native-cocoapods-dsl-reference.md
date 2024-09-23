[//]: # (title: CocoaPods Gradle plugin DSL reference)

Kotlin CocoaPods Gradle plugin is a tool for creating Podspec files. These files are necessary to integrate your Kotlin
project with the [CocoaPods dependency manager](https://cocoapods.org/).

This reference contains the complete list of blocks, functions, and properties for the Kotlin CocoaPods Gradle plugin that
you can use when working with the [CocoaPods integration](native-cocoapods.md).

* Learn how to [set up the environment and configure the Kotlin CocoaPods Gradle plugin](native-cocoapods.md).
* Depending on your project and purposes, you can add dependencies between [a Kotlin project and a Pod library](native-cocoapods-libraries.md)
as well as [a Kotlin Gradle project and an Xcode project](native-cocoapods-xcode.md).

## Enable the plugin

To apply the CocoaPods plugin, add the following lines to the `build.gradle(.kts)` file:

```kotlin
plugins {
   kotlin("multiplatform") version "%kotlinVersion%"
   kotlin("native.cocoapods") version "%kotlinVersion%"
}
```

The plugin versions match the [Kotlin release versions](releases.md). The latest stable version is %kotlinVersion%.

## `cocoapods` block

The `cocoapods` block is the top-level block for the CocoaPods configuration. It contains general information on the Pod,
including required information like the Pod version, summary, and homepage, as well as optional features.

You can use the following blocks, functions, and properties inside it:

| **Name**                              | **Description**                                                                                                                                                                                                                  | 
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | The version of the Pod. If this is not specified, a Gradle project version is used. If none of these properties are configured, you'll get an error.                                                                             |
| `summary`                             | A required description of the Pod built from this project.                                                                                                                                                                       |
| `homepage`                            | A required link to the homepage of the Pod built from this project.                                                                                                                                                              |
| `authors`                             | Specifies authors of the Pod built from this project.                                                                                                                                                                            |
| `podfile`                             | Configures the existing `Podfile` file.                                                                                                                                                                                          |
| `noPodspec()`                         | Sets up the plugin not to produce a Podspec file for the `cocoapods` section.                                                                                                                                                    |
| `name`                                | The name of the Pod built from this project. If not provided, the project name is used.                                                                                                                                          |
| `license`                             | The license of the Pod built from this project, its type, and the text.                                                                                                                                                          |
| `framework`                           | The framework block configures the framework produced by the plugin.                                                                                                                                                             |
| `source`                              | The location of the Pod built from this project.                                                                                                                                                                                 |
| `extraSpecAttributes`                 | Configures other Podspec attributes like `libraries` or `vendored_frameworks`.                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | Maps custom Xcode configuration to NativeBuildType: "Debug" to `NativeBuildType.DEBUG` and "Release" to `NativeBuildType.RELEASE`.                                                                                               |
| `publishDir`                          | Configures the output directory for Pod publishing.                                                                                                                                                                              |
| `pods`                                | Returns a list of Pod dependencies.                                                                                                                                                                                              |
| `pod()`                               | Adds a CocoaPods dependency to the Pod built from this project.                                                                                                                                                                  |
| `specRepos`                           | Adds a specification repository using `url()`. This is necessary when a private Pod is used as a dependency. See the [CocoaPods documentation](https://guides.cocoapods.org/making/private-cocoapods.html) for more information. |

### Targets

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

For each target, use the `deploymentTarget` property to specify the minimum target version for the Pod library.

When applied, CocoaPods adds both `debug` and `release` frameworks as output binaries for all of the targets.

```kotlin
kotlin {
    iosArm64()
   
    cocoapods {
        version = "2.0"
        name = "MyCocoaPod"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        license = "{ :type => 'MIT', :text => 'License text'}"
        source = "{ :git => 'git@github.com:vkormushkin/kmmpodlibrary.git', :tag => '$version' }"
        authors = "Kotlin Dev"
        
        specRepos {
            url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
        }
        pod("example")
        
        xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
   }
}
```

### `framework` block

The `framework` block is nested inside `cocoapods` and configures the framework properties of the Pod built from the project.

> Note that `baseName` is a required field.
>
{style="note"}

| **Name**           | **Description**                                                                         | 
|--------------------|-----------------------------------------------------------------------------------------|
| `baseName`         | A required framework name. Use this property instead of the deprecated `frameworkName`. |
| `isStatic`         | Defines the framework linking type. It's dynamic by default.                            |
| `transitiveExport` | Enables dependency export.                                                              |                                                      

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false
            export(project(":anotherKMMModule"))
            transitiveExport = true
        }
    }
}
```

## `pod()` function

The `pod()` function call adds a CocoaPods dependency to the Pod built from this project. Each dependency requires
a separate function call.

You can specify the name of a Pod library in the function parameters and additional parameter values, like the `version`
and `source` of the library, in its configuration block:

| **Name**                     | **Description**                                                                                                                                                                                                                                                                                                                                                 | 
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | The library version. To use the latest version of the library, omit the parameter.                                                                                                                                                                                                                                                                              |
| `source`                     | Configures the Pod from: <list><li>The Git repository using `git()`. In the block after `git()`, you can specify `commit` to use a specific commit, `tag` to use a specific tag, and `branch` to use a specific branch from the repository</li><li>The local repository using `path()`</li></list> |
| `packageName`                | Specifies the package name.                                                                                                                                                                                                                                                                                                                                     |
| `extraOpts`                  | Specifies the list of options for a Pod library. For example, specific flags: <code-block lang="Kotlin">extraOpts = listOf("-compiler-option")</code-block>                                                                                                                                                                                                   |
| `linkOnly`                   | Instructs the CocoaPods plugin to use Pod dependencies with dynamic frameworks without generating cinterop bindings. If used with static frameworks, the option will remove the Pod dependency entirely.                                                                                                                                                        |
| `interopBindingDependencies` | Contains a list of dependencies to other Pods. This list is used when building a Kotlin binding for the new Pod.                                                                                                                                                                                                                                                |
| `useInteropBindingFrom()`    | Specifies the name of the existing Pod that is used as dependency. This Pod should be declared before the function execution. The function instructs the CocoaPods plugin to use a Kotlin binding of the existing Pod when building a binding for the new one.                                                                                                  |

```kotlin
kotlin {
    iosArm64()
   
    cocoapods {
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        iosArm64.deploymentTarget = "13.5"
      
        pod("pod_dependency") {
            version = "1.0"
            linkOnly = true
            source = path(project.file("../pod_dependency"))
        }
    }
}
```
