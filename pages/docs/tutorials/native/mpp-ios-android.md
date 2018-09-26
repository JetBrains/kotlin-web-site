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
   - Add XCode project for iOS
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
[XCode](https://developer.apple.com/xcode/) IDE and the tools installed and configured.
Check the [Apple Developer Site](https://developer.apple.com/xcode/) site for more details. and install XCode from the 

In the tutorial we will use IntelliJ IDEA 2018.3 EAP, Android Studio 3.2, Kotlin 1.3.0 RC, XCode 10.0, macOS 10.14.

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

## Adding Common Module

The goal of the tutorial is to demonstrate the code re-use between Android and iOS. Let's start
with creating the `common` project with the code we share between platforms. 
You may did the step before and created the common project with `java` or or Kotlin/JVM plugins, 
that time we will use the [multiplatform project](#) Kotlin plugin instead. We will need to create
several new files in our project.

### Adding Sources

The idea is to make every platform to show the similar text, namely `Kotlin Rocks @ Android` and 
`Kotlin Rocks @ iOS`, depending on the platform. We will reuse the way to generate the message. 
For first, let's create the main file under `common/commonMain/kotlin/common.kt`


<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

expect fun platformName(): String

fun createApplicationScreenMessage() : String {
  return "Kotlin Rocks @ ${platformName()}"
}

```
</div>

That is the common part. The code to generate the final message. It `expect`s the platform
to provide the platform name from the `expect fun platformName(): String` function. 

Now we create an implementation for Android in the `common/androidMain/kotlin/expect.kt`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

actual fun platformName(): String {
  return "Android"
}

```
</div>

The similar file we create for the iOS target in the `common/iosMain/kotlin/expect.kt`:
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
include ':common'
```
</div>

Next,
we need to create the `common/build.gradle` file first with the following content:
 
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
Right after the update, you shall see Android Studio and IntelliJ IDEA now sees one new module `:common`.

### Updated Project Layout

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
  /common
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
created the `:common` project for that. You may want to learn more from the multiplatform projects [documentation](#). 

Let's include the dependency on the `common` project from Android project. The `kotlin-multiplatform`
plugin will resolve the the dependency to the android Jar for us. For that, we need to patch
the `app/build.gradle` file and include the following line into the `dependencies { .. }` block:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
    expectedBy project(':common')
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
    
![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/android-emulator-kotlin-rocks.png') }}){: width="30%"}








Now we are ready to patch the `MainActivity` class 
and include the API  

 
project plugins 


The project refresh ()

Also we need to add several more files

There are several thing we shall know about the multiplatform projects with Kotlin. First, you shall
use the `kotlin-multiplatform` plugin.  

Second, we declare two source sets - one for 

## Patching the Android Project

Let's add more changes to the project to demonstrate code reuse between projects. 

Let's change the example to set the custom text message from the code. 
Later, we will share the way to generate the text between iOS and Android.

We will replace the text with the function call in the next section.


# Adding Common Code Sub-Project

That is the best time for us to configuration the multiplatform project right now. The multiplatform project
is the way to share code between Android, iOS and other platforms. We will have 100% Kotlin code that will
be compiled both to Android and iOS. 

We need to create the common code project. For that we add the new folder `common` and create the `common/build.gradle`
file with the following contents:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
apply plugin: 'kotlin-platform-common'
```
</div>

We need to include the project into the `settings.gradle` file. The only one extra line is needed:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
include ':common'
```
</div>

Also, I create the file `common/src/main/kotlin/common.kt` with the common function to reuse:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

expect fun platformName(): String

fun createApplicationScreenMessage() : String {
  return "Kotlin Rocks on ${platformName()}"
}
```
</div>

Here we create a function to generate the text message for our application. The function uses the `platformName()`
expected function. It means there is no implementation of the function in the `common` subproject,
instead, every platform module is supposed to provide the implementation of the function. 

Let's use the common code from Android project

# Using Common Code from Android Project

We need to update the Android project to include the dependency on our `common` project.
Let's update the `app/build.gradle` project file to add the dependency and a plugin, 
near another `apply plugin: ` lines: 


Let's fill gaps. We need to provide the expected function`platformName()` in the `app` sub-project. For that,
we create the file `app/src/java/<packages>/expectations.kt` with the following content:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

actual fun platformName(): String {
  return "Android"
}
```
</div>

Let's use the `createApplicationScreenMessage` from the Android app code. We need to re-patch the
`MainActivity` files and replace the previously added line in the `onCreate` method with: 
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
  findViewById<TextView>(R.id.main_text).text = createApplicationScreenMessage()
```
</div>
 

That is the time to run our application and see the common code in action. For that we again use the
*Run* button with the `:app` configuration:

![Start the Application]({{ url_for('tutorial_img', filename='native/mpp-ios-android/studio-start-app.png') }})

The application now showns in the Android emulator:
![Emulator App]({{ url_for('tutorial_img', filename='native/mpp-ios-android/android-emulator-kotlin-rocks.png') }}){: width="30%"}

The application layout is as follows
```
  /app
  |   /src
  |   |   /androidTest
  |   |   /main
  |   |   /test
  |   build.gradle --- android application sub-project
  |
  /common
  |   /src/main/kotlin
  |   build.gralde --- common code project settings
  |       
  build.gradle     --- root project
  settings.gralde     
```

Right now we have: `:common` and `:app` projects. The `common` project contains the common code
for our applications, is helps to generate the text message, that our Android and future iOS application
show. That is the time to include Kotlin/Native and iOS. 

# Setting up Kotlin/Native Target

Let's create new sub-project called `native`, we need to add the file `native/build.gradle` with the following
contents:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
apply plugin: 'kotlin-platform-android'

dependencies {
    expectedBy project(':common')
}

sourceSets {
    main {
        component {
            targets = ['macos_x64']
        }
    }
}
```
</div>

The new project has to be registered in the `settings.grale`, let's include the line in to the file:
```
include ':native'
```

Let's fill the gap. We need to provide the expected function`platformName()` in the `app` sub-project. For that,
we create the file `native/src/main/kotlin/expectations.kt` with the following content:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package com.jetbrains.jonnyzzz.common

actual fun platformName(): String {
  return "Native"
}
```
</div>

