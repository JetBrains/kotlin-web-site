[//]: # (title: Upgrade your app)

<microformat>
    <p>This is a part of the <strong>Getting started with Kotlin Multiplatform Mobile</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up environment</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-mobile-create-first-app.md">Create your first cross-platform app</a><br/><img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-mobile-dependencies.md">Add dependencies</a><br/><img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>Upgrade your app</strong><br/><img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Wrap up your project</p>
</microformat>

You've already implemented common logic using external dependencies. Now you can add more complex logic. Network 
requests and data serialization are the [most popular cases](https://kotlinlang.org/lp/mobile/) to share with Kotlin
Multiplatform. Learn how to implement them in your first application so that after completing this onboarding journey,
you can use them in future projects.

The updated app will retrieve data over the internet from a [SpaceX public API](https://docs.spacexdata.com/?version=latest)
and display the date of the first successful launch of a SpaceX rocket.

## Add more dependencies

You'll need the following multiplatform libraries in your project:

* `kotlinx.coroutines` for using coroutines to write asynchronous code, thus allowing simultaneous operations
* `kotlinx.serialization` for deserializing JSON responses into objects of entity classes used to process
network operations
* [Ktor](https://ktor.io/) framework as an HTTP client for retrieving data over the internet

### kotlinx.coroutines

To add `kotlinx.coroutines` to your project, specify a dependency in the common source set. For that, add the following
line to the `build.gradle.kts` file of the shared module:

```kotlin
sourceSets {
    commonMain {
        dependencies {
            // ...
           implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.2")
        }
    }
}
```

Multiplatform Gradle plugin automatically adds a dependency to the platform-specific (iOS and Android) parts
of `kotlinx.coroutines`.

You'll also use the new memory manager for Kotlin/Native, which will become default soon.
Enable it in the same `build.gradle.kts` file:

```kotlin
val commonMain by getting {
    // ...
}

kotlin.targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget::class.java) {
    binaries.all {
        binaryOptions["memoryModel"] = "experimental"
    }
}
```

### kotlinx.serialization

For `kotlinx.serilization`, you need the plugin required by the build system. The Kotlin serialization plugin is shipped
with the Kotlin compiler distribution, and the IntelliJ IDEA plugin is bundled into the Kotlin plugin.

You can set up the serialization plugin with the Kotlin plugin using the Gradle plugins DSL by adding this line to
the `plugins` block at the very beginning of the `build.gradle` file in the shared module:

```kotlin
plugins {
    // 
    kotlin("plugin.serialization") version "1.6.21"
}
```

### Ktor

You can add Ktor the same way you've added the `kotlinx.coroutines` library. In addition to specifying the core
dependency in the common source set, you also need to:

* Add the ContentNegotiation plugin with a special artifact to use `kotlinx.serialization` to deserialize JSON data into
  a data class when receiving responses.
* Provide the platform engines by adding dependencies on the corresponding artifacts in the platform source sets.

```kotlin
val ktorVersion = "2.0.2"

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
    val iosMain by creating {
        // ...
        dependencies {
            implementation("io.ktor:ktor-client-darwin:$ktorVersion")
        }
    }
}
```

Now you have all the necessary dependencies for your Kotlin Multiplatform Mobile module.

## Make API requests

You'll need the [SpaceX public API](https://docs.spacexdata.com/?version=latest) to retrieve data and a single method to
get the list of all launches from the **v3/launches** endpoint.

### Add data model

In `Greeting.kt`, create a data class which stores data from the SpaceX API:

```kotlin
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RocketLaunch (
    SerialName("flight_number")
    val flightNumber: Int,
    @SerialName("mission_name")
    val missionName: String,
    @SerialName("launch_date_utc")
    val launchDateUTC: String,
    @SerialName("launch_success")
    val launchSuccess: Boolean?,
)
```

* The `RocketLaunch` class is marked with the `@Serializable` annotation, so that the `kotlinx.serialization` plugin can
automatically generate a default serializer for it.
* The `@SerialName` annotation allows redefining field names, making it possible to declare properties in data classes
with more readable names.

### Connect HTTP client

1. Create a Ktor `HTTPClient` instance to execute network requests and parse the resulting JSON:

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.plugins.contentnegotiation.*
    import io.ktor.serialization.kotlinx.json.*
    import kotlinx.serialization.json.Json
    
    class Greeting {
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

2. In the `greeting()` function, retrieve the information about rocket launches by calling the `httpClient.get()`
   method and find the latest one:

    ```kotlin
    class Greeting {
        // ...
        @Throws(Exception::class)
        suspend fun greeting(): String {
            val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v3/launches").body()
            val firstSuccessLaunch = rockets.first { it.launchSuccess == true }
            return "Guess what it is! > ${Platform().platform.reversed()}!" +
                "\nThere are only ${daysUntilNewYear()} left! 🎅🏼 " +
                "\nThe first success launch was ${firstSuccessLaunch.launchDateUTC} 🚀"
        }
    }
    ```

    The `suspend` modifier in the `greeting()` function is necessary because it now contains a call of the suspend function
    `get()`, which has an asynchronous operation to retrieve data over the internet and can only be called from within a
    coroutine or another suspend function. The network request will be executed in the HTTP client's thread pool.

### Add internet access permission

To access the internet, the Android application needs appropriate permission. Since all network requests are made from the
shared module, it makes sense to add the internet access permission to its manifest.

Update your `shared/src/androidMain/AndroidManifest.xml` file the following way:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
package="com.jetbrains.onboarding" >
<uses-permission android:name="android.permission.INTERNET"/>
</manifest>
```

## Update Android and iOS apps

You've already updated the API of our shared module by adding the `suspend` modifier to the `greeting()` function. Now you
need to update native (iOS, Android) parts of the project, so they can properly handle the result of calling the
`greeting()` function.

### Android app

As both a shared module and an Android application are written in Kotlin, using shared code from Android is
straightforward:

1. Add `kotlinx.coroutines` library to the Android application by adding a line in the `build.gradle.kts` in the
   `androidApp` folder:

    ```kotlin
    dependencies {
        // ..
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.2")
    }
    ```

2. In `androidApp/src/main`, update the `MainActivity` class replacing previous implementation:

    ```kotlin
   import kotlinx.coroutines.MainScope
   import kotlinx.coroutines.launch

    class MainActivity : AppCompatActivity() {
        private val mainScope = MainScope()
    
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_main)
    
            val tv: TextView = findViewById(R.id.text_view)
            tv.text = "Loading..."
    
            mainScope.launch {
                kotlin.runCatching {
                    Greeting().greeting()
                }.onSuccess {
                    tv.text = it
                }.onFailure {
                    tv.text = it.localizedMessage
                }
            }
        }
    }
    ```
   
    The `greeting()` function is now called inside the coroutine launched in the main `CoroutineScope`.

### iOS app

For the iOS part of the project, you'll make use of [SwiftUI](https://developer.apple.com/xcode/swiftui/) to build the user
interface and the "Model View View-Model" pattern to connect the UI to the shared module, which contains all the business logic.

The module is already connected to the iOS project — the Android Studio plugin wizard did all the configuration. The module
is already imported and used in `ContentView.swift` with `import shared`.

1. In `iosApp/iosApp/ContentView.swift`, create a `ViewModel` class for `ContentView`, which will prepare and manage data
   for it:

    ```Swift
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
    * The [Combine framework](https://developer.apple.com/documentation/combine) connects the view model (ContentView.ViewModel)
    with the view (ContentView).
    * `ContentView.ViewModel` is declared as an `ObservableObject`.
    * `@Published` wrapper is used for the `text` property.
    * `@ObservedObject` property wrapper is used to subscribe to the view model.

    Now the view model will emit signals whenever this property changes.

2. Call the `greeting()` function, which now also loads data from the SpaceX API, and save the result in the `text` property:

    ```Swift
    class ViewModel: ObservableObject {
        @Published var text = "Loading..."
            init() {
                Greeting().greeting { greeting, error in
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
    }
    ```
  
   * Kotlin/Native [provides bidirectional interoperability with Objective-C](https://kotlinlang.org/docs/native-objc-interop.html#mappings), thus
   Kotlin concepts, including `suspend` functions, are mapped to appropriate Swift/Objective-C and vice versa. When you
   compile a Kotlin module into an Apple framework, suspending functions are available in it as functions with
   callbacks (`completionHandler`).
   * The `greeting()` function was marked with the `@Throws(Exception::class)` annotation. So any exceptions that are
   instances of the `Exception` class or its subclass will be propagated as `NSError`, so you can handle them in the `completionHandler`.
   * When calling Kotlin `suspend` functions from Swift, completion handlers might be called on threads other than the main,
   see the [new memory manager migration guide](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md#new-memory-manager-migration-guide).
   That's why `DispatchQueue.main.async` is used to update `text` property, as all UI updates on other threads than main
   are now allowed in Swift.

3. Run both the iOS and Android applications from Android Studio and make sure your app's logic is synced:

    ![Final results](multiplatform-mobile-upgrade.png){width="500"}

## Next step

Now it's time to [wrap up your project](multiplatform-mobile-wrap-up.md) and see what's next.

### See also

* Explore various approaches to [composition of suspending functions](composing-suspending-functions.md).
* Learn more about the [interoperability with Objective-C frameworks and libraries](native-objc-interop.md).
* Complete this tutorial on [networking and data storage](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/01_Introduction).

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT)