---
type: tutorial
layout: tutorial
title:  "Multiplatform Project: iOS and Android"
description: "Sharing code between iOS and Android"
authors: Eugene Petrenko
date: 2018-10-04
showAuthorInfo: false
issue: EVAN-6029
---

In this tutorial we will create iOS and Android multiplatform application, 
that uses Kotlin/JVM for Android and Kotlin/Native for the iOS. We will share
common code between our two applications.

In this tutorial you will:
 - Create a multiplatform Gradle project 
   - Add Gradle sub-project for Android
   - Add Xcode project for iOS
   - Configure IDEs to work with those projects
 - Create common code to share between platforms


# Setting up Local Environment

We will be using [Android Studio](https://developer.android.com/studio/) for the Android part of the tutorial. 
You shall have Android SDK installed, or Android Studio will help you to install one.
It is possible to use [IntelliJ IDEA](https://jetbrains.com/idea) Community or Ultimate editions version too.

You should have the latest Kotlin plugin version 1.3.x installed in our Android Studio or IntelliJ IDEA. The tutorial
uses features that are only available in Kotlin 1.3.x or newer. To check that, you may simply open
*Language & Frameworks | Kotlin Updates* block in the *Settings* or *Preferences* of your IDE.

It is also required to have JDK 1.8 (**not** newer) installed. You may download and install it
from the [Oracle](https://java.sun.com) website. 

macOS host operation system is required to compile for iOS and macOS devices. We need to have the
[Xcode](https://developer.apple.com/xcode/) IDE and the tools installed and configured.
Check the [Apple Developer Site](https://developer.apple.com/xcode/) site for more details. and install Xcode from the 

In the tutorial we will use IntelliJ IDEA 2018.3 EAP, Android Studio 3.2, Kotlin 1.3.0 RC, Xcode 10.0, macOS 10.14.

<!--
You may need to install [cocoapods](https://cocoapods.org/).
-->

# Creating Android Project

Let's use Android Studio to create our Android project. You should have the latest version of it and you
should have the latest Kotlin plugin installed as well
(check *Configure | Preferences | Language & Frameworks | Kotlin Updates* for that).

We select the *Start New Android Project* item. If you are using IntelliJ IDEA, you need to select *Android* in 
the list in the left. Android Studio will help to make sure Android SDK is installed.   

![New Project]({{ url_for('tutorial_img', filename='native/mpp-ios-android/new-android-project-studio.png') }}){: width="70%"}

Do not forget to check the *Include Kotlin support* checkbox. On the next page you may customize
your Android requirements. Defaults will work for the tutorial, so you may
simply click through it. Similarly, on the third page, we select the *Empty Activity* option and click *Next*. 
We agree on default names of the Activity on the next screen and click *Finish*.  

It may fail to open the project with a Gradle import error. You may need to
[add Kotlin EAP repository](https://youtrack.jetbrains.com/issue/KT-18835#focus=streamItem-27-2718879-0-0), 
so we need to add the following line:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
maven { url 'https://dl.bintray.com/kotlin/kotlin-eap' }
```
</div>
into the `build.gradle` file under the both `repositories { .. }` blocks.

In the IntelliJ IDEA, you may also need to make sure Gradle is running under JDK 1.8, otherwise, the project import
may [fail](https://youtrack.jetbrains.com/issue/IDEA-199397). Check out the Gradle Settings to fix that.

Kotlin/Native plugin requires newer version of Gradle, let's patch the `gradle/wrapper/gradle-wrapper.properties`
and use the following `distrubutionUrl`:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.2-all.zip
```

We need to refresh Gradle settings via the `Sync Now` banner on every Gradle file,
or via the Gradle tab and the refresh button on the toolbar in IntelliJ IDEA to apply our changes.

At that point, we shall be able to compile and run the project. Let's click on the `App` run configuration
to have our project running either on a real Android Device or in the emulator. 

![Start the Application]({{ url_for('tutorial_img', filename='native/mpp-ios-android/studio-start-app.png') }})
And so we see the Application running in the Android emulator:
    
![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/android-emulator-hello-app.png') }}){: width="30%"}


## Project Layout

The generated sample application layout is as follows:
```
  /app
  |   /src
  |   |   /androidTest/java/<package>
  |   |   /main
  |   |        /java/<package>/MainActivity.kt
  |   |        /res
  |   |   /test
  |   build.gradle       --- android application sub-project `:app`
  |   
  build.gradle           --- root project
  settings.gralde     
```

Here we have the root Gradle project, with `build.gradle` and `settings.gradle` files in the
root of the project directory. The Android Studio wizard also created the `app` project and the
`app/build.gradle` file with Android specifics.

## Creating Common Module

The goal of the tutorial is to demonstrate the code re-use between Android and iOS. Let's start
with creating the `SharedCode` project with the code we share between platforms. 
You may did the step before and created the `SharedCode` project with `java` or or Kotlin/JVM plugins, 
that time we will use the [multiplatform project](#) Kotlin plugin instead. We will need to create
several new files in our project.

### Adding Sources

The idea is to make every platform to show the similar text, namely `Kotlin Rocks on Android` and 
`Kotlin Rocks on iOS`, depending on the platform. We will reuse the way to generate the message. 
For first, let's create the main file under `SharedCode/commonMain/kotlin/common.kt`


<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

expect fun platformName(): String

fun createApplicationScreenMessage() : String {
  return "Kotlin Rocks on ${platformName()}"
}

```
</div>

That is the common part. The code to generate the final message. It `expect`s the platform
to provide the platform name from the `expect fun platformName(): String` function. 

Now we create an implementation for Android in the `SharedCode/androidMain/kotlin/expect.kt`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

actual fun platformName(): String {
  return "Android"
}

```
</div>

The similar file we create for the iOS target in the `SharedCode/iosMain/kotlin/expect.kt`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

import platform.UIKit.UIDevice

actual fun platformName(): String {
  return UIDevice.currentDevice.systemName() +
         " " +
         UIDevice.currentDevice.systemVersion
}
```
</div>

Here use use the [UIDevice](https://developer.apple.com/documentation/uikit/uidevice?language=objc)
API from the Apple UIKit Framework, which is not available from Java, but useable from Swift and Objective-C.
You may find more about Objective-C and Swift Interop [here](/docs/reference/native/objc_interop.html)

### Updating Gradle Scripts

The project should generate several artifacts for us:
 - JAR file for Android project, from the `androidMain` source set
 - Apple framework 
   - for iPhone device and App Store (`arm64` target)
   - for iPhone emulator (`x86_64` target)

The only thing we miss so far are Gradle project files. Let's update Gradle scripts. 
First, we add new projects into the `settings.gradle` file. Let's include the following line:
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
include ':SharedCode'
```
</div>

Next,
we need to create the `SharedCode/build.gradle` file first with the following content:
 
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
apply plugin: 'kotlin-multiplatform'

kotlin {
    targets {
        fromPreset(presets.jvm, 'android')

        fromPreset(presets.iosArm64, 'iOS') {
            compilations.main.outputKinds('FRAMEWORK')
        }

        fromPreset(presets.iosX64, 'iOSx64') {
            compilations.main.outputKinds('FRAMEWORK')
        }
    }

    sourceSets {
        commonMain.dependencies {
            api 'org.jetbrains.kotlin:kotlin-stdlib-common'
        }

        androidMain.dependencies {
            api 'org.jetbrains.kotlin:kotlin-stdlib'
        }

        iOSx64Main.dependsOn iOSMain
    }
}

configurations {
    compileClasspath
}
```
</div>

Now it is the time to refresh Gradle project. For that you may either click on the yellow stripe 
or use the *Gradle* tool window and click `Refresh` from the context menu on the root Gradle project.
Let's click on the refresh twice.  
Right after the update, you shall see Android Studio and IntelliJ IDEA now sees one new module `:SharedCode`.

### The Project Layout

The project layout right now should be as follows:
```
  /app
  |   /src
  |   |   /androidTest/java/<package>
  |   |   /main
  |   |        /java/<package>/MainActivity.kt
  |   |        /res
  |   |   /test
  |   build.gradle                        --- android application project
  |   
  /SharedCode
  |   /src
  |   |    /androidMain/kotlin/expect.kt  --- android expectations
  |   |    /commonMain/kotlin/common.kt   --- common & shared code
  |   |    /iOSMain/kotlin/expect.kt      --- apple expectations
  |   build.gradle                        --- common project
  |    
  build.gradle                            --- root project
  settings.gralde     
```

New we are ready to use the common library from our Android application project.

# Using Common Library from Android

There are several way to integrate Android Gradle project with multiplatform projects. 
It is possible to use the `kotlin-multiplatform` plugin directly without `kotlin-android` plugin
in the project. For that tutorial we decided to minimize Android project changes and
created the `:SharedCode` project for that. You may want to learn more from the
multiplatform projects [documentation](#). 

Let's include the dependency on the `SharedCode` project from Android project. The `kotlin-multiplatform`
plugin will resolve the the dependency to the android Jar for us. For that, we need to patch
the `app/build.gradle` file and include the following line into the `dependencies { .. }` block:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
    expectedBy project(':SharedCode')
```
</div>

Remember, the idea to use common code to generate the text. Right now we need to
assign the Id to the `TextView` control of our activity to access it from the code. 
For that we need to open the
`app/src/main/res/layout/activity_main.xml` file
(the name may be different, if you changed it in the new project wizard).
We need to add several more attributes attribute to the `<TextView>` element: 
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
findViewById<TextView>(R.id.main_text).text = createApplicationScreenMessage()"
```

Please use the intention from the IDE to include the missing import line:
```kotlin
import com.jetbrains.jonnyzzz.common.createApplicationScreenMessage
```
into the same file. 

That are all changes we needed. Let's see how it works. 

## Running Android Project in Android Studio

At that point we shall be able to compile and run the project. Let's click on the `App` run configuration
to have our project running either on a real Android Device or in the emulator. 

![Start the Application]({{ url_for('tutorial_img', filename='native/mpp-ios-android/studio-start-app.png') }})

And so we see the Application running in the Android emulator:
    
![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/android-emulator-kotlin-rocks-android.png') }}){: width="30%"}


# Creating iOS Application

Let's create an iOS application in Xcode. Let's open Xcode and select *Create a new Xcode project* option. In 
the dialog, wi select iOS target, and pick the *Single View App*. We fill the next next page with defaults, 
I use the `KotlinIOS` as the *Product Name*. Let's pick Swift as the language (it is possible to use
Objective-C too). You should instruct Xcode to place the project into the `native` folder in our project. 

Right now you you should be able to run the application in the iOS emulator or in the iOS device. The device
may require to configure a developer account and to issue a developer certificate. Xcode does it best to guide
you through the process. 

Let's make sure we are able to run the application in the iPhone emulator. 
 

## Settings up Framework Dependency 

The `SharedCode` project in Android Studio generates Frameworks for the use in Xcode project. Let's turn back
to the Android Studio and run the task `build` in the `SharedCode` project via the *Gradle* tool window. 
Than you will see the `SharedCode/build/bin` folder with two Frameworks. One framework is compiled for 
the `iPhone` emulator (x86_64 target), the second framework is create for the device (arm64 target).

The frameworks are in the following paths:
```
SharedCode/build/bin/iOSx64/main/debug/framework/SharedCode.framework
SharedCode/build/bin/iOS/main/debug/framework/SharedCode.framework
```

It is only possible to use one of those binaries in the project to target either
iPhone emulator (x86_64) or the device (arm64). It is possible to create
[a universal framework](https://medium.com/swiftindia/build-a-custom-universal-framework-on-ios-swift-549c084de7c8)
from those two frameworks to simplify emulator and device development.
Let's focus on the emulator for now.

### Setting up Xcode dependency for iPhone Emulator

The next step is to include the `SharedCode` framework files into the Xcode project.
For that let's click on the root node of the *project navigator* and select the *target* settings. 
Next, we click on the `+` in the *Embedded Binaries* section, click *Add Other...* button in the dialog
to pick the framework from the disk. We point to the following folder: 
```
SharedCode/build/bin/iOSx64/main/debug/framework/SharedCode.framework
```

We have to list the same path in the *Build Settings* tag, under the *Search Paths | Framework Search Paths*
section.

Let's use the compiled Kotlin code from the Swift!

### Calling Kotlin Code from Swift

We need to show the same text message in the screen. As you see, our iPhone application does not show
anything. Let's make it show the `UILabel` instead with the text message from Kotlin code. 
It is the time to add few more lines into the `ViewController.swift` file, we replace the contents
of the file with the following code:
 
<div class="sample" markdown="1" mode="swift" theme="idea" data-highlight-only="1" auto-indent="false">

```swift
import UIKit
import SharedCode

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
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
 
As you see here, we include the `import SharedCode` to import our Framework. Next we call the method
from it as `CommonKt.createApplicationScreenMessage()`. Follow to the 
[Kotlin/Native as an Apple Framework](/docs/tutorials/native/apple-framework.html) tutorial for
more details on the framework API.

We are ready to start the application in the emulator

## Running the iPhone Application

Let's click *Run* button in the Xcode and we see 

![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/iPhone-emulator-kotlin-rocks.png') }}){: width="30%"}

# Summary

In the tutorial we
 - created an Android application in the Android Studio
 - created an iPhone application in the Xcode
 - added Kotlin multiplatform sub-project  
   - with shared between platform
   - compiled it to Android Jar
   - compiled it to iOS Framework
 - put it all together and re-used code
 
# Next Steps

That is only the beginning and small example on how one may reuse code 
between iOS and Android with Kotlin, Kotlin/Native and multiplatform projects.

## Kotlin Multiplatform Libraries

Sharing code between platforms is the powerful technique, but it may be hard to
accomplish without reach APIs that we are gut used to in Android, JVM or iOS platforms.
You may yse multiplatform libraries that provides the common API and platform specific
implementations. We have several examples of those libraries:  

- Kotlin stdlib
- [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines/blob/master/native/README.md)
- [kotlinx.io](https://github.com/Kotlin/kotlinx-io)
- [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
- [ktor](https://ktor.io/)
- [ktor-http-client](https://ktor.io/clients/http-client.html)

Looking for more APIs? It is easy to create your own multiplatform library and publish it
with Gradle to your maven repository
