[//]: # (title: Share logic and UI)

<microformat>
    <p>This is the third part of the <strong>Getting started with Kotlin Multiplatform for mobile</strong> tutorial. Before proceeding, make sure you've completed the previous step.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up an environment</a><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-mobile-create-first-app.md">Create your first cross-platform app</a><br/>
       <img src="icon-3.svg" width="20" alt="Third step"/> <strong>Share logic and UI</strong><br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Add dependencies<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Upgrade your app<br/>
       <img src="icon-6-todo.svg" width="20" alt="Sixth step"/> Wrap up your project</p>
</microformat>

## Update the logic

1. In `shared/src/commonMain/kotlin`, open the `Greeting.kt` file in the project folder. This directory stores the shared
   code for both Android and iOS. If you make changes to the shared code, you will see them reflected in both applications.

   ![Common Kotlin file](common-kotlin-file.png)

2. Update the shared code by using `[reversed()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html)`,
   the Kotlin standard library function for reversing text that works on all platforms:

    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()
        
        fun greet(): String {
            return "Guess what it is! > ${platform.name.reversed()}!"
        }
    }
    ```

3. Re-run the **androidApp** configuration to see the updated application in the Android simulated device.

   ![Updated mobile multiplatform app on Android](first-multiplatform-project-on-android-2.png){width=300}

4. In Android Studio, switch to **iosApp** and re-run it to see the updated application in the iOS simulated device.

   ![Updated mobile multiplatform app on iOS](first-multiplatform-project-on-ios-2.png){width=300}

With Kotlin Multiplatform, you can share not only logic, but keep the code for UI conceptually similar using native UI
frameworks.

You'll use [Jetpack Compose](https://developer.android.com/jetpack/compose) for the Android part of your application
and SwiftUI for the iOS. They're both declarative UI frameworks, and you'll see similarities in the UI implementations.

// In both cases, you store the data in the `phrases` variable and later iterate over it to produce a list of `Text` items.

## Update UI

### The Android module

The `androidApp` module contains an Android application, defines its main activity and the UI views, and uses the
`shared` module as a regular Android library. The UI of the application uses the Jetpack Compose framework.
Make some changes and see how it is reflected in the UI:

1. Open the `MainActivity.kt` file in `androidApp`.
2. Navigate to the `Greeting` class declaration. Select the `greeting()` function and use the **Ctrl + B**/**Cmd + B** shortcut.
   You'll see that it's a class from the `shared` module you edited in the previous step.
3. Update the `greeting()` function:

    ```kotlin
    fun greeting(): List<String> = buildList {
        add(if (Random.nextBoolean()) "Hi!" else "Hello!")
        add("Guess what it is! > ${platform.name.reversed()}!")
    }
    ```

   Now it returns a list of strings.

4. Go back to `MainActivity.kt`. As you can see, it doesn't compile anymore because the `Greeting` composable
   expects a `String` argument. Update its definition:

   ```kotlin
   @Composable
   fun greeting(phrases: List<String>) {
       LazyColumn { 
           items(phrases) { phrase -> 
               Text(phrase)
           }
       }
   }
   ```

   Here the `LazyColumn` composable shows the list of `Text` items.

5. Update the preview as well, passing a list as an argument:
   ```kotlin
   @Preview
   @Composable
   fun defaultPreview() {
       MyApplicationTheme {
           Greeting(listOf("Hello, Android!"))
       }
   }
   ```

6. Now you can run the Android app to ensure it displays the list:

// SCREENSHOT

### The iOS module

`iosApp` is an Xcode project that builds into an iOS application. It depends on and uses the `shared` module as an iOS
framework. The UI of the app is written in Swift.

1. Launch Xcode. Select **Open a project or file**.
2. Navigate to your project, for example **KotlinMultiplatformSandbox**, and select the `iosApp` folder. Click **Open**.
3. Find to the `greeting()` function declaration. Select the `greeting()` function holding the **Ctrl**/**Cmd** button

   You'll see the Objective-C declarations for the Kotlin functions defined in the `shared` module. Kotlin types are
   represented as Objective-C types when used from Objective-C/Swift. Here the `greeting()` function
   returns `List<String>` in Kotlin and is seen from Swift as returning `NSArray<NSString>`. For more on type mappings,
   see [Interoperability with Swift/Objective-C](native-objc-interop.md).

4. As in the Android app before, the Swift code that uses the `greeting()` function doesn't compile
   because its declaration was changed. Change the SwiftUI code to display a list of items:

   ```Swift
   struct ContentView: View {
   let phrases = Greeting().greeting()
   
       var body: some View {
           List(phrases, id: \.self) {
               Text($0)
           }
       }
   
   }
   ```

    * The results of the `greeting()` call are stored in the `phrases` variable (`let` in Swift is similar to Kotlin's `val`).
    * The `List` function produces a list of `Text` items.

5. Run the app to see the changes:

// TODO screenshot

## Next step

In the next part of the tutorial, you'll learn about dependencies and add a third-party library to expand
the functionality of your project.

**[Proceed to the next part](multiplatform-mobile-dependencies.md)**

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join
  the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).