[//]: # (title: Cocoapods Gradle plugin DSL reference)

Kotlin Cocoapods Gradle plugin is a tool for creating podspec files. The generated podspec integrates your project with
[CocoaPods dependency manager](https://cocoapods.org/).

Here we provide a reference of its contents; use it as a reminder when working with the CocoaPods integration.

* Learn how to [set up the environment](native-cocoapods.md#set-up-the-environment-to-work-with-cocoapods) and
[configure Kotlin Cocoapods Gradle plugin](native-cocoapods.md#add-and-configure-kotlin-cocoapods-gradle-plugin).
* Depending on your project and purposes, you can add dependencies between [a Kotlin project and a Pod library](native-cocoapods-libraries.md)
as well as [a Kotlin Gradle project and an Xcode project](native-cocoapods-xcode.md).


## ID and version

To apply the CocoaPods plugin, add the following lines to the `build.gradle(.kts)` file:

```kotlin
plugins {
   kotlin("multiplatform") version "%kotlinVersion%"
   kotlin("native.cocoapods") version "%kotlinVersion%"
}
```

The plugin versions match the Kotlin release versions. The most recent version is %kotlinVersion%.

## The `cocoapods` block

The `cocoapods` block is the top-level block for the Cocoapods configuration. Inside it, you can use the following blocks,
functions and properties:

| **Name**                              | **Description**                                                                                                                                                                                 | 
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | The version of the pod. If not specified, a Gradle project version is used. If none of these properties are configured, you'll get an error.                                                    |
| `authors`                             | Specifies authors of the pod built from this project.                                                                                                                                           |
| `podfile`                             | Configures the existing pod file.                                                                                                                                                               |
| `noPodspec()`                         | Sets up plugin not to produce a podspec file for the cocoapods section.                                                                                                                         |
| `useLibraries()`                      | Sets up `cocoapods-generate` to produce `xcodeproj` compatible with static libraries                                                                                                            |
| `name`                                | The name of the pod built from this project.                                                                                                                                                    |
| `license`                             | The license of the pod built from this project.                                                                                                                                                 |
| `summary`                             | A description of the pod built from this project.                                                                                                                                               |
| `homepage`                            | A link to the homepage of the pod built from this project.                                                                                                                                      |
| `framework`                           | The framework of the pod built from this project                                                                                                                                                |
| `source`                              | The location of the pod built from this project.                                                                                                                                                |
| `extraSpecAttributes`                 | Configures other podspec attributes, like `libraries` or `vendored_frameworks`.                                                                                                                 |
| `xcodeConfigurationToNativeBuildType` | Maps custom Xcode configuration to NativeBuildType — "Debug" to `NativeBuildType.DEBUG`, "Release" to `NativeBuildType.RELEASE`                                                                 |
| `publishDir`                          | Configures the output directory for pod publishing.                                                                                                                                             |
| `pods`                                | Returns a list of pod dependencies.                                                                                                                                                             |
| `pod()`                               | Adds a CocoaPods dependency to the pod built from this project.                                                                                                                                 |
| `specRepos`                           | Adds a CocoaPods dependency from a custom Podspec repository using `url()`. See the [cocoapods documentation](https://guides.cocoapods.org/making/private-cocoapods.html) for more information. |

### Targets

* `ios`
* `osx`
* `tvos`
* `watchos`

For each target, use the `deploymentTarget` property to specify the minimum target version for the Pod library.

When applied, CocoaPods adds both `debug` and `release` frameworks as output binaries for all the targets.

```kotlin
kotlin {
    ios()
   
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

### The `framework()` block

You can configure the framework properties of the pod built from this project in the `framework` block. Note that
`baseName` is a mandatory field.

| **Name**           | **Description**                                                                  | 
|--------------------|----------------------------------------------------------------------------------|
| `baseName`         | The framework name. Use this property instead of the deprecated `frameworkName`. |
| `isStatic`         | Enables dynamic framework support.                                               |
| `transitiveExport` | Enables dependency export.                                                       |                                                      

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

## The `pod()` function

The `pod()` function call adds a CocoaPods dependency to the pod built from this project. Each dependency requires
a separate function call.

You can specify the name of a Pod library in the function parameters and additional parameter values, like `version` and
`source` of the library in its configuration block.

| **Name**      | **Description**                                                                                                                                                                                                                                                                                                                                                                     | 
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`     | The library version. To use the latest version of the library, omit the parameter.                                                                                                                                                                                                                                                                                                  |
| `source`      | Configures the pod from: <list><ul><li>The Git repository using `git()`. In the block after `git()`, you can specify `commit` – to use a specific commit, `tag` – to use a specific tag, and `branch` – to use a specific branch from the repository</li><li>From the local repository using `path()`</li><li>An archived (tar, jar, zip) pod folder using `url()`</li></ul></list> |
| `packageName` | Specifies the package name.                                                                                                                                                                                                                                                                                                                                                         |
| `extraOpts`   | Specifies the list of options for a Pod library. For example, specific flags: `extraOpts = listOf("-compiler-option")`.                                                                                                                                                                                                                                                             |

```kotlin
kotlin {
    ios()
   
    cocoapods {
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
      
        ios.deploymentTarget = "13.5"
      
        pod("pod_dependency") {
            version = "1.0"
            source = path(project.file("../pod_dependency"))
        }
    }
}
```