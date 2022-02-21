[//]: # (title: Create a multiplatfotm app using Ktor and SQLDelight – tutorial)

This tutorial demonstrates how to use Android Studio to create a mobile application for iOS and Android using Kotlin
Multiplatform Mobile with Ktor and SQLDelight.

The application will include a module with shared code for both iOS and Android platforms. Business logic and data
access layers are implemented only once in the shared module, while the UI of both applications will be native.

The output will be an app that retrieves data over the internet from a
public [SpaceX API](https://docs.spacexdata.com/?version=latest), saves it in a local database, and displays a list of
SpaceX rocket launches together with the launch date, results, and a detailed description of the launch:

![Emulator and Simulator](android-and-ios.png){width=500}

You will use the following multiplatform libraries in the project:

* [Ktor](https://ktor.io/docs/client.html) as an HTTP client for retrieving data over the internet.
* [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization) to deserialize JSON responses into objects
  of entity classes
* [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) to write asynchronous code
* [SQLDelight](https://github.com/cashapp/sqldelight) to generate the Kotlin code from SQL queries to create a type-safe
  database API

You can find the [template project](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage) as well as the
source code of the [final application](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) on
the corresponding GitHub repository.

## Before you start

1. Download and install [Android Studio](https://developer.android.com/studio/).
2. Search for
   the [Kotlin Multiplatform Mobile plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)
   in the Android Studio Marketplace and install it for working with the shared module and Android project.
3. Download and install [Xcode](https://developer.apple.com/xcode/) for building the iOS application.

For more details, see the [Set up the environment](kmm-setup.md) section.

## Create a Multiplatform project

1. In Android Studio, select **File** | **New** | **New Project**. In the list of project templates, select **Kotlin
   Multiplatform App** and click **Next**.

   ![KMM Plugin wizard](kmm-wizard.png){width=700}

2. Specify a name for your first application, and click **Next**.
3. Select **Regular framework** in the iOS framework distribution options list.
4. Keep all other options default. Click **Finish**.

   ![KMM Plugin wizard finish](kmm-wizard-finish.png){width=700}

5. To view the complete structure of the multiplatform mobile project, switch the view from **Android** to **Project**.

   ![Project view](project-view.png){width=300}

For more on project features and how to use them,
see [Understand the project structure](kmm-understand-project-structure.md).

> You can find the configured project on the `master` branch [here](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage)
>
{type="note"}

## Add dependencies to the multiplatform library

To add a multiplatform library to the shared module, you need to add dependency instructions (`implementation`) for all
libraries to the `dependencies` block of the relevant source sets in the `build.gradle.kts` file.

Also, both `kotlinx.serialization` and SQLDelight libraries require additional configurations.

1. In the **shared** directory, specify dependencies on all required libraries in the `build.gradle.kts` file:

    ```kotlin
    val coroutinesVersion = "$coroutinesVersion-native-mt"
    val serializationVersion = "$serializationVersion"
    val ktorVersion = "$ktorVersion"
    val sqlDelightVersion: String by project

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutinesVersion")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serializationVersion")
                implementation("io.ktor:ktor-client-core:$ktorVersion")
                implementation("io.ktor:ktor-client-serialization:$ktorVersion")
                implementation("com.squareup.sqldelight:runtime:$sqlDelightVersion")
                }
            }
        val androidMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-android:$ktorVersion")
                implementation("com.squareup.sqldelight:android-driver:$sqlDelightVersion")
            }
        }
        val iosMain by creating {
            //..
            dependencies {
                implementation("io.ktor:ktor-client-ios:$ktorVersion")
                implementation("com.squareup.sqldelight:native-driver:$sqlDelightVersion")
            }
        }
    }
    ```

    * All libraries require a core artifact in the common source set.
    * Both SQLDelight and Ktor libraries need platform drivers in the iOS and Android source sets as well.
    * In addition, Ktor needs the serialization [feature](https://ktor.io/docs/json.html) to use
      `kotlinx.serialization` for processing network requests and responses.

2. At the very beginning of the `build.gradle.kts` file in the same **shared** directory, add the following lines to the
   `plugins` block:

   ```kotlin
       plugins {
       // ...
       kotlin("plugin.serialization")
       id("com.squareup.sqldelight")
   }
   ```

3. Now go to the `build.gradle.kts` file in the project _root directory_ and specify the classpath for the plugin in the
   build system dependencies:

    ```kotlin
    buildscript {
        // ...
        val kotlinVersion = "$kotlinVersion"
        val sqlDelightVersion: String by project
        
        dependencies {
            // ...
            classpath("org.jetbrains.kotlin:kotlin-serialization:$kotlinVersion")
            classpath("com.squareup.sqldelight:gradle-plugin:$sqlDelightVersion")
        }
    }
    ```

4. Finally, define the SQLDelight version in the `gradle.properties` file in the project _root directory_ to ensure that
   the SQLDelight versions of the plugin and the libraries are the same:

    ```
    sqlDelightVersion=$sqlDelightVersion
    ```

5. Sync the Gradle project.

You can read more about adding dependencies in
the [documentation](https://kotlinlang.org/docs/kmm-add-dependencies.html).

> You can find this state of the project on the final branch [here](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## Create an application data model

The Kotlin Multiplatform app will contain the public `SpaceXSDK` class, the facade over networking and cache services.
The application data model will have three entity classes with:

* General information about the launch
* A URL to external information
* Information about the rocket

1. In `shared/src/commonMain/kotlin`, add the `com.jetbrains.handson.kmm.shared.entity` package.
2. Create the `Entity.kt` file inside it.
3. Declare all the data classes for basic entities:

   ```kotlin
   ```
   {src="docs/topics/codeSnippets/multiplatform-mobile-tutorial/Entity.kt" initial-collapse-state="collapsed" collapsed-title="data class RocketLaunch" lines="3-42" }

Each serializable class must be marked with the `@Serializable` annotation. The `kotlinx.serialization` plugin
automatically generates a default serializer for `@Serializable` classes unless you explicitly pass a link to a
serializer through the annotation argument.

Still, in this case, you don't need to do that. The `@SerialName` annotation allows redefining field names, which helps
to declare properties in data classes with more easily readable names.

> You can find the state of the project after this section on the final
> branch [here](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## Configure SQLDelight and implement cache logic

### Configure SQLDelight

The SQLDelight library allows generating a type-safe Kotlin database API from SQL queries. During compilation, the
generator validates the SQL queries and turns them into Kotlin code that can be used in the shared module.

The library is already in the project. To configure it, in the **shared** directory, add the `sqldelight` block, which
will contain a list of databases and their parameters, to the end of the `build.gradle.kts` file:

```kotlin
sqldelight {
    database("AppDatabase") {
        packageName = "com.jetbrains.handson.kmm.shared.cache"
    }
}
```

The `packageName` parameter specifies the package name for the generated Kotlin sources.

There is an official [plugin](https://cashapp.github.io/sqldelight/multiplatform_sqlite/intellij_plugin/) for working
with `.sq` files.

### Generate the database API

First, create the `.sq` file, which will contain all the needed SQL queries. By default, the SQLDelight plugin reads
`.sq` from the `sqldelight` folder:

1. In `shared/src/commonMain/kotlin`, create a new `sqldelight` directory and add
   the `com.jetbrains.handson.kmm.shared.cache` package.
2. Inside it, create an `.sq` file with the name of the database, `AppDatabase.sq`. All the SQL queries for
   the application will be in this file.
3. The database will contain two tables with data about launches and rockets. To create these tables, add the following
   code to the `AppDatabase.sq` file:

   ```sql
   CREATE TABLE Launch
   (
       flightNumber    INTEGER NOT NULL,
       missionName     TEXT    NOT NULL,
       launchYear      INTEGER AS Int NOT NULL DEFAULT 0,
       rocketId        TEXT    NOT NULL,
       details         TEXT,
       launchSuccess   INTEGER AS Boolean DEFAULT NULL,
       launchDateUTC   TEXT    NOT NULL,
       missionPatchUrl TEXT,
       articleUrl      TEXT
   );
   
   CREATE TABLE Rocket
   (
       id   TEXT NOT NULL PRIMARY KEY,
       name TEXT NOT NULL,
       type TEXT NOT NULL
   );
   ```

4. To insert data into these tables, declare SQL insert functions:

   ```sql
   insertLaunch:
   INSERT INTO Launch(flightNumber, missionName, launchYear, rocketId, details, launchSuccess, launchDateUTC, missionPatchUrl, articleUrl)
   VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);
   
   insertRocket:
   INSERT INTO Rocket(id, name, type)
   VALUES(?, ?, ?);
   ```

5. To clear data in the tables, declare SQL delete functions:

   ```sql
   removeAllLaunches:
   DELETE FROM Launch;
   
   removeAllRockets:
   DELETE FROM Rocket;
   ```

6. In the same way, declare functions to retrieve data. For data about a rocket, use its identifier and select
   information about all its launches using a JOIN statement:

   ```sql
   selectRocketById:
   SELECT * FROM Rocket
   WHERE id = ?;
   
   selectAllLaunchesInfo:
   SELECT Launch.*, Rocket.*
   FROM Launch
   LEFT JOIN Rocket ON Rocket.id == Launch.rocketId;
   ```

When the project is compiled, the generated Kotlin code will be stored in the `/shared/build/generated/sqldelight`
directory. The generator will create an interface named `AppDatabase`, as specified in `build.gradle.kts`.

You can learn more about how to [Configure SQLDelight for data storage](kmm-configure-sqldelight-for-data-storage.md).

### Create platform database drivers

To initialize `AppDatabase`, pass an `SqlDriver` instance to it. SQLDelight provides multiple platform-specific
implementations of the SQLite driver, so you need to create them for each platform separately. You can do this with
[expected and actual declarations](mpp-connect-to-apis.md).

1. Create an abstract factory for database drivers. To do this, in `shared/src/commonMain/kotlin`, create
   a `com.jetbrains.handson.kmm.shared.cache` package and a `DatabaseDriverFactory` class inside:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.cache
   
   import com.squareup.sqldelight.db.SqlDriver
   //sampleStart
   expect class DatabaseDriverFactory {
       fun createDriver(): SqlDriver
   }
   //sampleEnd
   ```

   Now you need to provide `actual` implementations for this expected class.

2. On Android, the `AndroidSqliteDriver` class implements the SQLite driver. Pass the database information and the link
   to the context to the `AndroidSqliteDriver` class constructor.

   For this, in the `shared/src/androidMain/kotlin` directory, create the `com.jetbrains.handson.kmm.shared.cache`
   package and a `DatabaseDriverFactory` class inside with the actual implementation:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.cache
   
   import android.content.Context
   import com.squareup.sqldelight.android.AndroidSqliteDriver
   import com.squareup.sqldelight.db.SqlDriver 
   //sampleStart
   actual class DatabaseDriverFactory(private val context: Context) {
       actual fun createDriver(): SqlDriver {
           return AndroidSqliteDriver(AppDatabase.Schema, context, "test.db")
       }
   }
   //sampleEnd
   ```

3. On iOS, the SQLite driver implementation is the `NativeSqliteDriver` class. In the `shared/src/iosMain/kotlin`
   directory, create a `com.jetbrains.handson.kmm.shared.cache` package and a `DatabaseDriverFactory` class inside with
   the actual implementation:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.cache
   
   import com.jetbrains.handson.kmm.shared.cache.AppDatabase
   import com.squareup.sqldelight.db.SqlDriver
   import com.squareup.sqldelight.drivers.native.NativeSqliteDriver
   //sampleStart
   actual class DatabaseDriverFactory {
       actual fun createDriver(): SqlDriver {
           return NativeSqliteDriver(AppDatabase.Schema, "test.db")
       }
   }
   //sampleEnd
   ```

Instances of these factories will be created later in the code of the Android and iOS projects.

You can navigate through `expect` declarations and `actual` realizations with the handy gutter:

![Expect/Actual gutter](expect-actual.png){width=500}

### Implement cache

For now, you have platform database drivers and an `AppDatabase` class to perform database operations. Create
a `Database` class, which will wrap the `AppDatabase` class and contain caching logic.

1. In the common source set `shared/src/commonMain/kotlin`, create a new `Database` class in
   the `com.jetbrains.handson.kmm.shared.cache` package. It will be common to both platform logics.

2. To provide a driver for `AppDatabase`, pass an abstract `DatabaseDriverFactory` to the `Database` class constructor:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.cache
   
   import com.jetbrains.handson.kmm.shared.entity.Links
   import com.jetbrains.handson.kmm.shared.entity.Rocket
   import com.jetbrains.handson.kmm.shared.entity.RocketLaunch
   //sampleStart
   internal class Database(databaseDriverFactory: DatabaseDriverFactory) {
       private val database = AppDatabase(databaseDriverFactory.createDriver())
       private val dbQuery = database.appDatabaseQueries
   }
   //sampleEnd
   ```

   This class's [visibility](visibility-modifiers.md#class-members) is set to internal, which means it is only
   accessible from within the multiplatform module.

3. Inside the `Database` class, implement some data handling operations. Add a function to clear all the tables in the
   database in a single SQL transaction:

   ```kotlin
   internal fun clearDatabase() {
       dbQuery.transaction {
           dbQuery.removeAllRockets()
           dbQuery.removeAllLaunches()
       }
   }
   ```

4. Create a function to get a list of all the rocket launches:

   ```kotlin
   internal fun getAllLaunches(): List<RocketLaunch> {
       return dbQuery.selectAllLaunchesInfo(::mapLaunchSelecting).executeAsList()
   }
   
   private fun mapLaunchSelecting(
       flightNumber: Long,
       missionName: String,
       launchYear: Int,
       rocketId: String,
       details: String?,
       launchSuccess: Boolean?,
       launchDateUTC: String,
       missionPatchUrl: String?,
       articleUrl: String?,
       rocket_id: String?,
       name: String?,
       type: String?
   ): RocketLaunch {
       return RocketLaunch(
           flightNumber = flightNumber.toInt(),
           missionName = missionName,
           launchYear = launchYear,
           details = details,
           launchDateUTC = launchDateUTC,
           launchSuccess = launchSuccess,
           rocket = Rocket(
               id = rocketId,
               name = name!!,
               type = type!!
           ),
           links = Links(
               missionPatchUrl = missionPatchUrl,
               articleUrl = articleUrl
           )
       )
   }
   ```

   The argument passed to `selectAllLaunchesInfo` is a function that maps the database entity class to another type. In
   this case, to the `RocketLaunch` data model class.

5. Add a function to insert data into the database:

   ```kotlin
   internal fun createLaunches(launches: List<RocketLaunch>) {
       dbQuery.transaction {
           launches.forEach { launch ->
               val rocket = dbQuery.selectRocketById(launch.rocket.id).executeAsOneOrNull()
               if (rocket == null) {
                   insertRocket(launch)
               }
   
               insertLaunch(launch)
           }
       }
   }
   
   private fun insertRocket(launch: RocketLaunch) {
       dbQuery.insertRocket(
           id = launch.rocket.id,
           name = launch.rocket.name,
           type = launch.rocket.type
       )
   }
   
   private fun insertLaunch(launch: RocketLaunch) {
       dbQuery.insertLaunch(
           flightNumber = launch.flightNumber.toLong(),
           missionName = launch.missionName,
           launchYear = launch.launchYear,
           rocketId = launch.rocket.id,
           details = launch.details,
           launchSuccess = launch.launchSuccess ?: false,
           launchDateUTC = launch.launchDateUTC,
           missionPatchUrl = launch.links.missionPatchUrl,
           articleUrl = launch.links.articleUrl
       )
   }
   ```

The `Database` class instance will be created later, along with the SDK facade class.

> You can find the state of the project after this section on the final
> branch [here](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## Implement an API service

To retrieve data via the internet, you'll need the [SpaceX public API](https://docs.spacexdata.com/?version=latest) and
a single method to retrieve the list of all launches from the `v3/launches` endpoint.

Create a class that will connect the application to the API:

1. In the common source set `shared/src/commonMain/kotlin`, create the `com.jetbrains.handson.kmm.shared.network`
   package and the `SpaceXApi` class inside:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.network
   
   import com.jetbrains.handson.kmm.shared.entity.RocketLaunch
   import io.ktor.client.HttpClient
   import io.ktor.client.features.json.JsonFeature
   import io.ktor.client.features.json.serializer.KotlinxSerializer
   import io.ktor.client.request.*
   import kotlinx.serialization.json.Json
   //sampleStart
   class SpaceXApi {
    private val httpClient = HttpClient {
        install(JsonFeature) {
            val json = Json {
                ignoreUnknownKeys = true
                useAlternativeNames = false
            }
            serializer = KotlinxSerializer(json)
            }
        }
   }
   //sampleEnd
   ```

    * This class executes network requests and deserializes JSON responses into entities from the `entity` package. For
      this, the Ktor `HttpClient` instance initializes and stores the `httpClient` property.

    * To deserialize the `GET` request result, the JSON [Ktor client feature](https://ktor.io/docs/json.html) is
      installed. It processes the request and the response payload as JSON, serializing and deserializing them using a
      specific serializer. The `KotlinxSerializer` instance is provided to the feature
      builder for using `kotlinx.serialization`.

3. Define the URL as a constant within the companion object class to send requests:

   ```kotlin
   companion object {
       private const val LAUNCHES_ENDPOINT = "https://api.spacexdata.com/v3/launches"
   }
   ```

4. Declare the data retrieval method that will return the list of `RocketLaunch`:

   ```kotlin
   suspend fun getAllLaunches(): List<RocketLaunch> {
       return httpClient.get(LAUNCHES_ENDPOINT)
   }
   ```

   The `getAllLaunches` function has the `suspend` modifier because it contains a call of the suspend function `get()`,
   which includes an asynchronous operation to retrieve data over the internet and can only be called from within a
   coroutine or another suspend function. The network request will be executed in the HTTP client's thread pool.

### Add internet access permission

To access the internet, the Android application needs appropriate permission. Since all network requests are made
from the shared module, adding internet access permission to this module's manifest makes sense.

Add the following manifest to the `shared/src/androidMain/AndroidManifest.xml` file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.jetbrains.handson.androidApp">
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
```

> You can find the state of the project after this section on the final
> branch [here](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

# Build an SDK

Your iOS and Android applications will communicate with the SpaceX API through the shared module, which will provide a
public class.

1. In the `com.jetbrains.handson.kmm.shared` package of the common source set, create the `SpaceXSDK` class:

   ```kotlin
   package com.jetbrains.handson.kmm.shared
   
   import com.jetbrains.handson.kmm.shared.cache.Database
   import com.jetbrains.handson.kmm.shared.cache.DatabaseDriverFactory
   import com.jetbrains.handson.kmm.shared.network.SpaceXApi
   import com.jetbrains.handson.kmm.shared.entity.RocketLaunch
   //sampleStart
   class SpaceXSDK(databaseDriverFactory: DatabaseDriverFactory) {
       private val database = Database(databaseDriverFactory)
       private val api = SpaceXApi()
   }
   //sampleEnd
   ```

   The class will be the facade over `Database` and `SpaceXApi` classes.

2. To create a `Database` class instance, you'll need to provide the `DatabaseDriverFactory` platform instance to it, so
   you'll inject it from the platform code through the `SpaceXSDK` class constructor.

   ```kotlin
   @Throws(Exception::class)
   suspend fun getLaunches(forceReload: Boolean): List<RocketLaunch> {
       val cachedLaunches = database.getAllLaunches()
       return if (cachedLaunches.isNotEmpty() && !forceReload) {
           cachedLaunches
       } else {
           api.getAllLaunches().also {
               database.clearDatabase()
               database.createLaunches(it)
           }
       }
   }
   ```

    * The class contains one function for getting all launch information. Depending on the value of `forceReload`, it
      returns cached values or loads data from the internet and then updates the cache with the results. If there is no
      cached data, it loads information from the internet independently of the `forceReload` flag value.
    * Clients of your SDK could use a `forceReload` flag to load the latest information about the launches, which would
      allow the user to use the pull-to-refresh gesture.
    * To handle exceptions produced by the Ktor client in Swift, the function is marked with the `@Throws` annotation.

   All Kotlin exceptions are unchecked, while Swift has only checked errors. Thus, to make Swift code aware of expected
   exceptions, Kotlin functions should be marked with an `@Throws` annotation specifying a list of potential exception
   classes.

> You can find the state of the project after this section on the final
> branch [here](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## Create the Android application

Kotlin Multiplatform Mobile plugin for Android Studio has already handled the configuration you need, so the Kotlin
Multiplatform shared module is already connected to your Android application.

Before implementing the UI and presentation logic, add all the required dependencies to
the `androidApp/build.gradle.kts`:

```kotlin
// ...

dependencies {
    implementation(project(":shared"))
    implementation("com.google.android.material:material:1.5.0")
    implementation("androidx.appcompat:appcompat:1.4.1")
    implementation("androidx.constraintlayout:constraintlayout:2.1.3")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.0")
    implementation("androidx.core:core-ktx:1.3.1")
    implementation("androidx.recyclerview:recyclerview:1.1.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("androidx.cardview:cardview:1.0.0")
}

// ...
```

### Implement the UI: display the list of rocket launches

1. To implement the UI, modify `activity_main.xml` in `androidApp/src/main/res/layout`. The screen is based on
   the `ConstraintLayout` with the `SwipeRefreshLayout` inside it, which contains `RecyclerView` and `FrameLayout` with
   a background with `ProgressBar`across its center:

   ```xml
   ```
   {src="docs/topics/codeSnippets/multiplatform-mobile-tutorial/activity_main.xml" initial-collapse-state="collapsed" collapsed-title="androidx.constraintlayout.widget.ConstraintLayout xmlns:android" lines="2-26"}

2. In `androidApp/src/main/java`, add the properties for the UI elements to the `MainActivity` class:

   ```kotlin
   class MainActivity : AppCompatActivity() {
       private lateinit var launchesRecyclerView: RecyclerView
       private lateinit var progressBarView: FrameLayout
       private lateinit var swipeRefreshLayout: SwipeRefreshLayout
   
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
   
           title = "SpaceX Launches"
           setContentView(R.layout.activity_main)
   
           launchesRecyclerView = findViewById(R.id.launchesListRv)
           progressBarView = findViewById(R.id.progressBar)
           swipeRefreshLayout = findViewById(R.id.swipeContainer)
       }
   }
   ```

3. For the `RecyclerView` element to work, you need to create an adapter (as a subclass of `RecyclerView.Adapter`) that
   will convert raw data into list item views. For this, create the `LaunchesRvAdapter` class:

   ```kotlin
   class LaunchesRvAdapter(var launches: List<RocketLaunch>) : RecyclerView.Adapter<LaunchesRvAdapter.LaunchViewHolder>() {
   
       override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LaunchViewHolder {
           return LayoutInflater.from(parent.context)
               .inflate(R.layout.item_launch, parent, false)
               .run(::LaunchViewHolder)
       }
   
       override fun getItemCount(): Int = launches.count()
   
       override fun onBindViewHolder(holder: LaunchViewHolder, position: Int) {
           holder.bindData(launches[position])
       }
   
       inner class LaunchViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
           // ...
   
           fun bindData(launch: RocketLaunch) {
               // ...
           }
       }
   }
   ```

4. Create an `item_launch.xml` resource file in `androidApp/src/main/res/layout/` with the items view layout:

   ```xml
   ```
   {src="docs/topics/codeSnippets/multiplatform-mobile-tutorial/item_launch.xml" initial-collapse-state="collapsed" collapsed-title="androidx.cardview.widget.CardView xmlns:android" lines="2-28"}

5. In `androidApp/src/main/res/values/`, you can create your appearance of the app or copy the following styles:

   <tabs>
   <tab title="colors.xml">

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <resources>
      <color name="colorPrimary">#37474f</color>
      <color name="colorPrimaryDark">#102027</color>
      <color name="colorAccent">#62727b</color>
   
      <color name="colorSuccessful">#4BB543</color>
      <color name="colorUnsuccessful">#FC100D</color>
      <color name="colorNoData">#615F5F</color>
   </resources>
   ```

   </tab>
   <tab title="strings.xml">

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <resources>
       <string name="app_name">SpaceLaunches</string>
   
       <string name="successful">Successful</string>
       <string name="unsuccessful">Unsuccessful</string>
       <string name="no_data">No data</string>
   
       <string name="launch_year_field">Launch year: %s</string>
       <string name="mission_name_field">Launch name: %s</string>
       <string name="launch_success_field">Launch success: %s</string>
       <string name="details_field">Launch details: %s</string>
   </resources>
   ```

   </tab>
   <tab title="styles.xml">

   ```xml
   <resources>
      <!-- Base application theme. -->
      <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
         <!-- Customize your theme here. -->
         <item name="colorPrimary">@color/colorPrimary</item>
         <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
         <item name="colorAccent">@color/colorAccent</item>
      </style>
   </resources>
   ```

   </tab>
   </tabs>

6. Complete the implementation of the `RecyclerView.Adapter`:

   ```kotlin
   class LaunchesRvAdapter(var launches: List<RocketLaunch>) : RecyclerView.Adapter<LaunchesRvAdapter.LaunchViewHolder>() {
       //..
   
       inner class LaunchViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
          private val missionNameTextView = itemView.findViewById<TextView>(R.id.missionName)
          private val launchYearTextView = itemView.findViewById<TextView>(R.id.launchYear)
          private val launchSuccessTextView = itemView.findViewById<TextView>(R.id.launchSuccess)
          private val missionDetailsTextView = itemView.findViewById<TextView>(R.id.details)

          fun bindData(launch: RocketLaunch) {
              val ctx = itemView.context
              missionNameTextView.text = ctx.getString(R.string.mission_name_field, launch.missionName)
              launchYearTextView.text = ctx.getString(R.string.launch_year_field, launch.launchYear.toString())
              missionDetailsTextView.text = ctx.getString(R.string.details_field, launch.details ?: "")
              val launchSuccess = launch.launchSuccess
              if (launchSuccess != null ) {
                  if (launchSuccess) {
                      launchSuccessTextView.text = ctx.getString(R.string.successful)
                      launchSuccessTextView.setTextColor((ContextCompat.getColor(itemView.context, R.color.colorSuccessful)))
                  } else {
                      launchSuccessTextView.text = ctx.getString(R.string.unsuccessful)
                      launchSuccessTextView.setTextColor((ContextCompat.getColor(itemView.context, R.color.colorUnsuccessful)))
                  }
              } else {
                  launchSuccessTextView.text = ctx.getString(R.string.no_data)
                  launchSuccessTextView.setTextColor((ContextCompat.getColor(itemView.context, R.color.colorNoData)))
              }
          }
       }
   }
   ```

7. Create an instance of `LaunchesRvAdapter` in the `MainActivity` class, configure the `RecyclerView` component, add a
   listener to the `SwipeRefreshLayout` to catch the screen refresh gesture, and implement all the `LaunchesListView`
   interface functions:

   ```kotlin
   class MainActivity : AppCompatActivity() {
       // ...
   
       private val launchesRvAdapter = LaunchesRvAdapter(listOf())
   
       override fun onCreate(savedInstanceState: Bundle?) {
           // ...
   
           launchesRecyclerView.adapter = launchesRvAdapter
           launchesRecyclerView.layoutManager = LinearLayoutManager(this)
   
           swipeRefreshLayout.setOnRefreshListener {
               swipeRefreshLayout.isRefreshing = false
               displayLaunches(true)
           }
   
           displayLaunches(false)
       }
   
       private fun displayLaunches(needReload: Boolean) {
           // TODO: Presentation logic
       }
   }
   ```

### Implement presentation logic

1. Create an instance of the `SpaceXSDK` class from the shared module and inject an instance of `DatabaseDriverFactory` in
   it:

   ```kotlin
   class MainActivity : AppCompatActivity() {
       // ...
       private val sdk = SpaceXSDK(DatabaseDriverFactory(this))
   }
   ```

2. Implement the private function `displayLaunches(needReload: Boolean)`. It runs the `getLaunches()` function inside
   the coroutine launched in the main `CoroutineScope`, handles exceptions, and displays the error text in the toast:

   ```kotlin
   class MainActivity : AppCompatActivity() {
       private val mainScope = MainScope()
   
       // ...
   
       override fun onDestroy() {
           super.onDestroy()
           mainScope.cancel()
       }
   
       // ...
   
       private fun displayLaunches(needReload: Boolean) {
           progressBarView.isVisible = true
           mainScope.launch {
               kotlin.runCatching {
                   sdk.getLaunches(needReload)
               }.onSuccess {
                   launchesRvAdapter.launches = it
                   launchesRvAdapter.notifyDataSetChanged()
               }.onFailure {
                   Toast.makeText(this@MainActivity, it.localizedMessage, Toast.LENGTH_SHORT).show()
               }
               progressBarView.isVisible = false
           }
       }
   }
   ```

3. Select **androidApp** from the run configurations menu, choose emulator, and press the run button:

![Android application](android-application.png){width=300}

You've just created an Android application that has its business logic implemented in the Kotlin Multiplatform Mobile
module.

> You can find the state of the project after this section on the final
> branch [here](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

# Create the iOS application

For the iOS part of the project, you'll need SwiftUI to build the user interface and the MVVM pattern to connect the UI
to the shared module, which contains all the business logic. The shared module is already connected to the iOS project —
the Android Studio plugin wizard did all the configuration. You can import it the same way as with regular iOS
dependencies: `import shared`.

So all it's left to do now is implement the SwiftUI views and fill them with the data.

### Implement the UI

First, you'll create a `RocketLaunchRow` SwiftUI view for displaying an item from the list. It will be based on `HStack`
and `VStack` views. There will be extensions on the `RocketLaunchRow` structure with useful helpers for displaying the
data.

1. In your Xcode project, create the new file with the type **SwiftUI View** named `RocketLaunchRow` and update it with
   the following code:

   ```swift
   import SwiftUI
   import shared
   
   struct RocketLaunchRow: View {
       var rocketLaunch: RocketLaunch
   
       var body: some View {
           HStack() {
               VStack(alignment: .leading, spacing: 10.0) {
                   Text("Launch name: \(rocketLaunch.missionName)")
                   Text(launchText).foregroundColor(launchColor)
                   Text("Launch year: \(String(rocketLaunch.launchYear))")
                   Text("Launch details: \(rocketLaunch.details ?? "")")
               }
               Spacer()
           }
       }
   }
   
   extension RocketLaunchRow {
       private var launchText: String {
           if let isSuccess = rocketLaunch.launchSuccess {
               return isSuccess.boolValue ? "Successful" : "Unsuccessful"
           } else {
               return "No data"
           }
       }
   
       private var launchColor: Color {
           if let isSuccess = rocketLaunch.launchSuccess {
               return isSuccess.boolValue ? Color.green : Color.red
           } else {
               return Color.gray
           }
       }
   }
   ```

   The list of the launches will be displayed in the `ContentView`, which the project wizard has already created.

2. Create a `ViewModel` class for the `ContentView`, which will prepare and manage data and declare it as an extension
   to the `ContentView`, as they are closely connected. Add the following code to the `ContentView.swift`:

   ```swift
   // ...
   
   extension ContentView {
       enum LoadableLaunches {
           case loading
           case result([RocketLaunch])
           case error(String)
       }
   
      class ViewModel: ObservableObject {
          @Published var launches = LoadableLaunches.loading
      }
   }
   ```

    * To connect the `ContentView.ViewModel` with the`ContentView`, use **Combine**.
    * `ContentView.ViewModel` is declared as an `ObservableObject` and `@Published` wrapper is used for the `launches`
      property, so the view model will emit signals whenever this property changes.

3. Implement the body of the `ContentView` and display the list of launches:

   ```swift
   struct ContentView: View {
    @ObservedObject private(set) var viewModel: ViewModel
   
        var body: some View {
            NavigationView {
                listView()
                .navigationBarTitle("SpaceX Launches")
                .navigationBarItems(trailing:
                    Button("Reload") {
                        self.viewModel.loadLaunches(forceReload: true)
                })
            }
        }
   
        private func listView() -> AnyView {
            switch viewModel.launches {
            case .loading:
                return AnyView(Text("Loading...").multilineTextAlignment(.center))
            case .result(let launches):
                return AnyView(List(launches) { launch in
                    RocketLaunchRow(rocketLaunch: launch)
                })
            case .error(let description):
                return AnyView(Text(description).multilineTextAlignment(.center))
            }
        }
    }
   ```

   The `@ObservedObject` property wrapper is used to subscribe to the view model.

4. To make it compile, the `RocketLaunch` class needs to confirm the `Identifiable` protocol, as it is used as a
   parameter for initializing the `List` Swift UIView. The `RocketLaunch` class already has a property named `id`, so
   add the following to the bottom of `ContentView.swift`:

   ```
   extension RocketLaunch: Identifiable { }
   ```

### Load data

To retrieve data about the rocket launches in the view model, you'll need an instance of the `SpaceXSDK` from the Multiplatform
library.

1. Pass it in through the constructor:

   ```swift
   extension ContentView {
       // ...
   
       class ViewModel: ObservableObject {
           let sdk: SpaceXSDK
           @Published var launches = LoadableLaunches.loading
   
           init(sdk: SpaceXSDK) {
               self.sdk = sdk
               self.loadLaunches(forceReload: false)
           }
   
           func loadLaunches(forceReload: Bool) {
               // TODO: retrieve data
           }
       }
   }
   ```

2. Call the `getLaunches` from the `SpaceXSDK` class and save the result in the `launches` property:

   
```Swift
func loadLaunches(forceReload: Bool) {
    self.launches = .loading
        sdk.getLaunches(forceReload: forceReload, completionHandler: { launches, error in
            if let launches = launches {
                self.launches = .result(launches)
                } else {
                    self.launches = .error(error?.localizedDescription ?? "error")
                }
            })
        }
```

   * When you compile a Kotlin module into an Apple
   framework, [suspending functions](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
   are available in it as functions with callbacks (`completionHandler`).
   * Since the `getLaunches` function is marked with the `@Throws(Exception::class)` annotation, any exceptions that are
   instances of the `Exception` class or its subclass will be propagated as `NSError`. So all such errors can be handled in
   the `completionHandler`.

3. Go to the entry point of the app, `iOSApp.swift`, initialize the SDK, view, and view model:

   ```swift
   import SwiftUI
   import shared
   
   @main
   struct iOSApp: App {
       let sdk = SpaceXSDK(databaseDriverFactory: DatabaseDriverFactory())
       var body: some Scene {
           WindowGroup {
               ContentView(viewModel: .init(sdk: sdk))
           }
       }
   }
   ```

4. Press the run button and see the result:

![iOS Application](ios-application.png){width=300}

You can find the final version of the project on the final
branch [here](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).

## What's next?

There were some potentially heavy operations in this tutorial, like parsing JSON and making requests to the database in
the main thread. To learn about how to write concurrent code and optimize your app,
see [how to work with concurrency](kmm-concurrency-overview.md)

You can also check out these materials if you want to:

* [Use the Ktor HTTP client in multiplatform projects](https://ktor.io/docs/http-client-multiplatform.html)
* [Make your Android application work on iOS](kmm-integrate-in-existing-app.md)
* [Introduce your team to Kotlin Multiplatform Mobile](kmm-introduce-your-team.md)