[//]: # (title: Share more logic between iOS and Android)

<microformat>
    <p>This is the fifth part of the <strong>Getting started with Kotlin Multiplatform for mobile</strong> tutorial. Before proceeding, make sure you've completed previous steps.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up an environment</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-mobile-create-first-app.md">Create your first cross-platform app</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-mobile-update-ui.md">Update the user interface</a><br/>
      <img src="icon-4-done.svg" width="20" alt="Fourth step"/> <a href="multiplatform-mobile-dependencies.md">Add dependencies</a><br/>
      <img src="icon-5.svg" width="20" alt="Fifth step"/> <strong>Share more logic</strong><br/>
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

1. In `shared/src/commonMain/kotlin`, create a new `RocketComponent` class.
2. Add the `httpClient` property that will be used to retrieve some rocket launch information through an HTTP GET request:

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.plugins.contentnegotiation.*
    import io.ktor.serialization.kotlinx.json.*
    import kotlinx.serialization.json.Json
    
    class RocketComponent {
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

   * To deserialize the result of the GET request,
     the [ContentNegotiation Ktor plugin](https://ktor.io/docs/serialization-client.html#register_json) and the JSON serializer are used.
   * The JSON serializer is configured here to print the JSON in a more human-readable manner with the `prettyPrint` property,
     be more flexible when reading malformed JSON with `isLenient`,
     and ignore keys that haven't been declared in the rocket launch model with `ignoreUnknownKeys`.

3. Add a suspending function to `RocketComponent` called `getDateOfLastSuccessfulLaunch()`:

   ```kotlin
   private suspend fun getDateOfLastSuccessfulLaunch(): String {
       // ...
   }
   ```

4. Call the `httpClient.get` function to retrieve the information about the rocket launches:

   ```kotlin
   import RocketLaunch
   import io.ktor.client.request.*

   private suspend fun getDateOfLastSuccessfulLaunch(): String {
       val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
   }
   ```

   * `httpClient.get()` is also a suspending function,
     because it needs to retrieve data over the internet in an asynchronous manner without blocking threads.
   * Suspending functions can only be called from coroutines or other suspend functions. This is why `getDateOfLastSuccessfulLaunch()`
     was marked with the `suspend` keyword. The network request will be executed in the HTTP client's thread pool.

5. Update the function again to find the last successful launch in the list:

   ```kotlin
   import io.ktor.client.call.*
   
   private suspend fun getDateOfLastSuccessfulLaunch(): String {
       val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
       val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
   }
   ```

   The list of rocket launches is sorted by date from oldest to newest.

6. Convert the launch date from UTC to a local date and create a formatted string:

   ```kotlin
   import kotlinx.datetime.Instant
   import kotlinx.datetime.TimeZone
   import kotlinx.datetime.toLocalDateTime

   private suspend fun getDateOfLastSuccessfulLaunch(): String {
       val rockets: List<RocketLaunch> =
           httpClient.get("https://api.spacexdata.com/v4/launches").body()
       val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
       val date = Instant.parse(lastSuccessLaunch.launchDateUTC)
           .toLocalDateTime(TimeZone.currentSystemDefault())
       return "${date.month} ${date.dayOfMonth}, ${date.year}"
   }
   ```
   
   The date will have the "MMMM DD, YYYY" format, for example, OCTOBER 5, 2022.

7. Add another suspending function `launchPhrase()` that will create a message using the `getDateOfLastSuccessfulLaunch()`
   function:

   ```kotlin
   suspend fun launchPhrase(): String =
       try {
           "The last successful launch was on ${getDateOfLastSuccessfulLaunch()} 🚀"
       } catch (e: Exception) {
           println("Exception during getting the date of the last successful launch $e")
           "Error occurred"
       }
   ```
### Create the flow

You can use flows instead of suspending functions. They emit a sequence of values as opposed to a single value that
suspending functions return.

1. Navigate to the `Greeting.kt` file in the `shared/src/commonMain/kotlin` directory.
2. Add the `rocketComponent` property that will get the message with the last successful launch date:

   ```kotlin
   private val rocketComponent = RocketComponent()
   ```

3. Change the `greet()` function to return a `Flow`:

   ```kotlin
   import kotlinx.coroutines.delay
   import kotlinx.coroutines.flow.Flow
   import kotlinx.coroutines.flow.flow
   import kotlin.time.Duration.Companion.seconds

   fun greet(): Flow<String> = flow {
        emit(if (Random.nextBoolean()) "Hi!" else "Hello!")
        delay(1.seconds)
        emit("Guess what it is! > ${platform.name.reversed()}")
        delay(1.seconds)
        emit(daysPhrase())
        emit(rocketComponent.launchPhrase())
   }
   ```

   * The `Flow` is created here with the `flow()` builder function that wraps all the statements.
   * The `Flow` emits strings with a delay of a second between each emission. The last element is only emitted after
     the network response returns, so the exact delay depends on your network.

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

You've already updated the API of the shared module by changing the return type of the `greet()` function to a `Flow`.
Now you need to update native (iOS, Android) parts of the project, so that they can properly handle the result of calling
the `greet()` function.

### Android app

As both the shared module and the Android application are written in Kotlin, using shared code from Android is straightforward.

#### Introduce a view model

As the application is becoming more complex, it's time to introduce a view model to your `MainActivity` class.
The view model will manage the data from `Activity` and won't disappear when the `Activity` undergoes a lifecycle change.

1. Add the following dependencies to your `androidApp/build.gradle.kts` file:

    ```kotlin
    dependencies {
        // ...
        implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1")
        implementation("androidx.lifecycle:lifecycle-runtime-compose:2.6.1")
    }
    ```

2. In `androidApp/src/main/java`, create a new `MainViewModel` class:

    ```kotlin
    import androidx.lifecycle.ViewModel
    
    class MainViewModel : ViewModel() {
        // ...
    }
    ```

    This class extends Android's `ViewModel` class which ensures the correct behavior in terms of lifecycle and configuration changes.

3. Create a `greetingList` value of the [StateFlow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/)
   type and its backing property:

    ```kotlin
    import kotlinx.coroutines.flow.MutableStateFlow
    import kotlinx.coroutines.flow.StateFlow
    
    class MainViewModel : ViewModel() {
        private val _greetingList = MutableStateFlow<List<String>>(listOf())
        val greetingList: StateFlow<List<String>> get() = _greetingList
    }
    ```
    
    * `StateFlow` here extends the `Flow` interface but has a single value or state.
    * The private backing property `_greetingList` ensures that just the read-only `greetingList` is  accessible
      to clients of this class.

4. In the `init` function of the View Model, collect all the strings from the `Greeting().greet()` flow:

    ```kotlin
   import androidx.lifecycle.viewModelScope
   import com.example.kotlinmultiplatformsandbox.Greeting
   import kotlinx.coroutines.launch
   
    class MainViewModel : ViewModel() {
    // ...

    init {
        viewModelScope.launch {
            Greeting().greet().collect { phrase ->
               //...
            }
        }
    }
    ```

    Since the `collect()` function is suspended, the `launch` coroutine is used within the view model's scope.
    This means that the launch coroutine will run only during the correct phases of the view model's lifecycle.

5. Inside the `collect` trailing lambda, update the value of `_greetingList` to append the collected `phrase` to the phrases `list`:

    ```kotlin
    import kotlinx.coroutines.flow.update
   
    init {
        viewModelScope.launch {
            Greeting().greet().collect { phrase ->
                _greetingList.update { list -> list + phrase }
            }
        }
    }
    ```
   
    The update() function will update the value automatically.

#### Use the view model's flow from the main activity

In `androidApp/src/main/java`, locate the MainActivity.kt file and update the following class replacing previous implementation:

```kotlin
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.Divider
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle

class MainActivity : ComponentActivity() {
    private val mainViewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApplicationTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colors.background
                ) {
                    val greetings = mainViewModel.greetingList.collectAsStateWithLifecycle()
                    GreetingView(phrases = greetings.value)
                }
            }
        }
    }
}

@Composable
fun GreetingView(phrases: List<String>) {
    LazyColumn(
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        items(phrases) { phrase ->
            Text(phrase)
            Divider()
        }
    }
}


@Preview
@Composable
fun DefaultPreview() {
    MyApplicationTheme {
        GreetingView(listOf("Hello, Android!"))
    }
}
```

* The `collectAsStateWithLifecycle()` function calls on `greetingsList()` to collect the value from the view model's flow
  and represent it as a compose state in a lifecycle-aware manner.
* When a new flow is created, the compose state will change and cause a recomposition of every composable using `greetings.value`,
  namely `GreetingView`. It's a scrollable `LazyColumn` with phrases arranged vertically and separated by dividers.

### iOS app

For the iOS part of the project, you'll make use of the [Model–view–viewmodel](https://en.wikipedia.org/wiki/Model–view–viewmodel)
pattern again to connect the UI to the shared module, which contains all the business logic.

The module is already connected to the iOS project — the Android Studio plugin wizard did all the configuration. The module
is already imported and used in `ContentView.swift` with `import shared`.

> If you see errors in Xcode regarding the shared module or when updating your code, run the **iosApp** from Android Studio.
>
{type="tip"}

#### Introducing a view model

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

3. In `iosApp/ContentView.swift`, create a `ViewModel` class for `ContentView`, which will prepare and manage data for it:

    ```Swift
    import SwiftUI
    import shared
    
    struct ContentView: View {
        @ObservedObject private(set) var viewModel: ViewModel
    
        var body: some View {
            ListView(phrases: viewModel.greetings)
                .onAppear { self.viewModel.startObserving() }
        }
    }
    
    extension ContentView {
        @MainActor
        class ViewModel: ObservableObject {
            @Published var greetings: Array<String> = []
            
            func startObserving() {
                // ...
            }
        }
    }
    
    struct ListView: View {
        let phrases: Array<String>
    
        var body: some View {
            List(phrases, id: \.self) {
                Text($0)
            }
        }
    }
    ```
    
    * `ViewModel` is declared as an extension to `ContentView`, as they are closely connected.
    * `ViewModel` has a property `greetings` that is an array of String phrases. SwiftUI connects the view model (`ContentView.ViewModel`) with the view (`ContentView`).
    * `ContentView.ViewModel` is declared as an `ObservableObject`.
    * The `@Published` wrapper is used for the `greetings` property.
    * The `@ObservedObject` property wrapper is used to subscribe to the view model.

Now the view model will emit signals whenever this property changes.

#### Choose a library to consume flows from iOS

In this tutorial, you can choose between the [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines)
and [SKIE](https://github.com/touchlab/SKIE/) libraries. Both are open-sources solutions that help work with flows in iOS.
They support cancellation and generics with flows, something that the Kotlin/Native compiler doesn't provide by default yet.

The SKIE library augments the Objective-C API produced by the Kotlin Multiplatform compiler.
Using SKIE is less verbose as it doesn't use wrappers around flows. It's easier to set up because it will be part of the
framework rather than a dependency that needs to be added as a CocoaPod or SPM file. Apart from flows, SKIE also supports
[other features](https://skie.touchlab.co/features/).

The KMP-NativeCoroutines library helps you consume suspending functions and flows from iOS.
It's a more tried-and-tested option, and may be a more stable solution at the moment.

#### Option 1. Configure KMP-NativeCoroutines {initial-collapse-state="collapsed"}

1. Get back to Android Studio. In the `build.gradle.kts` file of the _whole project_,
   add the KSP (Kotlin Symbol Processor) and KMP-NativeCoroutines plugins to the `plugins` section:

    ```kotlin
    id("com.google.devtools.ksp").version("1.8.22-1.0.11").apply(false)
    id("com.rickclephas.kmp.nativecoroutines").version("1.0.0-ALPHA-12").apply(false)
    ```

2. In the _shared_ `build.gradle.kts` file, configure the KMP-NativeCoroutines plugin:

    ```kotlin
    plugins {
        id("com.google.devtools.ksp")
        id("com.rickclephas.kmp.nativecoroutines")
    }
    ```

3. Synchronize the Gradle files by clicking **Sync Now** in the notification.
4. In the _shared_ `build.gradle.kts` file, opt in to the experimental `@ObjCName` annotation:

    ```kotlin
    kotlin.sourceSets.all {
        languageSettings.optIn("kotlin.experimental.ExperimentalObjCName")
    }
    ```
   
##### Mark the flow with KMP-NativeCoroutines

1. Navigate to the `shared/src/commonMain` directory and locate the `Greeting.kt` file.
2. Add the `@NativeCoroutines`annotation to the `greet()` function. This will ensure that the plugin generates the right
   code to support correct flow handling on iOS:
  
   ```kotlin
    import com.rickclephas.kmp.nativecoroutines.NativeCoroutines
    
    class Greeting {
        // ...
       
        @NativeCoroutines
        fun greet(): Flow<String> = flow {
            // ...
        }
    }
    ```

##### Import the library using SPM in XCode

1. In Xcode, right-click the `iosApp` project in the left-hand project menu and select **Add packages**.
2. In the search bar, enter the package name:

     ```none
    https://github.com/rickclephas/KMP-NativeCoroutines.git
    ```

   ![Importing KMP-NativeCoroutines](multiplatform-import-kmp-nativecoroutines.png){width=700}

3. Keep the default options, "Branch" for **Dependency Rule** and "master" for **Version Rule** and click
   the **Add Package** button.
4. In the next window, select "KMPNativeCoroutinesAsync" and "KMPNativeCoroutinesCore" and click **Add Package**:

   ![Add KMP-NativeCoroutines packages](multiplatform-add-package.png){width=350}

    This will install the KMP-NativeCoroutines packages necessary to work with the `async/await` mechanism.

##### Consume the flow using the KMP-NativeCoroutines library

1. In `iosApp/ContentView.swift`, update the `startObserving()` function to consume the flow using KMP-NativeCoroutine's
   `asyncSequence()` function for the `Greeting().greet()` function.
   
   Use a loop and the `await` mechanism to iterate through the flow and update the `greetings` property every time
   the flow emits a value.
2. To support concurrency, wrap the asynchronous operation in a `Task`:

    ```Swift
    func startObserving() {
        Task {
           do {
               let sequence = asyncSequence(for: Greeting().greet())
               for try await phrase in sequence {
                  self.greetings.append(phrase)
               }
           } catch {
               print("Failed with error: \(error)")
           }
       }
    }
    ```

3. Mark `ViewModel` with the `@MainActor` annotation. It ensures all asynchronous operations within `ViewModel` run on
   the main thread to comply with Kotlin/Native requirement:

    ```Swift
    // ...
    import KMPNativeCoroutinesAsync
    import KMPNativeCoroutinesCore
    
    // ...
    extension ContentView {
        @MainActor
        class ViewModel: ObservableObject {
            @Published var greetings: Array<String> = []
            
            func startObserving() {
                Task {
                   do {
                       let sequence = asyncSequence(for: Greeting().greet())
                       for try await phrase in sequence {
                           self.greetings.append(phrase)
                       }
                   } catch {
                       print("Failed with error: \(error)")
                   }
               }
            }
        }
    }
    ```

4. Re-run both **androidApp** and **iosApp** configurations from Android Studio to make sure your app's logic is synced:

    ![Final results](multiplatform-mobile-upgrade.png){width=500}

> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-kmp).
>
{type="note"}

#### Option 2. Configure SKIE {initial-collapse-state="collapsed"}

To set up the library, in `shared/build.gradle.kts`, configure the SKIE plugin and click the **Sync** button.

```kotlin
plugins {
    id("co.touchlab.skie") version "0.4.19"
}
```

> We recommend using the latest version of the library.
> Check the [SKIE repository](https://github.com/touchlab/SKIE/releases) to see if a newer version of the plugin is available.
>
{type="tip"}

##### Consume the flow using SKIE

1. Use a loop and the `await` mechanism to iterate through the `Greeting().greet()` flow and update the `greetings`
   property every time the flow emits a value.
2. To support concurrency, wrap the asynchronous operation in a `Task`:

    ```Swift
    func startObserving() {
        Task {
           do {
               for try await phrase in Greeting().greet() {
                  self.greetings.append(phrase)
               }
           } catch {
               print("Failed with error: \(error)")
           }
       }
    }
    ```

3. Mark `ViewModel` with the `@MainActor` annotation. It ensures all asynchronous operations within `ViewModel` run on
   the main thread to comply with Kotlin/Native requirement:

    ```Swift
    // ...
    extension ContentView {
        @MainActor
        class ViewModel: ObservableObject {
            @Published var greetings: Array<String> = []
            
            func startObserving() {
                Task {
                    do {
                        for try await phrase in Greeting().greet() {
                            self.greetings.append(phrase)
                        }
                    } catch {
                        print("Failed with error: \(error)")
                    }
                }
            }
        }
    }
    ```

4. Re-run both **androidApp** and **iosApp** configurations from Android Studio to make sure your app's logic is synced:

   ![Final results](multiplatform-mobile-upgrade.png){width=500}

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
