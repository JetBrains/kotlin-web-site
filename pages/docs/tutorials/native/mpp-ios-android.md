---
type: tutorial
layout: tutorial
title:  "Multiplatform Project: iOS and Android"
description: "Sharing Kotlin code between iOS and Android"
authors: Eugene Petrenko
date: 2018-10-04
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

* Kotlin plugin 1.3.x or higher should be installed in the IDE. This can be verified via
*Language & Frameworks | Kotlin Updates* section in the *Settings* (or *Preferences*) of the IDE.

* macOS host operating system is required to compile for iOS and macOS devices. We need to have
[Xcode](https://developer.apple.com/xcode/) and the tools installed and configured. Check out
the [Apple Developer Site](https://developer.apple.com/xcode/) for more details. 

*Note: We'll be using IntelliJ IDEA 2018.3 EAP, Android Studio 3.2, Kotlin 1.3.0, Xcode 10.0, macOS 10.14, Gradle 4.10.2*

# Creating an Android Project

We'll create a new Android project via *Start New Android Project* item. If using IntelliJ IDEA, we need to select *Android* in 
the left panel of the *New Project* wizard. 

It's important to make sure that the *Include Kotlin support* checkbox is ticked. For now we can leave the default settings 
in the next step of the wizard. We then proceed to select the *Empty Activity* option and click *Next*, finally pressing *Finish*.  

**Note** If using pre-release or EAP versions of the Kotlin plugin, the IDE may fail to open the generated project, 
giving a Gradle import [error](https://youtrack.jetbrains.com/issue/KT-18835#focus=streamItem-27-2718879-0-0).
This is because the right Maven repository isn't referenced in the `build.gradle` file, it can be resolved by adding 
the following entry *twice*, into each of the `repositories { .. }` blocks.

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
maven { url 'https://dl.bintray.com/kotlin/kotlin-eap' }
```
</div>

<a name="gradle-upgrade"/>
Kotlin/Native plugin requires a newer version of Gradle, let's patch the `gradle/wrapper/gradle-wrapper.properties`
and use the following `distrubutionUrl`:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.2-all.zip
```

We need to refresh the Gradle Project settings to apply these changes. Click on the `Sync Now` link or 
use the *Gradle* tool window and click the refresh action from the context menu on the root Gradle project.

At this point, we should be able to compile and run the Android application

# Creating the Shared Module

The goal of the tutorial is to demonstrate Kotlin code re-use between Android and iOS. Let's start
by creating the `SharedCode` project with the code we will share between platforms. 
We will create several new files in our project.

## Adding Kotlin Sources

The idea is to make every platform show similar text: `Kotlin Rocks on Android` and 
`Kotlin Rocks on iOS`, depending on the platform. We will reuse the way we generate the message. 
Let's create the main file under `SharedCode/src/commonMain/kotlin/common.kt`

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package org.kotlin.mpp.mobile

expect fun platformName(): String

fun createApplicationScreenMessage() : String {
  return "Kotlin Rocks on ${platformName()}"
}

```
</div>

That is the common part. The code to generate the final message. It `expect`s the platform
to provide the platform name from the `expect fun platformName(): String` function. We will use
the `createApplicationScreenMessage` from both Android and iOS applications.

Now, we need to create the implementation for Android in the `SharedCode/src/androidMain/kotlin/actual.kt`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package org.kotlin.mpp.mobile

actual fun platformName(): String {
  return "Android"
}

```
</div>

We create a similar file for the iOS target in the `SharedCode/src/iosMain/kotlin/actual.kt`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package org.kotlin.mpp.mobile

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

## Updating Gradle Scripts

The `SharedCode` project should generate several artifacts for us:
 - JAR file for the Android project, from the `androidMain` source set
 - Apple framework 
   - for iOS device and App Store (`arm64` target)
   - for iOS emulator (`x86_64` target)

Let's update the Gradle scripts. 

First, we add the new project into the `settings.gradle` file, simply by adding the following line to the end of the file:
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
include ':SharedCode'
```
</div>

Next,
we need to create the `SharedCode/build.gradle` file with the following content:
 
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
apply plugin: 'kotlin-multiplatform'

kotlin {
    targets {
        final def iOSTarget = System.getenv('SDK_NAME')?.startsWith("iphoneos") \
                              ? presets.iosArm64 : presets.iosX64

        fromPreset(iOSTarget, 'iOS') {
            compilations.main.outputKinds('FRAMEWORK')
        }

        fromPreset(presets.jvm, 'android')
    }

    sourceSets {
        commonMain.dependencies {
            api 'org.jetbrains.kotlin:kotlin-stdlib-common'
        }

        androidMain.dependencies {
            api 'org.jetbrains.kotlin:kotlin-stdlib'
        }
    }
}

// workaround for https://youtrack.jetbrains.com/issue/KT-27170
configurations {
    compileClasspath
}

```
</div>

## Multiplatform Gradle Project

The `SharedCode/build.gradle` file uses the `kotlin-multiplatform` plugin to implement 
what we need. 
In the file, we define several targets `common`, `android`, and `iOS`. Each
target has its own platform. The `common` target contains the Kotlin common code 
which is included into every platform compilation. It is allowed to have `expect` declarations.
Other targets provide `actual` implementations for all `expect`-actions from the `common` target. 
The more detailed explanation of the multiplatform projects can be found on the
[Multiplatform Projects](/docs/reference/building-mpp-with-gradle.html) documentation page.

Let's summarize what we have in the table:

| name | source folder | target | artifact |
|---|---|---|
| common | `SharedCode/commonMain/kotlin` |  - | Kotlin metadata |
| android | `SharedCode/androidMain/kotlin` | JVM 6 | `.jar` file or `.class` files |
| iOS | `SharedCode/iOSMain` | iOS arm64 or x86_64| Apple framework |

Now it is time to refresh the Gradle project again in Android Studio. Click *Sync Now* on the yellow stripe 
or use the *Gradle* tool window and click the `Refresh` action in the context menu on the root Gradle project.
The `:SharedCode` project should be recognized by the IDE now.

We are ready to use the `SharedCode` library from our Android and iOS applications.

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
(the name may be different if we changed it in the new project wizard)
and add several more attributes to the `<TextView>` element: 
```
        android:id="@+id/main_text"
        android:textSize="42sp"
        android:layout_margin="5sp"
        android:textAlignment="center"
```

Next, let's include the following line of code into the `MainActivity` class
from the `/app/src/main/java/<package>/MainActivity.kt` file, to 
the end of the `onCreate` method:

```
findViewById<TextView>(R.id.main_text).text = createApplicationScreenMessage()
```

Use the intention from the IDE to include the missing import line:
```kotlin
import org.kotlin.mpp.mobile.createApplicationScreenMessage
```
into the same file. 

Now we have the `TextView` that will show us the text created by the shared
code function `createApplicationScreenMessage()`. It shows `Kotlin Rocks on Android`.
Let's see how it works. 

## Running the Android Application

Let's click on the `App` run configuration
to get our project running either on a real Android Device or on the emulator. 

![Start the Application]({{ url_for('tutorial_img', filename='native/mpp-ios-android/studio-start-app.png') }})

And so now we can see the Application running in the Android emulator:
    
![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/android-emulator-kotlin-rocks-android.png') }}){: width="30%"}


# Creating iOS Application

We open Xcode and select *Create a new Xcode project* option. In 
the dialog, we choose the iOS target and select the *Single View App*. Fill the next page with defaults, 
and use the `KotlinIOS` (or something else) as the *Product Name*. Let's select Swift as the language (it is possible to use
Objective-C too). We should instruct Xcode to place the project into the `native` folder under our project, later we
will use relative paths in the configuration files. 

The created iOS application is ready to run on the iOS emulator or on the iOS device. The device run
may require an Apple developer account and to issue a developer certificate. Xcode does its
best to guide us through the process. 

Let's make sure we can run the application on the iPhone emulator or device. 


# Setting up Framework Dependency in Xcode

The `SharedCode` build generates iOS frameworks for use with the Xcode project.
All frameworks are in the `SharedCode/build/bin` folder. 
It creates a *debug* and *release* version for every framework target.
The frameworks are in the following paths:
```
SharedCode/build/bin/iOS/main/debug/framework/SharedCode.framework
SharedCode/build/bin/iOS/main/release/framework/SharedCode.framework
```

We use the condition in the Gradle script to select the target platform for the framework.
It is either `iOS arm64` or `iOS x86_64` depending in environment variables.

## Tuning the Gradle Build Script
We need to supply the right Framework out of those four depending on the selected target in the Xcode
project. It depends on the target configuration selected in Xcode. Also,
we'd like to make Xcode compile the Framework for us before the build.
We need to include the additional task to the end of the `SharedCode/build.gradle` Gradle file:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
task packForXCode(type: Sync) {
    final File frameworkDir = new File(buildDir, "xcode-frameworks")
    final String mode = System.getenv('CONFIGURATION')?.toUpperCase() ?: 'DEBUG'

    inputs.property "mode", mode
    dependsOn kotlin.targets.iOS.compilations.main.linkTaskName("FRAMEWORK", mode)

    from { kotlin.targets.iOS.compilations.main.getBinary("FRAMEWORK", mode).parentFile }
    into frameworkDir

    doLast {
        new File(frameworkDir, 'gradlew').with {
            text = "#!/bin/bash\nexport 'JAVA_HOME=${System.getProperty("java.home")}'\ncd '${rootProject.rootDir}'\n./gradlew \$@\n"
            setExecutable(true)
        }
    }
}

tasks.build.dependsOn packForXCode
```
</div>

Note, the task may not work [correctly](https://github.com/gradle/gradle/issues/6330)
if you use Gradle older than 4.10. 
In this tutorial we have already [upgraded it to 4.10.2](#gradle-upgrade).

Let's switch back to the Android Studio and execute the `build` target of the `SharedCode` project from
the *Gradle* tool window. The task looks for environment variables set by the Xcode build and copies
the right variant of the framework into the `SharedCode/build/xcode-frameworks` folder. We then include the
framework from that folder into the build

## Setting up Xcode

We add the `SharedCode` framework to the Xcode project.
For that let's click on the root node of the *project navigator* and select the *target* settings.
Next, we click on the `+` in the *Embedded Binaries* section, click *Add Other...* button in the dialog
to choose the framework from the disk. We can point to the following folder: 
```
SharedCode/build/xcode-frameworks/SharedCode.framework
```

We will then see something similar to this: 
![Xcode General Screen]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-general.png') }})

We need to disable the *Bitcode* feature in the project too. Kotlin/Native produces the fully native
binaries, not the LLVM bitcode, so we need to navigate to the *Build Settings* tab, pick the *All* sub-tab below, and type `bitcode` into
the search field. Select `No` for the *Enable Bitcode* option.

![Xcode Build Settings]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-bitcode.png') }})

Now we need to explain to Xcode, where to look for frameworks. We need to add the *relative* path 
`$(SRCROOT)/../../SharedCode/build/xcode-frameworks` into the *Search Paths | Framework Search Paths* section.
Open the *Build Settings* tab again, pick the *All* sub-tab below, and type the *Framework Search Paths* into
the search field to easily find the option.
Xcode will then show the substituted path in the UI for it.

![Xcode Build Settings]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-search-path.png') }})

The final step is to make Xcode call our Gradle build to prepare the `SharedCode` framework before each run.
We open the *Build Phases* tab and click `+` to add the *New Run Script Phase* and add the following code into it:

<div class="sample" markdown="1" mode="bash" theme="idea" data-highlight-only="1" auto-indent="false">

```bash
cd "$SRCROOT/../../SharedCode/build/xcode-frameworks"
./gradlew :SharedCode:packForXCode
```
</div>

Note, here we use the `$SRCROOT/../..` as the path to the root of our Gradle project.
It can depend on the way the Xcode project was created created. Also, we use the generated
`SharedCode/build/xcode-frameworks/gradlew` script,
the `packForXCode` task generates it. We assumed that the Gradle build is executed at least once,
before opening the Xcode project on a fresh machine

![Xcode Build Phases]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-run-script.png') }})

We should drag the created build phase to the top of the list

![Xcode Build Phases]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-run-script-order.png') }})

We are now ready to start coding the iOS application and to use the Kotlin code from it

## Calling Kotlin Code from Swift

Remember, our goal is to show the text message on the screen. As we see, our iOS application does not draw
anything on the screen. Let's make it show the `UILabel` with the text message. 
We need to replace the contents
of the `ViewController.swift` file with the following code:
 
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

Looking for more APIs? It is easy to create a [multiplatform library](/docs/reference/multiplatform.html) and share it!
