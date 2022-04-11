[//]: # (title: CocoaPods overview and setup)

Kotlin/Native provides integration with the [CocoaPods dependency manager](https://cocoapods.org/). You can add dependencies
on Pod libraries as well as use a multiplatform project with native targets as a CocoaPods dependency.

You can manage Pod dependencies directly in IntelliJ IDEA and enjoy all the additional features such as code highlighting 
and completion. You can build the whole Kotlin project with Gradle and not ever have to switch to Xcode. 

Use Xcode only when you need to write Swift/Objective-C code or run your application on a simulator or device.
To work correctly with Xcode, you should [update your Podfile](#update-podfile-for-xcode). 

Depending on your project and purposes, you can add dependencies between [a Kotlin project and a Pod library](native-cocoapods-libraries.md)
as well as [a Kotlin Gradle project and an Xcode project](native-cocoapods-xcode.md).

## Set up the environment to work with CocoaPods

1. Install the [CocoaPods dependency manager](https://cocoapods.org/):

    ```ruby
    $ sudo gem install cocoapods
    ```

2. Install the [`cocoapods-generate`](https://github.com/square/cocoapods-generate) plugin:

    ```ruby
    $ sudo gem install cocoapods-generate
    ```

> If you encounter any problems during the installation, follow the [official CocoaPods installation guide](https://guides.cocoapods.org/using/getting-started.html#getting-started)
> 
{type="note"}

## Add and configure Kotlin CocoaPods Gradle plugin

1. In `build.gradle(.kts)` of your project, apply the CocoaPods plugin as well as the Kotlin Multiplatform plugin:
    
    ```kotlin
    plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
       kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. Configure `version`, `summary`, `homepage`, and `baseName` of the Podspec file in the `cocoapods` block:
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // Required properties
            // Specify the required Pod version here. Otherwise, the Gradle project version is used.
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // Optional properties
            // Configure the Pod name here instead of changing the Gradle project name
            name = "MyCocoaPod"

            framework {
                // Required properties              
                // Framework name configuration. Use this property instead of deprecated 'frameworkName'
                baseName = "MyFramework"
                
                // Optional properties
                // Dynamic framework support
                isStatic = false
                // Dependency export
                export(project(":anotherKMMModule"))
                transitiveExport = false // This is default.
                // Bitcode embedding
                embedBitcode(BITCODE)
            }
            
            // Maps custom Xcode configuration to NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > See the full syntax of Kotlin DSL in the [Kotlin Gradle plugin repository](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt).
    >
    {type="note"}
    
3. Re-import the project.
4. Generate the [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) to avoid compatibility
issues during an Xcode build.

When applied, the CocoaPods plugin does the following:

* Adds both `debug` and `release` frameworks as output binaries for all macOS, iOS, tvOS, and watchOS targets.
* Creates a `podspec` task which generates a [Podspec](https://guides.cocoapods.org/syntax/podspec.html)
file for the project.

The `Podspec` file includes a path to an output framework and script phases that automate building this framework during 
the build process of an Xcode project.

## Update Podfile for Xcode

If you want to import your Kotlin project in an Xcode project, you need to make some changes to your Podfile:

* If your project has any Git, HTTP, or custom Podspec repository dependencies, you should also specify the path to
the Podspec in the Podfile.

    For example, if you add a dependency on `podspecWithFilesExample`, declare the path to the Podspec in the Podfile:

    ```ruby
    target 'ios-app' do
        # ... other depedencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample'
    end
    ```

    The `:path` should contain the filepath to the Pod.

* When you add a library from the custom Podspec repository, you should also specify the [location](https://guides.cocoapods.org/syntax/podfile.html#source)
of specs at the beginning of your Podfile:

    ```ruby
    source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

    target 'kotlin-cocoapods-xcproj' do
        # ... other depedencies ...
        pod 'example'
    end
    ```

> Re-import the project after making changes in the Podfile.
>
{type="note"}

If you don't make these changes to the Podfile, the `podInstall` task will fail, and the CocoaPods plugin will show
an error message in the log.

Check out the `withXcproject` branch of the [sample project](https://github.com/Kotlin/kmm-with-cocoapods-sample),
which contains an example of Xcode integration with an existing Xcode project named `kotlin-cocoapods-xcproj`.
