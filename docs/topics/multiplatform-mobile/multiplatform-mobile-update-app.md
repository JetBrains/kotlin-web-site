[//]: # (title: Upgrade your app)

<microformat>
    <p>This is a part of the <strong>Getting started with Kotlin Multiplatform Mobile</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up environment</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-mobile-create-first-app.md">Create your first cross-platform app</a><br/><img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-mobile-dependencies.md">Add dependencies</a><br/><img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>Upgrade your app</strong><br/><img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Wrap up your project</p>
</microformat>

You've already implemented common logic using external dependencies. Now you can add more complex logic. Network
requests and data serialization are the [most popular cases](https://kotlinlang.org/lp/mobile/) to share with Kotlin Multiplatform. Learn how to implement
them in your first application so that after completing this onboarding journey, you can use them in future projects.

## Add more dependencies

You'll need the following multiplatform libraries in your project:

* `kotlinx.coroutines` for using coroutines in asynchronous code
* Ktor, as an HTTP client for retrieving data over the internet
* `kotlinx.serialization` for deserializing JSON responses into objects of entity classes

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
val ktorVersion = "1.6.1"

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
            // ...
            implementation("io.ktor:ktor-client-android:$ktorVersion")
        }
    }
    val iosMain by getting {
        dependencies {
            // ...
            implementation("io.ktor:ktor-client-darwin:$ktorVersion")
        }
    }
}
```

Now you have all the necessary dependencies for your Kotlin Multiplatform Mobile module.

## Making API requests

You'll need the [SpaceX public API](https://docs.spacexdata.com/?version=latest) to retrieve data and a single method to
get the list of all launches from the **v3/launches** endpoint.

### Adding data model

First, create a data class which stores data from the SpaceX API:

```kotlin
@Serializable
data class RocketLaunch(
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

* If you mark the `RocketLaunch` class with the `@Serializable` annotation, the `kotlinx.serialization` plugin
automatically generates a default serializer for it.
* The `@SerialName` annotation allows redefining field names, making it possible to declare properties in data classes
with more readable names.

### Using HTTP client

1. Now, create a Ktor `HTTPClient` instance to execute network requests and parse the resulting JSON:

    ```kotlin
    private val httpClient = HttpClient {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            })
        }
    }
    ```

    To deserialize the result of the GET request,
    the [ContentNegotiation Ktor plugin](https://ktor.io/docs/serialization-client.html#register_json) and the JSON
    serializer are used.

2. Retrieve the information about the last rocket launches by calling the `httpClient `get()method and find the latest
   one:

    ```kotlin
    suspend fun greeting(): String {
        val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v3/launches").body()
        val lastSuccessLaunch = rockets.first { it.launchSuccess == true }
        return "Guess what it is! > ${Platform().platform.reversed()}!" + 
                " There are only ${daysUntilNewYear()} left! 🎅🏼 " +
                " The last success launch was at ${lastSuccessLaunch.launchDateUTC} 🚀"
    }
    ```

    The `suspend` modifier in the `greeting()` function is necessary because it now contains a call of the suspend function
    `get()`, which has an asynchronous operation to retrieve data over the internet and can only be called from within a
    coroutine or another suspend function. The network request will be executed in the HTTP client's thread pool.

### Add the Android internet access permission

For the Android application to access the internet, declare the appropriate permission in the application manifest.
Since all network requests are made from the Kotlin Multiplatform Mobile module, it makes sense to add the internet
access permission to its manifest. Update your `shared/src/androidMain/AndroidManifest.xml` file the following way:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
package="com.jetbrains.onboarding" >
<uses-permission android:name="android.permission.INTERNET"/>
</manifest>
```

## Updating Android and iOS apps

You've already updated the API of our shared module by adding the `suspend` modifier to the `greeting()` function. Now you
need to update native (iOS, Android) parts of the project, so they can properly handle the result of calling the
`greeting()` function.

### Android app

As both a shared module and an Android application are written in Kotlin, using shared code from Android is
straightforward:

1. Add `kotlinx.coroutines` library to the Android application by adding a line in the `build.gradle.kts` in the
   androidApp folder:

    ```kotlin
    dependencies {
        // ..
        implementation_("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.2")
    }
    ```

2. Run the `greeting()` function inside the coroutine launched in the main `CoroutineScope` in the `MainActivity` class:

    ```kotlin
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

### iOS app

For the iOS part of the project, you'll need SwiftUI to build the user interface and an MVVM pattern to connect the UI
to the shared module, which contains all the business logic. The module is already connected to the iOS project — the
Android Studio plugin wizard did all the configuration. The module is already imported and used in `ContentView.swift`.

```Swift
import shared
```

Create a `ViewModel` class for `ContentView`, which will prepare and manage data for it. Declare it as an extension to
`ContentView`, as they are closely connected. To connect the view model (`ContentView.ViewModel`) with the view (`ContentView`),
use Combine:

1. Declare `ContentView.ViewModel` as an `ObservableObject`.
2. Use `@Published` wrapper for the text property.
3. Subscribe to the view model with the `@ObservedObject` property wrapper

Now the view model will emit signals whenever this property changes. Update ContentView.swift code:

```Swift
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

And now all you have to do is to call the `greeting() function`, which now also loads data from the SpaceX API, and save
the result in the `text**`** property.

The code will be simple, as
Kotlin/Native [provides bidirectional interoperability with Objective-C](https://kotlinlang.org/docs/native-objc-interop.html#mappings).
Kotlin concepts, including `suspend` functions, are mapped to appropriate Swift/Objective-C and vice versa. When you
compile a Kotlin module into an Apple framework, suspending functions are available in it as functions with
callbacks (`completionHandler`). Also, the `greeting()` function was marked with the `@Throws(Exception::class)`
annotation. So any exceptions that are instances of the `Exception` class or its subclass will be propagated
as `NSError`, so you can handle them in the `completionHandler`:

```Swift
class ViewModel: ObservableObject {
    @Published var text = "Loading..."
        init() {
            Greeting().greeting() { greeting, error in
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


When calling Kotlin `suspend` functions from Swift, completion handlers might be called on threads other than the main,
see the [new memory manager migration guide](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md#new-memory-manager-migration-guide).
That's why `DispatchQueue.main.async` is used to update `text` property, as all UI updates on other threads than main
are now allowed in Swift.

Now you can run both the iOS and Android applications from Android Studio and make sure your app's logic is synced:

## Next step

Now it's time to [wrap up your project](multiplatform-mobile-wrap-up.md) and see what's next.

### See also

* Explore various approaches to [composition of suspending functions](https://kotlinlang.org/docs/composing-suspending-functions.html).
* Learn more about the [interoperability with Objective-C frameworks and libraries](native-objc-interop.md).