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

In the tutorial, we will create iOS and Android applications
and re-use Kotlin code between them.
Kotlin/JVM is used for Android, 
and Kotlin/Native is used for iOS. 

In this tutorial you will:
 - Create an [Android app](#creating-an-android-project) with Android Studio
 - Create an [iOS app](#creating-ios-application) with Xcode
 - Create a [Kotlin multiplatform project](#multiproject-gradle-project)
   - Use it [from Android app](#using-common-library-from-android)
   - Use it [from iOS app](#settings-up-framework-dependency)

Nowadays, mobile applications can be huge, complicated and amazing. Our goal is to illustrate
the principle and the mechanics of the Kotlin code sharing between Android and iOS.
Still, the applications that we create are especially simplified to the bare minimum to focus
on the code re-use and multiplatform project aspects.

We create applications for Android and iOS. It will show the text
`Kotlin Rocks on Android` on Android and the `Kotlin Rocks on iOS <version>` on iOS.
The goal is to share the code to generate that message. The common code is as easy
as `"Kotlin Rocks on ${platformName()}"`, where the `platformName()` is 
an `expect fun` function. The `platformName` function is implemented differently
for each of the platforms.

# Setting Up the Local Environment

We will be using [Android Studio](https://developer.android.com/studio/) for the Android part of the tutorial. 
You shall have Android SDK installed, or Android Studio will help you to install one.
It is possible to use [IntelliJ IDEA](https://jetbrains.com/idea) Community or Ultimate editions too.

You should have the latest Kotlin plugin version 1.3.x installed in the Android Studio or IntelliJ IDEA. The tutorial
uses features that are only available in Kotlin 1.3.x or newer. To check that, you may open
*Language & Frameworks | Kotlin Updates* block in the *Settings* or *Preferences* of your IDE.

For those, who use IntelliJ IDEA through the tutorial. It is also required to have JDK 1.8 (**not** newer).
You may download and install it from the [Oracle](https://java.sun.com) or other websites. 

macOS host operating system is required to compile for iOS and macOS devices. We need to have
[Xcode](https://developer.apple.com/xcode/) and the tools installed and configured.
Check out the [Apple Developer Site](https://developer.apple.com/xcode/) for more details. 

In the tutorial, we will use IntelliJ IDEA 2018.3 EAP, Android Studio 3.2, Kotlin 1.3.0 RC, Xcode 10.0, macOS 10.14.

# Creating an Android Project

Let's use Android Studio to create our Android project. You should have the latest version of it, and you
should have the newest Kotlin plugin installed as well
(check *Configure | Preferences | Language & Frameworks | Kotlin Updates* for that).

We select the *Start New Android Project* item. If you are using IntelliJ IDEA, you need to select *Android* in 
the list on the left. Android Studio will help to make sure Android SDK is installed.   

![New Project]({{ url_for('tutorial_img', filename='native/mpp-ios-android/new-android-project-studio.png') }}){: width="70%"}

Do not forget to check the *Include Kotlin support* checkbox. On the next page, you may customize
your Android requirements. Defaults will work for the tutorial, so you may
click through it. On the third page, we select the *Empty Activity* option and click *Next*. 
We agree on default names of the Activity on the next screen and click *Finish*.  

IntelliJ IDEA and Android Studio may fail to open the generated project with a Gradle import error
if you use pre-release or EAP version of the Kotlin plugin. In that case, you need to
[add the Kotlin EAP repository](https://youtrack.jetbrains.com/issue/KT-18835#focus=streamItem-27-2718879-0-0), 
or add the following line:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
maven { url 'https://dl.bintray.com/kotlin/kotlin-eap' }
```
</div>
into the `build.gradle` file *twice*, under the _both_ `repositories { .. }` blocks.

In the IntelliJ IDEA, you may also need to make sure Gradle is running under JDK 1.8. Otherwise, the project import
may [fail](https://youtrack.jetbrains.com/issue/IDEA-199397). Check out the *Gradle Settings* to fix that. We will
need JDK in the system PATH to make the combined Xcode build work.

Kotlin/Native plugin requires a newer version of Gradle, let's patch the `gradle/wrapper/gradle-wrapper.properties`
and use the following `distrubutionUrl`:
```
distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.2-all.zip
```

We need to refresh Gradle Project settings to apply those changes. You may either click on the `Sync Now` link or 
use the *Gradle* tool window and use the refresh action from the context menu.

At that point, we shall be able to compile and run the project. Let's click on the `App` run configuration
to have our project running either on a real Android Device or on the emulator. 

![Start the Application]({{ url_for('tutorial_img', filename='native/mpp-ios-android/studio-start-app.png') }})
We shall see the Application running in the Android emulator:
    
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

## Creating the SharedCode Module

The goal of the tutorial is to demonstrate Kotlin code re-use between Android and iOS. Let's start
with creating the `SharedCode` project with the code we share between platforms. 
We will create several new files in our project.

### Adding Kotlin Sources

The idea is to make every platform to show the similar text: `Kotlin Rocks on Android` and 
`Kotlin Rocks on iOS`, depending on the platform. We will reuse the way to generate the message. 
For first, let's create the main file under `SharedCode/src/commonMain/kotlin/common.kt`

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
to provide the platform name from the `expect fun platformName(): String` function. We will use
the `createApplicationScreenMessage` from both Android and iOS applications.

Now, we create an implementation for Android in the `SharedCode/src/androidMain/kotlin/actual.kt`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

actual fun platformName(): String {
  return "Android"
}

```
</div>

The similar file we create for the iOS target in the `SharedCode/src/iosMain/kotlin/actual.kt`:
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

Here we use the [UIDevice](https://developer.apple.com/documentation/uikit/uidevice?language=objc)
class from the Apple UIKit Framework, which is not available for Java, but only usable from Swift and Objective-C.
Kotlin/Native compiler comes with a set of pre-imported frameworks, so that we may use
the UIKit Framework without additional steps.
You may find more about Objective-C and Swift Interop [here](/docs/reference/native/objc_interop.html)

### Updating Gradle Scripts

The `SharedCode` project should generate several artifacts for us:
 - JAR file for the Android project, from the `androidMain` source set
 - Apple framework 
   - for iOS device and App Store (`arm64` target)
   - for iOS emulator (`x86_64` target)

The only thing we miss so far is Gradle project files. Let's update Gradle scripts. 
First, we add the new project into the `settings.gradle` file, by adding the following line to the end of the file:
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

### Multiproject Gradle Project

The `SharedCode/build.gradle` file uses `kotlin-multiplatform` plugin to implement 
what we need. 
In the file, we define several targets `common`, `android`, `iOSx64`, and `iOS`. Each
target has its own platform. The `common` target contains the code which is included
into every platform compilation. 
You may want to look through the documentation of [multiplatform projects](#).

Let's summarize what we have in the table:

| name | source folder | target | artifact |
|---|---|---|
| common | `SharedCode/commonMain/kotlin` |  - | Kotlin metadata |
| android | `SharedCode/androidMain/kotlin` | JVM 6 | `.jar` file or `.class` files |
| iOS | `SharedCode/iOSMain` | iOS arm64 | Apple framework |
| iOSx64 |  not used by us | iOS x86_64 | Apple framework |

The configurations block is included
as the [workaround](https://youtrack.jetbrains.com/issue/KT-27170) for Android lint task:
```groovy
configurations {
    compileClasspath
}
```

Now it is the time to refresh the Gradle project in Android Studio. You may either click on the yellow stripe 
or use the *Gradle* tool window and click `Refresh` from the context menu on the root Gradle project.
Let's click on the refresh twice. Right after the update, you shall see Android Studio and IntelliJ
IDEA now sees one new module `:SharedCode`.

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
  |   |    /androidMain/kotlin/actual.kt  --- android expectations
  |   |    /commonMain/kotlin/common.kt   --- common & shared code
  |   |    /iOSMain/kotlin/actual.kt      --- apple expectations
  |   build.gradle                        --- common project
  |    
  build.gradle                            --- root project
  settings.gralde     
```

We are ready to use the common library from our Android application project.

# Using Common Library from Android

There are several ways to integrate Android Gradle project with Kotlin multiplatform projects. 
It is possible to use the `kotlin-multiplatform` plugin directly in the Android Gradle project,
instead of the `kotlin-android`. For that tutorial, we minimize Android project changes and
created the `:SharedCode` project, and add the ordinary dependency on that project from the
Android project. You may want to learn more from the documentation of the
[multiplatform projects](#). 

Let's include the dependency from the `SharedCode` project to the Android project. We need to patch
the `app/build.gradle` file and include the following line into the `dependencies { .. }` block:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
    implementation project(':SharedCode')
```
</div>

Remember, the idea to use common code to generate the text. For that, we need to
assign the Id to the `TextView` control of our activity to access it from the code. 
Let's patch the
`app/src/main/res/layout/activity_main.xml` file
(the name may be different if you changed it in the new project wizard)
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
findViewById<TextView>(R.id.main_text).text = createApplicationScreenMessage()"
```

Use the intention from an IDE to include the missing import line:
```kotlin
import com.jetbrains.jonnyzzz.common.createApplicationScreenMessage
```
into the same file. 

That are all the changes we needed. Let's see how it works. 

## Running Android Project in Android Studio

At that point, we shall be able to compile and run the project. Let's click on the `App` run configuration
to have our project running either on a real Android Device or on the emulator. 

![Start the Application]({{ url_for('tutorial_img', filename='native/mpp-ios-android/studio-start-app.png') }})

And so we see the Application running in the Android emulator:
    
![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/android-emulator-kotlin-rocks-android.png') }}){: width="30%"}


# Creating iOS Application

Let's create an iOS application in Xcode. We open Xcode and select *Create a new Xcode project* option. In 
the dialog, we choose the iOS target and select the *Single View App*. Fill the next page with defaults, 
and use the `KotlinIOS` as the *Product Name*. Let's select Swift as the language (it is possible to use
Objective-C too). You should instruct Xcode to place the project into the `native` folder under our project. 

Right now, you should be able to run the application on the iOS emulator or on the iOS device. The device
may require to configure an Apple developer account and to issue a developer certificate. Xcode does its
best to guide you through the process. 

Let's make sure we can to run the application on the iPhone emulator. 


## Settings up Framework Dependency 

Let's turn back
to the Android Studio and run the task `build` in the `SharedCode` project via the *Gradle* tool window.
The task generates Frameworks for the use in the Xcode project.
Then, you will see the `SharedCode/build/bin` folder with Frameworks in it. One framework is compiled for 
the `iOS` emulator (x86_64 target), the second framework is created for the device (arm64 target).

The frameworks are in the following paths:
```
SharedCode/build/bin/iOSx64/main/debug/framework/SharedCode.framework
SharedCode/build/bin/iOS/main/debug/framework/SharedCode.framework
SharedCode/build/bin/iOSx64/main/release/framework/SharedCode.framework
SharedCode/build/bin/iOS/main/release/framework/SharedCode.framework
```

### Tuning the Gradle Build Script
We need to supply the right Framework depending on the selected target in the Xcode
project. It also depends on the `Release` or `Debug` configuration. Lastly,
we'd like to make Xcode compile the Framework for us before the build.
We need to include the additional task to the end of the `SharedCode/build.gradle` file:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
task packForXCode(type: Sync) {
    final File frameworkDir = new File(buildDir, "xcode-frameworks")
    final String mode = System.getenv('CONFIGURATION')?.toUpperCase() ?: 'DEBUG'
    final String target = System.getenv('SDK_NAME')?.startsWith("iphoneos") ? 'iOS' : 'iOSx64'

    inputs.property "target", target
    inputs.property "mode", mode
    dependsOn kotlin.targets."$target".compilations.main.linkTaskName("FRAMEWORK", mode)

    from { kotlin.targets."$target".compilations.main.getBinary("FRAMEWORK", mode).parentFile }
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

Let's switch back to the Android Studio and execute the `build` target of the `SharedCode` project from
the *Gradle* tool window. The task checks for environment variables set by the Xcode build and copies
the right variant of the framework into the `SharedCode/build/xcode-frameworks` folder. We include the
framework from the folder into the build:

### Setting up Xcode Dependency for iOS Emulator

Let's add the `SharedCode` framework to the Xcode project.
For that let's click on the root node of the *project navigator* and select the *target* settings.
Next, we click on the `+` in the *Embedded Binaries* section, click *Add Other...* button in the dialog
to choose the framework from the disk. We point to the following folder: 
```
SharedCode/build/xcode-frameworks/SharedCode.framework
```

You shall see something similar to this: 
![Xcode General Screen]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-general.png') }})

We need to disable the *Bitcode* feature in the project too. Kotlin/Native produces the fully native
binaries, not the LLVM bitcode, so we switch to the *Build Settings* tab and type `bitcode` into
the search field. Select `No` for the *Enable Bitcode* option.

![Xcode Build Settings]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-bitcode.png') }})

Now we need to explain Xcode, where to look for frameworks. We need to add the relative path 
`$(SRCROOT)/../../SharedCode/build/xcode-frameworks` into the *Search Paths | Framework Search Paths* section.
Xcode will show the substituted path in the UI for it.

![Xcode Build Settings]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-search-path.png') }})

The final step is to make Xcode call our Gradle build to prepare the `SharedCode` framework.
We open the *Build Phases* tab and click `+` to add the *New Run Script Phase* 

Let's add the following code into it:

<div class="sample" markdown="1" mode="bash" theme="idea" data-highlight-only="1" auto-indent="false">

```bash
cd $SRCROOT/../../SharedCode/build/xcode-frameworks
./gradlew :SharedCode:packForXCode
```
</div>

Note, the `$SRCROOT/../..` is the way to find the project folder root from the Xcode project sources root.
It may depend on the way how you created your project in Xcode. 

![Xcode Build Phases]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-run-script.png') }})

You should drag the created build phase to the top of the list.

![Xcode Build Phases]({{ url_for('tutorial_img', filename='native/mpp-ios-android/xcode-run-script-order.png') }})

We are ready now to start coding the iOS application and to use Kotlin code from it.

### Calling Kotlin Code from Swift

Our goal was to show the text message on the screen. As you see, our iOS application does not draw
anything on the screen. Let's make it show the `UILabel` with the text message from Kotlin code. 
It is the time to add a few more lines into the `ViewController.swift` file. We replace the contents
of the file with the following code:
 
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
 
As you see here, we include the `import SharedCode` to import our Framework. Next we call the method
from it as `CommonKt.createApplicationScreenMessage()`. Follow the 
[Kotlin/Native as an Apple Framework](/docs/tutorials/native/apple-framework.html) tutorial for
more details on the Kotlin/Native to Swift (or Objective-C) interop.

You may want to call the `./gradlew :SharedCode:build` task from an Xcode *Build Phase* to compile or re-compile
the framework before each run of the Xcode project. 

Right now, we are ready to start the application in the emulator

## Running the iOS Application

Let's click *Run* button in the Xcode, and we'll see 

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
 
You may find the whole sources from that tutorial on [GitHub](https://github.com/jonnyzzz/kotlin-mpp-mobile).
 
# Next Steps

That is only the beginning and a small example on how one may share Kotlin code 
between iOS and Android (and other platforms) with Kotlin, Kotlin/Native
and Kotlin multiplatform projects.

You may want to learn more from the
multiplatform projects [documentation](#) or checkout the Swift 
and Objective-C [documentation](/docs/reference/native/objc_interop.html).

## Kotlin Multiplatform Libraries

Sharing code between platforms is the powerful technique, but it may be hard to
accomplish without rich APIs that we have in Android, JVM or iOS platforms.
You may use multiplatform libraries to fix that and to have rich APIs
directly in the common Kotlin code. There are several examples of such libraries:  

- [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines/blob/master/native/README.md)
- [kotlinx.io](https://github.com/Kotlin/kotlinx-io)
- [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
- [ktor](https://ktor.io/)
- [ktor-http-client](https://ktor.io/clients/http-client.html)

Are you looking for more APIs? It is easy to create your own [multiplatform library](#) and publish
to a repository!
