[//]: # (title: Make your Android application work on iOS – tutorial)

Here you can learn how to make your existing Android application cross-platform so that it works both on Android and iOS.
You'll be able to write code and test it for both Android and iOS only once, in one place.

This tutorial uses a [sample Android application](https://github.com/Kotlin/kmm-integration-sample) with a single screen for entering a username and password.
The credentials are validated and saved to an in-memory database.

If you aren't familiar with KMM, you can learn how to [create and configure a KMM application from scratch](kmm-create-first-app.md) first.

## Prepare an environment for development

1. Install Android Studio 4.2 or higher and [other tools for KMM development](kmm-setup.md) on macOS.

   >You will need a Mac with macOS to complete certain steps in this tutorial, which include writing iOS-specific code and running an iOS application.  
   >These steps cannot be performed on other operating systems, such as Microsoft Windows. This is due to an Apple requirement.
   >
   {type="note"}

2. In Android Studio, create a new project from version control: `https://github.com/Kotlin/kmm-integration-sample`.

3. Switch to the **Project** view.

   ![Project view](project-view-for-integrate.png){width=200}

## Make your code cross-platform

To have a KMM application that works on iOS, you'll first make your code cross-platform, and then you’ll reuse your cross-platform code in a new iOS application.

To make your code cross-platform:

1. [Decide what code to make cross-platform](#decide-what-code-to-make-cross-platform).

2. [Create a shared module for cross-platform code](#create-a-shared-module-for-cross-platform-code).

3. [Add a dependency on the shared module to your Android application](#add-a-dependency-on-the-shared-module-to-your-android-application).

4. [Make the business logic cross-platform](#make-the-business-logic-cross-platform).

5. [Run your cross-platform application on Android](#run-your-cross-platform-application-on-android).

### Decide what code to make cross-platform

Decide which code of your Android application is better to share for iOS and which to keep native.
A simple rule is: share what you want to reuse as much as possible.
The business logic is often the same for both Android and iOS, so it's a great candidate for reuse.

In your sample Android application, the business logic is stored in the package `com.jetbrains.simplelogin.androidapp.data`.
Your future iOS application will use the same logic, so you should make it cross-platform, as well.

![Business logic to share](business-logic-to-share.png){width=350}

### Create a shared module for cross-platform code

The cross-platform code that is used for both iOS and Android _is stored_ in the shared module.
KMM provides a special wizard for creating such modules.

In your Android project, create a KMM shared module for your cross-platform code. Later you'll connect it to your existing Android application and your future iOS application.

1. In Android Studio, click **File** | **New** | **New Module**.

2. In the list of templates, select **KMM Shared Module**, enter the module name `shared`, and select the 
   **Regular framework** in the list of iOS framework distribution options.  
   This is required for connecting the shared module to the iOS application.

   ![KMM shared module](kmm-module-wizard.png)

3. Click **Finish**.

The wizard will create the KMM shared module, update the configuration files, and create files with classes that demonstrate the benefits of Kotlin Multiplatform.
You can learn more about the [KMM project structure](kmm-understand-project-structure.md).

### Add a dependency on the shared module to your Android application

To use cross-platform code in your Android application, connect the shared module to it, move the business logic code there, and make this code cross-platform.

1. Ensure that `compileSdkVersion` and `minSdkVersion` in `build.gradle.kts` of the `shared` module are the same as those in the `build.gradle` of your Android application in the `app` module.  
   If they are different, update them in the `build.gradle.kts` of the shared module. Otherwise, you'll encounter a compile error.

2. Add a dependency on the shared module to the `build.gradle` of your Android application.

    ```kotlin
    dependencies {
        implementation project(':shared')
    }
    ```

3. Synchronize the Gradle files by clicking **Sync Now** in the warning.

   ![Synchronize the Gradle files](gradle-sync.png)

4. To make sure that the shared module is successfully connected to your application, dump the `greeting()` function result to the log
   by updating the `onCreate()` method of the `LoginActivity` class.

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
       super.onCreate(savedInstanceState)

       Log.i("Login Activity", "Hello from shared module: " + (Greeting().greeting()))
   
    }
    ```

5. Search for `Hello` in the log, and you'll find the greeting from the shared module.

   ![Greeting from the shared module](shared-module-greeting.png)

### Make the business logic cross-platform

You can now extract the business logic code to the KMM shared module and make it platform-independent. This is necessary for reusing the code for both Android and iOS.

1. Move the business logic code `com.jetbrains.simplelogin.androidapp.data` from the `app` directory to the `com.jetbrains.simplelogin.shared` package in the `shared/src/commonMain` directory.
   You can drag and drop the package or refactor it by moving everything from one directory to another.

   ![Drag and drop the package with the business logic code](moving-business-logic.png){width=350}

2. When Android Studio asks what you'd like to do, select to move the package, and then approve the refactoring.

   ![Refactor the business logic package](refactor-business-logic-package.png){width=500}

3. Ignore all warnings about platform-dependent code and click **Continue**.

   ![Warnings about platform-dependent code](warnings-android-specific-code.png){width=450}

4. Remove Android-specific code by replacing it with cross-platform Kotlin code or connecting to Android-specific APIs using [`expect` and `actual` declarations](kmm-connect-to-platform-specific-apis.md). See the following sections for details.

#### Replace Android-specific code with cross-platform code {initial-collapse-state="collapsed"}

To make your code work well on both Android and iOS, replace all JVM dependencies with Kotlin dependencies wherever possible.

1.  In the `login()` function of the `LoginDataSource` class, replace `IOException`, which is not available in Kotlin, with `RuntimeException`.

    ```kotlin
    // Before
    return Result.Error(IOException("Error logging in", e))
    ```

    ```kotlin
    //After
    return Result.Error(RuntimeException("Error logging in", e))
    ```

2. For email validation, replace the `Patterns` class from the `android.utils` package with a Kotlin regular expression matching the pattern in the `LoginDataValidator` class:

    ```kotlin
    // Before
    private fun isEmailValid(email: String) = Patterns.EMAIL_ADDRESS.matcher(email).matches()
    ```

    ```kotlin
    // After
    private fun isEmailValid(email: String) = emailRegex.matches(email)
    
    companion object {
       private val emailRegex =
               ("[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
                       "\\@" +
                       "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                       "(" +
                       "\\." +
                       "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                       ")+").toRegex()
    }
    ```

#### Connect to platform-specific APIs from the cross-platform code {initial-collapse-state="collapsed"}

A universally unique identifier (UUID) for `fakeUser` in `LoginDataSource` is generated using the `java.util.UUID` class, which is not available for iOS.

```kotlin
val fakeUser = LoggedInUser(java.util.UUID.randomUUID().toString(), "Jane Doe")
```

Since the Kotlin standard library doesn't provide functionality for generating UUIDs, you still need to use platform-specific functionality for this case.

Provide the `expect` declaration for the `randomUUID()` function in the shared code and its `actual` implementations for each platform – Android and iOS – in the corresponding source sets.
You can learn more about [connecting to platform-specific APIs](kmm-connect-to-platform-specific-apis.md).

1. Remove the `java.util.UUID` class from the common code:

    ```kotlin
   val fakeUser = LoggedInUser(randomUUID(), "Jane Doe") 
   ```

1. Create a `Utils.kt` file in the `shared/src/commonMain` directory and provide the `expect` declaration:

    ```kotlin
    package com.jetbrains.simplelogin.shared
    
    expect fun randomUUID(): String
    ```

2. Create a `Utils.kt` file in the `shared/src/androidMain` directory and provide the `actual` implementation for `randomUUID()` in Android:

    ```kotlin
    package com.jetbrains.simplelogin.shared
    
    import java.util.*
    actual fun randomUUID() = UUID.randomUUID().toString()
    ```

3. Create a `Utils.kt` file in the `shared/src/iosMain` directory and provide the `actual` implementation for `randomUUID()` in iOS:

    ```kotlin
    package com.jetbrains.simplelogin.shared
    
    import platform.Foundation.NSUUID
    actual fun randomUUID(): String = NSUUID().UUIDString()
    ```

For Android and iOS, Kotlin will use different platform-specific implementations.

### Run your cross-platform application on Android

Run your cross-platform application for Android to make sure it works.

![Android login application](android-login.png){width=300}

## Make your cross-platform application work on iOS

Once you've made your Android application cross-platform, you can create an iOS application and reuse the shared business logic in it.

1. [Create an iOS project in Xcode](#create-an-ios-project-in-xcode).

2. [Connect the framework to your iOS project](#connect-the-framework-to-your-ios-project).

3. [Use the shared module from Swift](#use-the-shared-module-from-swift).

### Create an iOS project in Xcode

1. In Xcode, click **File** | **New** | **Project**.

2. Select a template for an iOS app and click **Next**.

   ![iOS project template](ios-project-wizard-1.png)

3. As the product name, specify **simpleLoginIOS** and click **Next**.

   ![iOS project settings](ios-project-wizard-2.png)

4. As the location for your project, select the directory that stores your cross-platform application, for example, `kmm-integrate-into-existing-app`.

In Android Studio, you'll get the following structure:

![iOS project in Android Studio](ios-project-in-as.png){width=194}

You can rename the `simpleLoginIOS` directory to `iosApp` for consistency with other top-level directories of your cross-platform project.

![Renamed iOS project directory in Android Studio](ios-directory-renamed-in-as.png){width=194}

### Connect the framework to your iOS project

Once you have the framework, you can connect it to your iOS project manually.

> An alternative is to [configure integration via Cocoapods](native-cocoapods.md), but that integration is beyond the scope of this tutorial.
>
{type="note"}

Connect your framework to the iOS project manually:

1. In Xcode, open the iOS project settings by double-clicking the project name.

2. On the **Build Phases** tab of the project settings, click the **+** and add **New Run Script Phase**.

   ![Add run script phase](xcode-run-script-phase-1.png)

3. Add the following script:

    ```text
    cd "$SRCROOT/.."
    ./gradlew :shared:embedAndSignAppleFrameworkForXcode
    ```

   ![Add the script](xcode-add-run-phase-2.png)

3. Move the **Run Script** phase before the **Compile Sources** phase.

   ![Move the Run Script phase](xcode-run-script-phase-3.png)

4. On the **Build Settings** tab, specify the **Framework Search Path** under **Search Paths** – `$(SRCROOT)/../shared/build/xcode-frameworks/$(CONFIGURATION)/$(SDK_NAME)`.

   ![Framework search path](xcode-add-framework-search-path.png)

5. On the **Build Settings** tab, specify the **Other Linker flags** under **Linking** – `$(inherited) -framework shared`

   ![Linker flag](xcode-add-flag.png)

6. Build the project in Xcode. If everything is set up correctly, the project will successfully build.

### Use the shared module from Swift

1. In Xcode, open the `ContentView.swift` file and import the `shared` module.

    ```Swift
   import shared
   ```

2. To check that it is properly connected, use the `greeting()` function from the KMM module:

    ```Swift
    import SwiftUI
    import shared
    
    struct ContentView: View {
        var body: some View {
            Text(Greeting().greeting())
            .padding()
        }   
    }
   ```

   ![Greeting from the KMM module](xcode-iphone-hello.png){width=300}

3. In `ContentView.swift`, write [code for using data from the KMM module and rendering the application UI](https://github.com/Kotlin/kmm-integration-sample/blob/final/SimpleLoginIOS/SimpleLoginIOS/ContentView.swift).

4. In `simpleLoginIOSApp.swift`, import the `shared` module and specify the arguments for the `ContentView()` function:

    ```Swift
    import SwiftUI
    import shared
    
    @main
    struct SimpleLoginIOSApp: App {
        var body: some Scene {
            WindowGroup {
                ContentView(viewModel: .init(loginRepository: LoginRepository(dataSource: LoginDataSource()), loginValidator: LoginDataValidator()))
            }
        }
    }
   ```  

   ![Simple login application](xcode-iphone-login.png){width=300}

## Enjoy the results – update the logic only once

Now your application is cross-platform. You can update the business logic in one place and see results on both Android and iOS.

1. In Android Studio, change the validation logic for a user's password in the `checkPassword()` function of the `LoginDataValidator` class:

    ```kotlin 
    package com.jetbrains.simplelogin.shared.data

    class LoginDataValidator {
    //... 
        fun checkPassword(password: String): Result {
            return when  {
                password.length < 5 -> Result.Error("Password must be >5 characters")
                password.toLowerCase() == "password" -> Result.Error("Password shouldn't be \"password\"")
                else -> Result.Success
            }
    }
    //...
    }
    ``` 

2. Update `gradle.properties` to connect your iOS application to Android Studio for running it on a simulated or real device right there:

    ```text
    xcodeproj=iosApp/SimpleLoginIOS.xcodeproj
    ```

3. Synchronize the Gradle files by clicking **Sync Now** in the warning.

   ![Synchronize the Gradle files](gradle-sync.png)

You will see the new run configuration **simpleLoginIOS** for running your iOS application right from Android Studio.

![iOS run configuration](ios-run-configuration-simplelogin.png){width=200}

![iOS application password error](iphone-password-error.png){width=300}

![Android application password error](android-password-error.png){width=300}

You can review the [final code for this tutorial](https://github.com/Kotlin/kmm-integration-sample/tree/final).

## What else to share?

You've shared the business logic of your application, but you can also decide to share other layers of your application.
For example, the `ViewModel` class code is almost the same for [Android](https://github.com/Kotlin/kmm-integration-sample/blob/final/app/src/main/java/com/jetbrains/simplelogin/androidapp/ui/login/LoginViewModel.kt) and [iOS applications](https://github.com/Kotlin/kmm-integration-sample/blob/final/SimpleLoginIOS/SimpleLoginIOS/ContentView.swift#L91), and you can share it if your mobile applications
should have the same presentation layer.

## What's next?

* [Use Ktor for networking](kmm-use-ktor-for-networking.md)
* [Add dependencies on libraries](kmm-add-dependencies.md)
* [Learn about concurrency](kmm-concurrency-overview.md)

