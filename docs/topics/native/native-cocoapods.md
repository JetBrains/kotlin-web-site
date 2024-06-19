[//]: # (title: CocoaPods overview and setup)

Kotlin/Native provides integration with the [CocoaPods dependency manager](https://cocoapods.org/). You can add dependencies
on Pod libraries as well as use a multiplatform project with native targets as a CocoaPods dependency.

You can manage Pod dependencies directly in IntelliJ IDEA or Android Studio and enjoy all the additional features such as
code highlighting and completion. You can build the whole Kotlin project with Gradle and not ever have to switch to Xcode. 

You'll only need Xcode if you want to change Swift/Objective-C code or run your application on an Apple simulator or device.
To work correctly with Xcode, you should [update your Podfile](#update-podfile-for-xcode). 

Depending on your project and purposes, you can add dependencies between [a Kotlin project and a Pod library](native-cocoapods-libraries.md)
as well as [a Kotlin Gradle project and an Xcode project](native-cocoapods-xcode.md).

## Set up an environment to work with CocoaPods

Install the [CocoaPods dependency manager](https://cocoapods.org/) using the installation tool of your choice:

<tabs>
<tab title="RVM">

1. Install [Ruby version manager](https://rvm.io/rvm/install) in case you don't have it yet.
2. Install Ruby. You can choose a specific version:

    ```bash
    rvm install ruby 3.0.0
    ```

3. Install CocoaPods:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="Rbenv">

1. Install [rbenv from GitHub](https://github.com/rbenv/rbenv#installation) in case you don't have it yet.
2. Install Ruby. You can choose a specific version:

    ```bash
    rbenv install 3.0.0
    ```

3. Set the Ruby version as local for a particular directory or global for the whole machine:

    ```bash
    rbenv global 3.0.0
    ```
    
4. Install CocoaPods:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="Default Ruby">

> This way of installation doesn't work on devices with Apple M chips. Use other tools to set up an environment to work
> with CocoaPods.
>
{type="note"}

You can install the CocoaPods dependency manager with the default Ruby that should be available on macOS:

```bash
sudo gem install cocoapods
```

</tab>
<tab title="Homebrew">

> The CocoaPods installation with Homebrew might result in compatibility issues.
>
> When installing CocoaPods, Homebrew also installs the [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem that is
> necessary for working with Xcode.
> However, it cannot be updated with Homebrew, and if the installed Xcodeproj doesn't support the newest Xcode version yet,
> you'll get errors with Pod installation. If this is the case, try other tools to install CocoaPods.
>
{type="warning"}

1. Install [Homebrew](https://brew.sh/) in case you don't have it yet.

2. Install CocoaPods:

    ```bash
    brew install cocoapods
    ```

</tab>
</tabs>

If you encounter problems during the installation, check the [Possible issues and solutions](#possible-issues-and-solutions) section.

## Add and configure Kotlin CocoaPods Gradle plugin

If your environment is set up correctly, you can [create a new Kotlin Multiplatform project](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
and choose **CocoaPods Dependency Manager** as the iOS framework distribution option. The plugin will automatically generate the project for you.

If you want to configure your project manually:

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
                // Specify the framework linking type. It's dynamic by default. 
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
    
3. Run **Reload All Gradle Projects** in IntelliJ IDEA (or **Sync Project with Gradle Files** in Android Studio)
   to re-import the project.
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
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample'
    end
    ```

    The `:path` should contain the filepath to the Pod.

* When you add a library from the custom Podspec repository, you should also specify the [location](https://guides.cocoapods.org/syntax/podfile.html#source)
of specs at the beginning of your Podfile:

    ```ruby
    source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

    target 'kotlin-cocoapods-xcproj' do
        # ... other dependencies ...
        pod 'example'
    end
    ```

> After making changes in the Podfile, run **Reload All Gradle Projects** in IntelliJ IDEA
> (or **Sync Project with Gradle Files** in Android Studio) to re-import the project.
>
{type="note"}

If you don't make these changes to the Podfile, the `podInstall` task will fail, and the CocoaPods plugin will show
an error message in the log.

## Possible issues and solutions

### CocoaPods installation {initial-collapse-state="collapsed"}

#### Ruby installation

CocoaPods is built with Ruby, and you can install it with the default Ruby that should be available on macOS.
Ruby 1.9 or later has a built-in RubyGems package management framework that helps you install the [CocoaPods dependency manager](https://guides.cocoapods.org/using/getting-started.html#installation).

If you're experiencing problems installing CocoaPods and getting it to work, follow [this guide](https://www.ruby-lang.org/en/documentation/installation/)
to install Ruby or refer to the [RubyGems website](https://rubygems.org/pages/download/) to install the framework.

#### Version compatibility

We recommend using the latest Kotlin version. If your current version is earlier than 1.7.0, you'll need to additionally
install the [`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation") plugin.

However, `cocoapods-generate` is not compatible with Ruby 3.0.0 or later. In this case, downgrade Ruby or upgrade Kotlin
to 1.7.0 or later.

### Build errors when using Xcode {initial-collapse-state="collapsed"}

Some variations of the CocoaPods installation can lead to build errors in Xcode.
Generally, the Kotlin Gradle plugin discovers the `pod` executable in `PATH`, but this may be inconsistent depending on
your environment.

To set the CocoaPods installation path explicitly, you can add it to the `local.properties` file of your project
manually or using a shell command:

* If using a code editor, add the following line to the `local.properties` file:

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* If using a terminal, run the following command:

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### Module not found {initial-collapse-state="collapsed"}

You may encounter a `module 'SomeSDK' not found` error that is connected with the [C-interop](native-c-interop.md) issue.
Try these workarounds to avoid this error:

#### Specify the framework name 

1. Look through the downloaded Pod directory `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...`
   for the `module.modulemap` file.
2. Check the framework name inside the module, for example `AppsFlyerLib {}`. If the framework name doesn't match the Pod
name, specify it explicitly:

    ```kotlin
    pod("FirebaseAuth") {
        moduleName = "AppsFlyerLib"
    }
    ```
#### Specify headers

If the Pod doesn't contain a `.modulemap` file, like the `pod("NearbyMessages")`, specify the main header explicitly:

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

Check the [CocoaPods documentation](https://guides.cocoapods.org/) for more information. If nothing works, and you still
encounter this error, report an issue in [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt).

### Rsync error {initial-collapse-state="collapsed"}

You might encounter the `rsync error: some files could not be transferred` error. It's a [known issue](https://github.com/CocoaPods/CocoaPods/issues/11946)
that occurs if the application target in Xcode has sandboxing of the user scripts enabled.

To solve this issue:

1. Disable sandboxing of user scripts in the application target:

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png){width=700}

2. Stop the Gradle daemon process that might have been sandboxed:

    ```shell
    ./gradlew --stop
    ```
