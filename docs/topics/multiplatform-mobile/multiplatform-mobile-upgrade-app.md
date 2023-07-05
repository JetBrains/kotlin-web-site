[//]: # (title: Share the logic)

<microformat>
    <p>This is the fifth part of the <strong>Getting started with Kotlin Multiplatform for mobile</strong> tutorial. Before proceeding, make sure you've completed previous steps.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up an environment</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-mobile-create-first-app.md">Create your first cross-platform app</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-mobile-update-ui.md">Update UI</a><br/>
      <img src="icon-4-done.svg" width="20" alt="Fourth step"/> <a href="multiplatform-mobile-dependencies.md">Add dependencies</a><br/>
      <img src="icon-5.svg" width="20" alt="Fifth step"/> <strong>Share the logic</strong><br/>
      <img src="icon-6-todo.svg" width="20" alt="Sixth step"/> Wrap up your project</p>
</microformat>

You've already implemented common logic using external dependencies. Now you can add more complex logic. Network
requests and data serialization are the [most popular cases](https://kotlinlang.org/lp/multiplatform/) to share with Kotlin
Multiplatform. Learn how to implement these in your first application, so that after completing this onboarding journey
you can use them in future projects.

The updated app will retrieve data over the internet from a [SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)
and display the date of the last successful launch of a SpaceX rocket.

## Add more dependencies

You'll need the following multiplatform libraries in your project:

* [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines), for using coroutines to write asynchronous code,
  which allows simultaneous operations.
* [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization), for deserializing JSON responses into objects of entity classes used to process
  network operations.
* [Ktor](https://ktor.io/), a framework as an HTTP client for retrieving data over the internet.

### kotlinx.coroutines

To add `kotlinx.coroutines` to your project, specify a dependency in the common source set. To do so, add the following
line to the `build.gradle.kts` file of the shared module:

```kotlin
sourceSets {
    val commonMain by getting {
        dependencies {
            // ...
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

The Multiplatform Gradle plugin automatically adds a dependency to the platform-specific (iOS and Android) parts
of `kotlinx.coroutines`.

#### If you use Kotlin prior to version 1.7.20

If you use Kotlin 1.7.20 and later, you already have the new Kotlin/Native memory manager enabled by default.
If it's not the case, add the following to the end of the `build.gradle.kts` file:

```kotlin
kotlin.targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget::class.java) {
    binaries.all {
        binaryOptions["memoryModel"] = "experimental"
    }
}
```

### kotlinx.serialization

For `kotlinx.serialization`, you need the plugin required by the build system. The Kotlin serialization plugin is shipped
with the Kotlin compiler distribution, and the IntelliJ IDEA plugin is bundled into the Kotlin plugin.

You can set up the serialization plugin with the Kotlin plugin using the Gradle plugins DSL by adding this line to
the existing `plugins` block at the very beginning of the `build.gradle.kts` file in the shared module:

```kotlin
plugins {
    // ...
    kotlin("plugin.serialization") version "%kotlinVersion%"
}
```

### Ktor

You can add Ktor in the same way you've added the `kotlinx.coroutines` library. In addition to specifying the core
dependency (`ktor-client-core`) in the common source set, you also need to:

* Add the ContentNegotiation functionality (`ktor-client-content-negotiation`), responsible for serializing/deserializing
  the content in a specific format.
* Add the `ktor-serialization-kotlinx-json` dependency to instruct Ktor to use the JSON format and `kotlinx.serialization`
  as a serialization library. Ktor will expect JSON data and deserialize it into a data class when receiving responses.
* Provide the platform engines by adding dependencies on the corresponding artifacts in the platform source sets
  (`ktor-client-android`, `ktor-client-darwin`).

```kotlin
val ktorVersion = "%ktorVersion%"

sourceSets {
    val commonMain by getting {
        dependencies {
            // ...
            implementation("io.ktor:ktor-client-core:$ktorVersion")
            implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
            implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
        }
    }
    val androidMain by getting {
        dependencies {
            implementation("io.ktor:ktor-client-android:$ktorVersion")
        }
    }
    val iosMain by getting {
        // ...
        dependencies {
            implementation("io.ktor:ktor-client-darwin:$ktorVersion") 
        }
    }
}
```

Synchronize the Gradle files by clicking **Sync Now** in the notification.

## Create API requests

You'll need the [SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs) to retrieve data and a single method to
get the list of all launches from the **v4/launches** endpoint.

### Add data model

In `shared/src/commonMain/kotlin`, create a new `RocketLaunch.kt` file in the project folder
and add a data class which stores data from the SpaceX API:

```kotlin
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RocketLaunch (
    @SerialName("flight_number")
    val flightNumber: Int,
    @SerialName("name")
    val missionName: String,
    @SerialName("date_utc")
    val launchDateUTC: String,
    @SerialName("success")
    val launchSuccess: Boolean?,
)
```

* The `RocketLaunch` class is marked with the `@Serializable` annotation, so that the `kotlinx.serialization` plugin can
  automatically generate a default serializer for it.
* The `@SerialName` annotation allows you to redefine field names, making it possible to declare properties in data classes
  with more readable names.

### Connect HTTP client

1. In `Greeting.kt`, create a Ktor `HTTPClient` instance to execute network requests and parse the resulting JSON:

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.plugins.contentnegotiation.*
    import io.ktor.serialization.kotlinx.json.*
    import kotlinx.serialization.json.Json
    
    class Greeting {
        private val platform: Platform = getPlatform()
        
        private val httpClient = HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }
        }
    }
    ```

   To deserialize the result of the GET request,
   the [ContentNegotiation Ktor plugin](https://ktor.io/docs/serialization-client.html#register_json) and the JSON
   serializer are used.

2. In the `greet()` function, retrieve the information about rocket launches by calling the `httpClient.get()`
   method and find the latest launch:

    ```kotlin
    import io.ktor.client.call.*
    import io.ktor.client.request.*

    class Greeting {
        // ...
        @Throws(Exception::class)
        suspend fun greet(): String {
            val rockets: List<RocketLaunch> =
                httpClient.get("https://api.spacexdata.com/v4/launches").body()
            val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
            return "Guess what it is! > ${platform.name.reversed()}!" +
                    "\nThere are only ${daysUntilNewYear()} left until New Year! 🎆" +
                    "\nThe last successful launch was ${lastSuccessLaunch.launchDateUTC} 🚀"
        }
    }
    ```

   The `suspend` modifier in the `greet()` function is necessary because it now contains a call to `get()`. It's a
   suspend function that has an asynchronous operation to retrieve data over the internet and can only be called from
   within a coroutine or another suspend function. The network request will be executed in the HTTP client's thread pool.

### Add internet access permission

To access the internet, the Android application needs appropriate permission. Since all network requests are made from the
shared module, it makes sense to add the internet access permission to its manifest.

Update your `androidApp/src/main/AndroidManifest.xml` file with the access permission:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.jetbrains.simplelogin.kotlinmultiplatformsandbox" >
    <uses-permission android:name="android.permission.INTERNET"/>
</manifest>
```

## Update Android and iOS apps

You've already updated the API of the shared module by adding the `suspend` modifier to the `greet()` function. Now you
need to update native (iOS, Android) parts of the project, so they can properly handle the result of calling the
`greet()` function.

### Android app

As both the shared module and the Android application are written in Kotlin, using shared code from Android is
straightforward:

In `androidApp/src/main/java`, locate the `MainActivity.kt` file and update the following class replacing previous implementation:

```kotlin
import androidx.compose.runtime.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApplicationTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colors.background
                ) {
                    var text by remember { mutableStateOf("Loading") }
                    LaunchedEffect(true) {
                        text = try {
                            Greeting().greet()
                        } catch (e: Exception) {
                            e.localizedMessage ?: "error"
                        }
                    }
                    GreetingView(text)
                }
            }
        }
    }
}
```

The `greet()` function is now called inside `LaunchedEffect` to avoid recalling it on each recomposition.

### iOS app

For the iOS part of the project, you'll make use of [SwiftUI](https://developer.apple.com/xcode/swiftui/) to build the user
interface and the [Model–view–viewmodel](https://en.wikipedia.org/wiki/Model–view–viewmodel) pattern to connect the UI to
the shared module, which contains all the business logic.

The module is already connected to the iOS project — the Android Studio plugin wizard did all the configuration. The module
is already imported and used in `ContentView.swift` with `import shared`.

> If you see errors in Xcode regarding the shared module or when updating your code, run the **iosApp** from Android Studio.
>
{type="tip"}

1. Get back to your iOS app in Xcode.
2. In `iosApp/iOSApp.swift`, update the entry point for your app:
   
   ```swift
   @main
   struct iOSApp: App {
       var body: some Scene {
           WindowGroup {
               ContentView(viewModel: ContentView.ViewModel())
           }
       }
   }
   ```

3. In `iosApp/ContentView.swift`, create a `ViewModel` class for `ContentView`, which will prepare and manage data
   for it:

    ```swift
    import SwiftUI
    import shared
    
    struct ContentView: View {
        @ObservedObject private(set) var viewModel: ViewModel
    
        var body: some View {
            Text(viewModel.text)
        }
    }
    
    extension ContentView {
        class ViewModel: ObservableObject {
            @Published var text = "Loading..."
            init() {
                // Data will be loaded here
            }
        }
    }
    ```

   * `ViewModel` is declared as an extension to `ContentView`, as they are closely connected.
   * The [Combine framework](https://developer.apple.com/documentation/combine) connects the view model (`ContentView.ViewModel`)
   with the view (`ContentView`).
   * `ContentView.ViewModel` is declared as an `ObservableObject`.
   * The `@Published` wrapper is used for the `text` property.
   * The `@ObservedObject` property wrapper is used to subscribe to the view model.

   Now the view model will emit signals whenever this property changes.

4. Call the `greet()` function, which now also loads data from the SpaceX API, and save the result in the `text` property:

    ```swift
    class ViewModel: ObservableObject {
        @Published var text = "Loading..."
        init() {
            Greeting().greet { greeting, error in
                DispatchQueue.main.async {
                    if let greeting = greeting {
                        self.text = greeting
                    } else {
                        self.text = error?.localizedDescription ?? "error"
                    }
                }
            }
        }
    }
    ```

   * Kotlin/Native [provides bidirectional interoperability with Objective-C](https://kotlinlang.org/docs/native-objc-interop.html#mappings), thus
   Kotlin concepts, including `suspend` functions, are mapped to the corresponding Swift/Objective-C concepts and vice versa. When you
   compile a Kotlin module into an Apple framework, suspending functions are available in it as functions with
   callbacks (`completionHandler`).
   * The `greet()` function was marked with the `@Throws(Exception::class)` annotation. So any exceptions that are
   instances of the `Exception` class or its subclass will be propagated as `NSError`, so you can handle them in the `completionHandler`.
   * When calling Kotlin `suspend` functions from Swift, completion handlers might be called on threads other than main,
   see the [iOS integration](native-ios-integration.md#completion-handlers) in the Kotlin/Native memory manager.
   That's why `DispatchQueue.main.async` is used to update `text` property.

6. Re-run both **androidApp** and **iosApp** configurations from Android Studio to make sure your app's logic is synced:

   ![Final results](multiplatform-mobile-upgrade.png){width="500"}

> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-kmp).
> 
{type="note"}

## Next step

In the final part of the tutorial, you'll wrap up your project and see what steps to take next.

**[Proceed to the next part](multiplatform-mobile-wrap-up.md)**

### See also

* Explore various approaches to [composition of suspending functions](composing-suspending-functions.md).
* Learn more about the [interoperability with Objective-C frameworks and libraries](native-objc-interop.md).
* Complete this tutorial on [networking and data storage](multiplatform-mobile-ktor-sqldelight.md).

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).
