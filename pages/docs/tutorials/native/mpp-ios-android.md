---
type: tutorial
layout: tutorial
title:  "Multiplatform Project: iOS and Android"
description: "Sharing Kotlin code between iOS and Android"
authors: Eugene Petrenko
date: 2019-08-11
showAuthorInfo: false
issue: EVAN-6029
---

In this tutorial we will create an iOS and Android application, by making use of Kotlin's code sharing features.
For Android we'll be using Kotlin/JVM, while for iOS it will be Kotlin/Native. 

We'll learn how to:
 - Create an [Android app](#creating-an-android-project) with Android Studio
 - Create a shared [Kotlin library](#creating-the-shared-module)
   - Use it [from Android app](#using-sharedcode-from-android)
   - Start the [Android application](#running-the-android-application)
 - Create an [iOS app](#creating-ios-application) with Xcode
   - Use the shared Kotlin library [from iOS app](#setting-up-framework-dependency-in-xcode)
   - Use [Kotlin from Swift](#calling-kotlin-code-from-swift)
   - Start the [iOS application](#running-the-ios-application)

Our goal of this tutorial is to demonstrate the ability to share code within Kotlin and the benefits it provides. While 
what we'll be looking at is a simplified application, what is shown here can be applied to real world applications,
independent of their size or complexity.

The application we're going to create will simply show 
`Kotlin Rocks on Android` on Android and `Kotlin Rocks on iOS <version>` on iOS.
The idea is to share the code that generates this message.

The common code is `"Kotlin Rocks on ${platformName()}"`, where `platformName()` is 
a function that is declared using the `expect` keyword. The `actual` implementation will be specific to the platform.

# Setting Up the Local Environment

* We will be using [Android Studio](https://developer.android.com/studio/) for the Android part of the tutorial. 
It is also possible to use [IntelliJ IDEA](https://jetbrains.com/idea) Community or Ultimate edition.

* Kotlin plugin {{ site.data.releases.latest.version }} or higher should be installed in the IDE. This can be verified via
*Language & Frameworks | Kotlin Updates* section in the *Settings* (or *Preferences*) window.

* macOS host operating system is required to compile for iOS and macOS devices. We need to have
[Xcode](https://developer.apple.com/xcode/) and the tools installed and configured. Check out
the [Apple Developer Site](https://developer.apple.com/xcode/) for more details. 

*Note: We'll be using IntelliJ IDEA 2019.2, Android Studio 3.4,
Kotlin {{ site.data.releases.latest.version }}, Xcode 10.3, macOS 10.14, Gradle 5.5.1*

# Creating an Android Project

We need Android Studio for the tutorial. We may download and install it from the
[https://developer.android.com/studio/](https://developer.android.com/studio/). Let's start
the IDE and check if we see the fresh Kotlin version, namely 
{{ site.data.releases.latest.version }}
or newer under the Kotlin section _Languages & Frameworks_ | _Kotlin_
in the _Settings_ (or _Preferences_) dialog of Android Studio.

Our first step is to create a new Android project via the *Start a new Android project* item of the Android Studio home screen. 
We then proceed to select the *Empty Activity* option and click *Next*. It's important to pick the _Kotlin_
language in the wizard. Let's use the `com.jetbrains.handson.mpp.mobile` package
for the tutorial. Now we press the *Finish* button to create our new Android project.

<a name="gradle-upgrade"/>
Kotlin/Native plugin requires a newer version of Gradle, let's patch the `gradle/wrapper/gradle-wrapper.properties`
and use the following `distrubutionUrl`:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-5.5.1-all.zip
```

We need to refresh the Gradle Project settings to apply these changes. Click on the `Sync Now` link or 
use the *Gradle* tool window and click the refresh action from the context menu on the root Gradle project.

At this point, we should be able to compile and run the Android application

# Creating the Shared Module

The goal of the tutorial is to demonstrate Kotlin code re-use between Android and iOS. Let's start
by manually creating the `SharedCode` sub-project in our Gradle project. The source code from the `SharedCode`
project will be shared between platforms.
We will create several new files in our project to implement that.


## Updating Gradle Scripts

The `SharedCode` sub-project should generate several artifacts for us:
 - JAR file for the Android project, from the `androidMain` source set
 - Apple framework 
   - for iOS device and App Store (`arm64` target)
   - for iOS emulator (`x86_64` target)

Let's update the Gradle scripts now to implement that and configure our IDE. 

First, we add the new project into the `settings.gradle` file, simply by adding the following line to the end of the file:
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
include ':SharedCode'
```
</div>

Next,
we need to create the `SharedCode/build.gradle.kts` file with the following content:
 
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

plugins {
    kotlin("multiplatform")
}

kotlin {
    //select iOS target platform depending on the Xcode environment variables
    val iOSTarget: (String, KotlinNativeTarget.() -> Unit) -> KotlinNativeTarget =
        if (System.getenv("SDK_NAME")?.startsWith("iphoneos") == true)
            ::iosArm64
        else
            ::iosX64

    iOSTarget("ios") {
        binaries {
            framework {
                baseName = "SharedCode"
            }
        }
    }

    jvm("android")

    sourceSets["commonMain"].dependencies {
        implementation("org.jetbrains.kotlin:kotlin-stdlib-common")
    }

    sourceSets["androidMain"].dependencies {
        implementation("org.jetbrains.kotlin:kotlin-stdlib")
    }
}

val packForXcode by tasks.creating(Sync::class) {
    //selecting the right configuration for the iOS framework depending on the Xcode environment variables
    val mode = System.getenv("CONFIGURATION") ?: "DEBUG"
    val framework = kotlin.targets.getByName<KotlinNativeTarget>("ios").binaries.getFramework(mode)

    inputs.property("mode", mode)
    dependsOn(framework.linkTask)

    val targetDir = File(buildDir, "xcode-frameworks")
    from({ framework.outputDirectory })
    into(targetDir)

    doLast {
        val gradlew = File(targetDir, "gradlew")
        gradlew.writeText("#!/bin/bash\nexport 'JAVA_HOME=${System.getProperty("java.home")}'\ncd '${rootProject.rootDir}'\n./gradlew \$@\n")
        gradlew.setExecutable(true)
    }
}

tasks.getByName("build").dependsOn(packForXcode)
```
</div>

We need to refresh the Gradle Project settings to apply these changes. Click on the `Sync Now` link or 
use the *Gradle* tool window and click the refresh action from the context menu on the root Gradle project.
The `packForXcode` Gradle task is used for Xcode project integration. We will disuss it a bit later in that
tutorial.  

## Adding Kotlin Sources

The idea is to make every platform show similar text: `Kotlin Rocks on Android` and 
`Kotlin Rocks on iOS`, depending on the platform. We will reuse the way we generate the message. 
Let's create the file (and missing directories) `SharedCode/src/commonMain/kotlin/common.kt` with the following contents
under the project root directory

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.handson.mpp.mobile

expect fun platformName(): String

fun createApplicationScreenMessage() : String {
  return "Kotlin Rocks on ${platformName()}"
}

```
</div>

That is the common part. The code to generate the final message. It `expect`s the platform
to provide the platform name from the `expect fun platformName(): String` function. We will use
the `createApplicationScreenMessage` from both Android and iOS applications.

Now, we need to create the implementation file (and missing directories) for Android in the `SharedCode/src/androidMain/kotlin/actual.kt`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.handson.mpp.mobile

actual fun platformName(): String {
  return "Android"
}

```
</div>

We create a similar implementation file (and missing directories) for the iOS target in the `SharedCode/src/iosMain/kotlin/actual.kt`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.handson.mpp.mobile

import platform.UIKit.UIDevice

actual fun platformName(): String {
  return UIDevice.currentDevice.systemName() +
         " " +
         UIDevice.currentDevice.systemVersion
}
```
</div>

Here we can use the [UIDevice](https://developer.apple.com/documentation/uikit/uidevice?language=objc)
class from the Apple UIKit Framework, which is not available in Java, it is only usable in Swift and Objective-C.
Kotlin/Native compiler comes with a set of pre-imported frameworks, so we can use
the UIKit Framework without additional steps.
Objective-C and Swift Interop is covered in details in the [documentation](/docs/reference/native/objc_interop.html)

## Multiplatform Gradle Project

The `SharedCode/build.gradle.kts` file uses the `kotlin-multiplatform` plugin to implement 
what we need. 
In the file, we define several targets `common`, `android`, and `iOS`. Each
target has its own platform. The `common` target contains the Kotlin common code 
which is included into every platform compilation. It is allowed to have `expect` declarations.
Other targets provide `actual` implementations for all `expect`-actions from the `common` target. 
The more detailed explanation of the multiplatform projects can be found on the
[Multiplatform Projects](/docs/reference/building-mpp-with-gradle.html) documentation page.

Let's summarize what we have in the table:

| name | source folder | target | artifact |
|---|---|---|---|
| common | `SharedCode/commonMain/kotlin` |  - | Kotlin metadata |
| android | `SharedCode/androidMain/kotlin` | JVM 1.6 | `.jar` file or `.class` files |
| iOS | `SharedCode/iosMain` | iOS arm64 or x86_64| Apple framework |

Now it is time to refresh the Gradle project again in Android Studio. Click *Sync Now* on the yellow stripe 
or use the *Gradle* tool window and click the `Refresh` action in the context menu on the root Gradle project.
The `:SharedCode` project should be recognized by the IDE now.

We can use the `step-004` branch of the 
[github.com/kotlin-hands-on/mpp-ios-android](https://github.com/kotlin-hands-on/mpp-ios-android/tree/step-004)
repository as a solution for the tasks that we did above. We can also download the
[archive](https://github.com/kotlin-hands-on/mpp-ios-android/archive/step-004.zip) from GitHub directly
or check out the repository and select the branch.

Let's use the `SharedCode` library from our Android and iOS applications.

# Using SharedCode from Android

For this tutorial, we want to minimize Android project changes, so we add an ordinary dependency from that 
project to the `SharedCode` project.
It is also possible to use the `kotlin-multiplatform` plugin directly in an Android 
Gradle project, instead of the `kotlin-android` plugin. For more information, please refer to the
[Multiplatform Projects](/docs/reference/multiplatform.html) documentation.  

Let's include the dependency from the `SharedCode` project to the Android project. We need to patch
the `app/build.gradle` file and include the following line into the `dependencies { .. }` block:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
    implementation project(':SharedCode')
```
</div>

We need to
assign the `id` to the `TextView` control of our activity to access it from the code.
Let's patch the
`app/src/main/res/layout/activity_main.xml` file
(the name may be different if we changed it in the new project wizard). 
Select the _Text_ tab on the bottom of the preview to switch it to the XML source
and add several more attributes to the `<TextView>` element: 
```
        android:id="@+id/main_text"
        android:textSize="42sp"
        android:layout_margin="5sp"
        android:textAlignment="center"
```

Next, let's include the following line of code into the `MainActivity` class
from the `/app/src/main/java/com/jetbrains/handson/mpp/mobile/MainActivity.kt` file, to 
the end of the `onCreate` method:

```
findViewById<TextView>(R.id.main_text).text = createApplicationScreenMessage()
```

You will need to add the import for the `android.widget.TextView` class. Android Studio
will suggest to add the import automatically. Depending on the package of the Android application,
we may also need to add the import for the `createApplicationScreenMessage()` function too.
We should see these two lines at the beginning of the `MainActivity.kt` file:
```kotlin
import com.jetbrains.handson.mpp.mobile.createApplicationScreenMessage
import android.widget.TextView
```

Now we have the `TextView` that will show us the text created by the shared
code function `createApplicationScreenMessage()`. It shows `Kotlin Rocks on Android`.
Let's see how it works by running the Android application!

We can use the `step-005` branch of the 
[github.com/kotlin-hands-on/mpp-ios-android](https://github.com/kotlin-hands-on/mpp-ios-android/tree/step-005)
repository as a solution for the tasks that we did above. We can also download the
[archive](https://github.com/kotlin-hands-on/mpp-ios-android/archive/step-005.zip) from GitHub directly
or check out the repository and select the branch.

## Running the Android Application

Let's click on the `App` run configuration
to get our project running either on a real Android Device or on the emulator. 

![Start the Application]({{ url_for('tutorial_img', filename='native/mpp-ios-android/studio-start-app.png') }})

And so now we can see the Application running in the Android emulator:
    
![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/android-emulator-kotlin-rocks-android.png') }}){: width="30%"}


# Creating iOS Application

We open Xcode and select *Create a new Xcode project* option. In 
the dialog, we choose the iOS target and select the *Single View App* and click next. Fill the next page with defaults, 
and use the `KotlinIOS` as the *Product Name*. Let's select _Swift_ as the language (it is possible to use
Objective-C too). Use the `com.jetbrains.handson.mpp.mobile` string for the _Organization Identifier_ field.
Now the _Next_ button should be available and we click on it.
In the file picker dialog, that is shown after the click, we need to select the root folder
of our project (it is shown at many places in AndroidStudio), click the _New Folder_ button and
create the folder called `native` un it. The folder should be selected now and we may click _Create_
button to complete the dialog. Later in the tutorial, we will use relative paths in the configuration files. 

The created iOS application is ready to run on the iOS simulator or on the iOS device. The device run
may require an Apple developer account and a developer certificate. Xcode does its
best to guide us through the process. 

Let's make sure we can run the application on the iPhone simulator or device by clicking a play button
from the XCode window title bar. 

The `step-006` branch of the 
[github.com/kotlin-hands-on/mpp-ios-android](https://github.com/kotlin-hands-on/mpp-ios-android/tree/step-006)
repository contains a possible solution for the tasks that we did above. One can also download the
[archive](https://github.com/kotlin-hands-on/mpp-ios-android/archive/step-006.zip) from GitHub directly or
check out the repository and select the branch.

# Setting up Framework Dependency in Xcode

Let's run the `packForXcode` Gradle task of the `SharedCode` project. We may do that either from
the _Gradle_ tab in AndroidStudio or by running the `./gradlew :SharedCode:packForXcode` command
from console. That task is designed to help to simplify the setup of our iOS Framework
into Xcode project model.

One needs several binaries of a framework to use it with Xcode:
- `iOS arm64 debug` --- the binary to run in iOS device in debug mode
- `iOS arm64 release` --- the binary to include into a release version of an app
- `iOS x64 debug` --- the binary for iOS simulator, which uses the desktop mac CPU

The easiest way to configure Xcode is to use a custom built framework is to
place the framework under the same folder for all configurations and targets
and to add a custom step into the Xcode project build to update or build that
framework before the actual Xcode build is started. Xcode sets several environment
variables for custom steps, we use these variables in the Gradle script to select
the requested target platform and the configuration. For more details,
please refer to the `packForXcode` task sources in the `SharedCode/build.gradle.kts` file. 

Let's switch back to the Android Studio and execute the `build` target of the `SharedCode` project from
the *Gradle* tool window. The task looks for environment variables set by the Xcode build and copies
the right variant of the framework into the `SharedCode/build/xcode-frameworks` folder. We then include the
framework from that folder into the build

## Setting up Xcode

We add the `SharedCode` framework to the Xcode project.
For that let's double-click on the the `KotlinIOS` node (or root node) of the *project navigator (⌘1)* tree
to open the *target* settings.
Next, we click on the `+` in the *Embedded Binaries* section, click *Add Other...* button in the dialog
to choose the framework from the disk. We can point to the following folder: 
```
SharedCode/build/xcode-frameworks/SharedCode.framework
```

In the next dialog we should select the _Create folder references_ option and make sure the _Copy items if needed_
checkbox is unchecked. We will then see something similar to this: 
![Xcode General Screen]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-general.png') }})

Now we need to explain to Xcode, where to look for the framework.
For that, we open the *Build Settings* tab again, pick the *All* sub-tab below, and type the *Framework Search Paths* into
the search field to easily find the option. We need to add the *relative* path 
`$(SRCROOT)/../../SharedCode/build/xcode-frameworks` into the *Search Paths | Framework Search Paths* section.
Xcode will then show the substituted path in the UI for it.

![Xcode Build Settings]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-search-path.png') }})

The final step is to make Xcode call our Gradle build to prepare the `SharedCode` framework before each run.
We open the *Build Phases* tab and click `+` to add the *New Run Script Phase*, drag that step to the very
first position, and add the following code into the shell script text area:

<div class="sample" markdown="1" mode="bash" theme="idea" data-highlight-only="1" auto-indent="false">

```bash
cd "$SRCROOT/../../SharedCode/build/xcode-frameworks"
./gradlew :SharedCode:packForXCode -PXCODE_CONFIGURATION=${CONFIGURATION}
```
</div>

Note, here we use the `$SRCROOT/../..` as the path to the root of our Gradle project.
It can depend on the way the Xcode project was created. Also, we use the generated
`SharedCode/build/xcode-frameworks/gradlew` script,
the `packForXCode` task generates it. We assumed that the Gradle build is executed at least once,
*before* opening the Xcode project on a fresh machine.

The `step-007` branch of the 
[github.com/kotlin-hands-on/mpp-ios-android](https://github.com/kotlin-hands-on/mpp-ios-android/tree/step-007)
repository contains a possible solution for the tasks that we did above. One can also download the
[archive](https://github.com/kotlin-hands-on/mpp-ios-android/archive/step-007.zip) from GitHub directly or
check out the repository and select the branch.

![Xcode Build Phases]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-run-script.png') }})

We should drag the created build phase to the top of the list

![Xcode Build Phases]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-run-script-order.png') }})

We are now ready to start coding the iOS application and to use the Kotlin code from it

## Calling Kotlin Code from Swift

Remember, our goal is to show the text message on the screen. As we see, our iOS application does not draw
anything on the screen. Let's make it show the `UILabel` with the text message.
Let's open the `ViewController.swift` file from the *project navigator (⌘1)* tree.
We need to replace the contents of the `ViewController.swift` filewith the following code:
 
<div class="sample" markdown="1" mode="swift" theme="idea" data-highlight-only="1" auto-indent="false">

```swift
import UIKit
import SharedCode

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let label = UILabel(frame: CGRect(x: 0, y: 0, width: 300, height: 21))
        label.center = CGPoint(x: 160, y: 285)
        label.textAlignment = .center
        label.font = label.font.withSize(25)
        label.text = CommonKt.createApplicationScreenMessage()
        view.addSubview(label)
    }
}
```
</div>
 
We use the `import SharedCode` to import our Framework, which we compiled with Kotlin/Native from Kotlin code.
Next, we call the Kotlin function from it as `CommonKt.createApplicationScreenMessage()`. Follow the 
[Kotlin/Native as an Apple Framework](/docs/tutorials/native/apple-framework.html) tutorial for
more details on the Kotlin/Native to Swift (or Objective-C) interop.


The `step-008` branch of the 
[github.com/kotlin-hands-on/mpp-ios-android](https://github.com/kotlin-hands-on/mpp-ios-android/tree/step-008)
repository contains a possible solution for the tasks that we did above. One can also download the
[archive](https://github.com/kotlin-hands-on/mpp-ios-android/archive/step-008.zip) from GitHub directly or
check out the repository and select the branch.

Right now, we are ready to start the application in the emulator or on an iOS device.

## Running the iOS Application

Let's click the *Run* button in Xcode, and we'll see our application running 

![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/iPhone-emulator-kotlin-rocks.png') }}){: width="30%"}

# Summary

In the tutorial we:
 - created an Android application in Android Studio
 - created an iOS application in Xcode
 - added Kotlin multiplatform sub-project  
   - with shared Kotlin code
   - compiled it to Android Jar
   - compiled it to iOS Framework
 - put it all together and re-used Kotlin code
 
We may find the whole sources from that tutorial on [GitHub](https://github.com/JetBrains/kotlin-examples/tree/master/tutorials/mpp-iOS-Android).

# Next Steps

This is only the beginning and a small example of Kotlin code sharing
between iOS and Android (and other platforms) with Kotlin, Kotlin/Native
and Kotlin multiplatform projects. The same approach works for real applications,
independent of their size or complexity.

Kotlin/Native interop with Swift and Objective-C is covered in the
[documentation](/docs/reference/native/objc_interop.html) article. Also,
the same topic is covered in the [Kotlin/Native as an Apple Framework](apple-framework.html)
tutorial.

The multiplatform projects and multiplatform libraries are discussed in the [documentation](/docs/reference/multiplatform.html) too.

Sharing code between platforms is a powerful technique, but it may be hard to
accomplish without rich APIs that we have in Android, JVM, or iOS platforms.
Multiplatform libraries can be used to fix that. They bring rich APIs
directly in the common Kotlin code. There are several examples of such libraries:  

- [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines/blob/master/native/README.md)
- [kotlinx.io](https://github.com/Kotlin/kotlinx-io)
- [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
- [ktor](https://ktor.io/)
- [ktor-http-client](https://ktor.io/clients/http-client.html)

Looking for more APIs? It is easy to create a [multiplatform library](/docs/tutorials/multiplatform-library.html) and share it!
