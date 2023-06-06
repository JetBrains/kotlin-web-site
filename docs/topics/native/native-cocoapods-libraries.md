[//]: # (title: Add dependencies on a Pod library)

To add dependencies between a Kotlin project and a Pod library, [complete the initial configuration](native-cocoapods.md#set-up-an-environment-to-work-with-cocoapods).
You can then add dependencies on different types of Pod libraries.

When you add a new dependency and re-import the project in IntelliJ IDEA, the new dependency will be added automatically.
No additional steps are required.

To use your Kotlin project with Xcode, you should [make changes in your project Podfile](native-cocoapods.md#update-podfile-for-xcode).

A Kotlin project requires the `pod()` function call in `build.gradle(.kts)` for adding a Pod dependency.
Each dependency requires its separate function call. You can specify the parameters for the dependency in
the configuration block of the function.

> If you don't specify the minimum deployment target version and a dependency Pod requires a higher deployment target,
> you will get an error.
>
{type="note"}

You can find a sample project [here](https://github.com/Kotlin/kmm-with-cocoapods-sample).

## From the CocoaPods repository

1. Specify the name of a Pod library in the `pod()` function.
   
   In the configuration block, you can specify the version of the library using the `version` parameter. To use the latest
version of the library, you can just omit this parameter altogether.

   > You can add dependencies on subspecs.
   >
   {type="note"}

2. Specify the minimum deployment target version for the Pod library.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            ios.deploymentTarget = "13.5"

            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            pod("Alamofire") {
                version = "~> 5.7.0"
            }
        }
    }
    ```

3. Re-import the project.

To use these dependencies from the Kotlin code, import the packages `cocoapods.<library-name>`:

```kotlin
import cocoapods.Alamofire.*
```

## On a locally stored library

1. Specify the name of a Pod library in the `pod()` function.

   In the configuration block, specify the path to the local Pod library: use the `path()` function in the `source` parameter value.

   > You can add local dependencies on subspecs as well.
   > The `cocoapods` block can include dependencies to Pods stored locally and Pods from the CocoaPods repository at
   > the same time.
   >
   {type="note"}

2. Specify the minimum deployment target version for the Pod library.

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
            pod("subspec_dependency/Core") {
                version = "1.0"
                source = path(project.file("../subspec_dependency"))
            }
            pod("Alamofire") {
                version = "~> 5.7.0"
            }
        }
    }
    ```

   > You can also specify the version of the library using `version` parameter in the configuration block.
   > To use the latest version of the library, omit the parameter.
   >
   {type="note"}

3. Re-import the project.

To use these dependencies from the Kotlin code, import the packages `cocoapods.<library-name>`:

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.Alamofire.*
```

## From a custom Git repository

1. Specify the name of a Pod library in the `pod()` function.

   In the configuration block, specify the path to the git repository: use the `git()` function in the `source` parameter value.

   Additionally, you can specify the following parameters in the block after `git()`:
    * `commit` – to use a specific commit from the repository
    * `tag` – to use a specific tag from the repository
    * `branch` – to use a specific branch from the repository

   The `git()` function prioritizes passed parameters in the following order: `commit`, `tag`, `branch`.
   If you don't specify a parameter, the Kotlin plugin uses `HEAD` from the `master` branch.

   > You can combine `branch`, `commit`, and `tag` parameters to get the specific version of a Pod.
   >
   {type="note"}

2. Specify the minimum deployment target version for the Pod library.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            pod("Alamofire") {
                source = git("https://github.com/Alamofire/Alamofire") {
                    tag = "5.7.0"
                }
            }

            pod("JSONModel") {
                source = git("https://github.com/jsonmodel/jsonmodel.git") {
                    branch = "key-mapper-class"
                }
            }

            pod("CocoaLumberjack") {
                source = git("https://github.com/CocoaLumberjack/CocoaLumberjack.git") {
                    commit = "3e7f595e3a459c39b917aacf9856cd2a48c4dbf3"
                }
            }
        }
    }
    ```

3. Re-import the project.

To use these dependencies from the Kotlin code, import the packages `cocoapods.<library-name>`:

```kotlin
import cocoapods.Alamofire.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## From a custom Podspec repository

1. Specify the HTTP address to the custom Podspec repository using the `url()` inside the `specRepos` block.

2. Specify the name of a Pod library in the `pod()` function.

3. Specify the minimum deployment target version for the Pod library.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            specRepos {
                url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
            }
            pod("example")
        }
    }
    ```

4. Re-import the project.

> To work correctly with Xcode, you should specify the location of specs at the beginning of your Podfile.
> For example,
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{type="note"}

To use these dependencies from the Kotlin code, import the packages `cocoapods.<library-name>`:

```kotlin
import cocoapods.example.*
```

## With custom cinterop options

1. Specify the name of a Pod library in the `pod()` function.

   In the configuration block, specify the cinterop options:
   * `extraOpts` – to specify the list of options for a Pod library. For example, specific flags: `extraOpts = listOf("-compiler-option")`.
   * `packageName` – to specify the package name. If you specify this, you can import the library using the package name:
     `import <packageName>`.

2. Specify the minimum deployment target version for the Pod library.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            pod("YandexMapKit") {
                packageName = "YandexMK"
            }
        }
    }
    ```

3. Re-import the project.

To use these dependencies from the Kotlin code, import the packages `cocoapods.<library-name>`:
   
```kotlin
import cocoapods.YandexMapKit.*
```
   
If you use the `packageName` parameter, you can import the library using the package name `import <packageName>`:
   
```kotlin
import YandexMK.YMKPoint
import YandexMK.YMKDistance
```

### Support for Objective-C headers with @import directives

> This feature is [Experimental](components-stability.md#stability-levels-explained).
> It may be dropped or changed at any time. Use it only for evaluation purposes.
> We'd appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

Some Objective-C libraries, specifically those that serve as wrappers for Swift libraries,
have `@import` directives in their headers. By default, cinterop doesn't provide support for these directives.

To enable support for `@import` directives, specify the `-fmodules` option in the configuration block of the `pod()` function:

```kotlin
kotlin {
    ios()

    cocoapods {
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "13.5"

        pod("PodName") {
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

### Dependencies between Pods

You can use the cinterop binding generated for another Pod when building a binding for the new Pod.
The dependent Pod should be declared before setting up the dependency. The Kotlin CocoaPods Gradle plugin supports two ways
of adding dependencies between Pods:

* `useInteropBindingFrom()` function specifies the name of the existing Pod that is used as dependency.
* `interopBindingDependencies` contains a list of all dependencies to other Pods.

```kotlin
pod("WebImage") {
    version = "~> 1.0.0"
}

pod("Info") {
    version = "~> 1.0.0"
    
    // Option 1. Specify the name of the previously declared Pod: 
    useInteropBindingFrom("WebImage")

    // Option 2. Add the previously declared Pod to the list of dependencies: 
    interopBindingDependencies.add("WebImage")
}
```