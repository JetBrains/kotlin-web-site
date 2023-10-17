[//]: # (title: Create a multiplatform app using Ktor and SQLDelight – tutorial)

This tutorial demonstrates how to use Android Studio to create a mobile application for iOS and Android using Kotlin
Multiplatform Mobile with Ktor and SQLDelight.

The application will include a module with shared code for both the iOS and Android platforms. The business logic and data
access layers will be implemented only once in the shared module, while the UI of both applications will be native.

The output will be an app that retrieves data over the internet from the
public [SpaceX API](https://docs.spacexdata.com/?version=latest), saves it in a local database, and displays a list of
SpaceX rocket launches together with the launch date, results, and a detailed description of the launch:

![Emulator and Simulator](android-and-ios.png){width=600}

You will use the following multiplatform libraries in the project:

* [Ktor](https://ktor.io/docs/create-client.html) as an HTTP client for retrieving data over the internet.
* [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization) to deserialize JSON responses into objects
  of entity classes.
* [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) to write asynchronous code.
* [SQLDelight](https://github.com/cashapp/sqldelight) to generate Kotlin code from SQL queries and create a type-safe
  database API.

> You can find the [template project](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage) as well as the
> source code of the [final application](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final)
> on the corresponding GitHub repository.
>
{type="note"}

## Before you start

1. Download and install [Android Studio](https://developer.android.com/studio/).
2. Search for the [Kotlin Multiplatform Mobile plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)
   in the Android Studio Marketplace and install it.

   ![Kotlin Multiplatform Mobile plugin](multiplatform-marketplace.png){width=700}

3. Download and install [Xcode](https://developer.apple.com/xcode/).

For more details, see the [Set up the environment](multiplatform-mobile-setup.md) section.

## Create a Multiplatform project

1. In Android Studio, select **File** | **New** | **New Project**. In the list of project templates, select **Kotlin
   Multiplatform App** and then click **Next**.

   ![Kotlin Multiplatform Mobile plugin wizard](multiplatform-mobile-project-wizard-1.png){width=700}

2. Name your application and click **Next**.
3. Select **Regular framework** in the list of **iOS framework distribution** options.

   ![Kotlin Multiplatform Mobile plugin wizard. Final step](multiplatform-mobile-project-wizard-3.png){width=700}

4. Keep all other options default. Click **Finish**.
5. To view the complete structure of the multiplatform mobile project, switch the view from **Android** to **Project**.

   ![Project view](select-project-view.png){width=200}

For more on project features and how to use them, see [Understand the project structure](multiplatform-mobile-understand-project-structure.md).

> You can find the configured project [on the `master` branch](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage).
>
{type="note"}

## Add dependencies to the multiplatform library

To add a multiplatform library to the shared module, you need to add dependency instructions (`implementation`) for all
libraries to the `dependencies` block of the relevant source sets in the `build.gradle.kts` file.

Both the `kotlinx.serialization` and SQLDelight libraries also require additional configurations.

1. In the `shared` directory, specify the dependencies on all the required libraries in the `build.gradle.kts` file:

    ```kotlin
    val coroutinesVersion = "%coroutinesVersion%"
    val ktorVersion = "%ktorVersion%"
    val sqlDelightVersion = "%sqlDelightVersion%"
    val dateTimeVersion = "%dateTimeVersion%"

    sourceSets {
        targetHierarchy.default()
   
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutinesVersion")
                implementation("io.ktor:ktor-client-core:$ktorVersion")
                implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
                implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
                implementation("com.squareup.sqldelight:runtime:$sqlDelightVersion")
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:$dateTimeVersion")
                }
            }
        val androidMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-android:$ktorVersion")
                implementation("com.squareup.sqldelight:android-driver:$sqlDelightVersion")
            }
        }
        val iosMain by getting {
            // ...
            dependencies {
                implementation("io.ktor:ktor-client-darwin:$ktorVersion")
                implementation("com.squareup.sqldelight:native-driver:$sqlDelightVersion")
            }
        }
    }
    ```

   * Each library requires a core artifact in the common source set.
   * Both the SQLDelight and Ktor libraries need platform drivers in the iOS and Android source sets, as well.
   * In addition, Ktor needs the [serialization feature](https://ktor.io/docs/serialization-client.html) to use
     `kotlinx.serialization` for processing network requests and responses.

2. At the very beginning of the `build.gradle.kts` file in the same `shared` directory, add the following lines to the
   `plugins` block:

   ```kotlin
       plugins {
       // ...
       kotlin("plugin.serialization") version "%kotlinVersion%"
       id("com.squareup.sqldelight")
   }
   ```

3. Now go to the `build.gradle.kts` file in the project _root directory_ and specify the classpath for the plugin in the
   build system dependencies:

    ```kotlin
    buildscript {
        
        dependencies {
            // ...
            classpath("com.squareup.sqldelight:gradle-plugin:%sqlDelightVersion%")
        }
    }
    ```

4. Finally, define the SQLDelight version in the `gradle.properties` file in the project _root directory_ to ensure that
   the SQLDelight versions of the plugin and the libraries are the same:

    ```none
    sqlDelightVersion=%sqlDelightVersion%
    ```

5. Sync the Gradle project.

Learn more about adding [dependencies on multiplatform libraries](multiplatform-add-dependencies.md).

> You can find this state of the project [on the `final` branch](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## Create an application data model

The Kotlin Multiplatform app will contain the public `SpaceXSDK` class, the facade over networking and cache services.
The application data model will have three entity classes with:

* General information about the launch
* A URL to external information
* Information about the rocket

1. In `shared/src/commonMain/kotlin`, add the `com.jetbrains.handson.kmm.shared.entity` package.
2. Create the `Entity.kt` file inside the package.
3. Declare all the data classes for basic entities:

   ```kotlin
   ```
   {src="multiplatform-mobile-tutorial/Entity.kt" initial-collapse-state="collapsed" collapsed-title="data class RocketLaunch" lines="3-41" }

Each serializable class must be marked with the `@Serializable` annotation. The `kotlinx.serialization` plugin
automatically generates a default serializer for `@Serializable` classes unless you explicitly pass a link to a
serializer through the annotation argument.

However, you don't need to do that in this case. The `@SerialName` annotation allows you to redefine field names, which helps
to declare properties in data classes with more easily readable names.

> You can find the state of the project after this section [on the `final` branch](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## Configure SQLDelight and implement cache logic

### Configure SQLDelight

The SQLDelight library allows you to generate a type-safe Kotlin database API from SQL queries. During compilation, the
generator validates the SQL queries and turns them into Kotlin code that can be used in the shared module.

The library is already in the project. To configure it, go to the `shared` directory and add the `sqldelight` block to
the end of the `build.gradle.kts` file. The block will contain a list of databases and their parameters:

```kotlin
sqldelight {
    database("AppDatabase") {
        packageName = "com.jetbrains.handson.kmm.shared.cache"
    }
}
```

The `packageName` parameter specifies the package name for the generated Kotlin sources.

> Consider installing the official [SQLite plugin](https://cashapp.github.io/sqldelight/multiplatform_sqlite/intellij_plugin/)
> for working with `.sq` files.
>
{type="tip"}

### Generate the database API

First, create the `.sq` file, which will contain all the needed SQL queries. By default, the SQLDelight plugin reads
`.sq` from the `sqldelight` folder:

1. In `shared/src/commonMain`, create a new `sqldelight` directory and add
   the `com.jetbrains.handson.kmm.shared.cache` package.
2. Inside the package, create an `.sq` file with the name of the database, `AppDatabase.sq`. All the SQL queries for
   the application will be in this file.
3. The database will contain a table with data about launches. To create the table, add the following
   code to the `AppDatabase.sq` file:

   ```text
   CREATE TABLE Launch (
       flightNumber INTEGER NOT NULL,
       missionName TEXT NOT NULL,
       details TEXT,
       launchSuccess INTEGER AS Boolean DEFAULT NULL,
       launchDateUTC TEXT NOT NULL,
       patchUrlSmall TEXT,
       patchUrlLarge TEXT,
       articleUrl TEXT
   );
   ```

4. To insert data into the tables, declare an SQL insert function:

   ```text
   insertLaunch:
   INSERT INTO Launch(flightNumber, missionName, details, launchSuccess, launchDateUTC, patchUrlSmall, patchUrlLarge, articleUrl)
   VALUES(?, ?, ?, ?, ?, ?, ?, ?);
   ```

5. To clear data in the tables, declare an SQL delete function:

   ```text
   removeAllLaunches:
   DELETE FROM Launch;
   ```

6. In the same way, declare a function to retrieve data:

   ```text
   selectAllLaunchesInfo:
   SELECT Launch.*
   FROM Launch;
   ```

After the project is compiled, the generated Kotlin code will be stored in the `shared/build/generated/sqldelight`
directory. The generator will create an interface named `AppDatabase`, as specified in `build.gradle.kts`.

### Create platform database drivers

To initialize `AppDatabase`, pass an `SqlDriver` instance to it. SQLDelight provides multiple platform-specific
implementations of the SQLite driver, so you need to create them for each platform separately. You can do this by using
[expected and actual declarations](multiplatform-connect-to-apis.md).

1. Create an abstract factory for database drivers. To do this, in `shared/src/commonMain/kotlin`, create
   the `com.jetbrains.handson.kmm.shared.cache` package and the `DatabaseDriverFactory` class inside it:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.cache
   
   import com.squareup.sqldelight.db.SqlDriver

   expect class DatabaseDriverFactory {
       fun createDriver(): SqlDriver
   }
   ```

   Now provide `actual` implementations for this expected class.

2. On Android, the `AndroidSqliteDriver` class implements the SQLite driver. Pass the database information and the link
   to the context to the `AndroidSqliteDriver` class constructor.

   For this, in the `shared/src/androidMain/kotlin` directory, create the `com.jetbrains.handson.kmm.shared.cache`
   package and a `DatabaseDriverFactory` class inside it with the actual implementation:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.cache
   
   import android.content.Context
   import com.squareup.sqldelight.android.AndroidSqliteDriver
   import com.squareup.sqldelight.db.SqlDriver
   
   actual class DatabaseDriverFactory(private val context: Context) {
       actual fun createDriver(): SqlDriver {
           return AndroidSqliteDriver(AppDatabase.Schema, context, "test.db")
       }
   }
   ```

3. On iOS, the SQLite driver implementation is the `NativeSqliteDriver` class. In the `shared/src/iosMain/kotlin`
   directory, create a `com.jetbrains.handson.kmm.shared.cache` package and a `DatabaseDriverFactory` class inside it with
   the actual implementation:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.cache
   
   import com.squareup.sqldelight.db.SqlDriver
   import com.squareup.sqldelight.drivers.native.NativeSqliteDriver

   actual class DatabaseDriverFactory {
       actual fun createDriver(): SqlDriver {
           return NativeSqliteDriver(AppDatabase.Schema, "test.db")
       }
   }
   ```

Instances of these factories will be created later in the code of your Android and iOS projects.

You can navigate through the `expect` declarations and `actual` implementations by clicking the handy gutter icon:

![Expect/Actual gutter](expect-actual-gutter.png){width=500}

### Implement cache

So far, you have added platform database drivers and an `AppDatabase` class to perform database operations. Now create
a `Database` class, which will wrap the `AppDatabase` class and contain the caching logic.

1. In the common source set `shared/src/commonMain/kotlin`, create a new `Database` class in
   the `com.jetbrains.handson.kmm.shared.cache` package. It will be common to both platform logics.

2. To provide a driver for `AppDatabase`, pass an abstract `DatabaseDriverFactory` to the `Database` class constructor:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.cache
   
   import com.jetbrains.handson.kmm.shared.entity.Links
   import com.jetbrains.handson.kmm.shared.entity.Patch
   import com.jetbrains.handson.kmm.shared.entity.RocketLaunch

   internal class Database(databaseDriverFactory: DatabaseDriverFactory) {
       private val database = AppDatabase(databaseDriverFactory.createDriver())
       private val dbQuery = database.appDatabaseQueries
   }
   ```

   This class's [visibility](visibility-modifiers.md#class-members) is set to internal, which means it is only
   accessible from within the multiplatform module.

3. Inside the `Database` class, implement some data handling operations. Add a function to clear all the tables in the
   database in a single SQL transaction:

   ```kotlin
   internal fun clearDatabase() {
       dbQuery.transaction {
           dbQuery.removeAllLaunches()
       }
    }
   ```

4. Create a function to get a list of all the rocket launches:

   ```kotlin
   import com.jetbrains.handson.kmm.shared.entity.Links
   import com.jetbrains.handson.kmm.shared.entity.Patch
   import com.jetbrains.handson.kmm.shared.entity.RocketLaunch

   internal fun getAllLaunches(): List<RocketLaunch> {
       return dbQuery.selectAllLaunchesInfo(::mapLaunchSelecting).executeAsList()
   }
   
   private fun mapLaunchSelecting(
       flightNumber: Long,
       missionName: String,
       details: String?,
       launchSuccess: Boolean?,
       launchDateUTC: String,
       patchUrlSmall: String?,
       patchUrlLarge: String?,
       articleUrl: String?
   ): RocketLaunch {
       return RocketLaunch(
           flightNumber = flightNumber.toInt(),
           missionName = missionName,
           details = details,
           launchDateUTC = launchDateUTC,
           launchSuccess = launchSuccess,
           links = Links(
               patch = Patch(
                   small = patchUrlSmall,
                   large = patchUrlLarge
               ),
               article = articleUrl
           )
       )
   }
   ```

   The argument passed to `selectAllLaunchesInfo` is a function that maps the database entity class to another type,
   which in this case is the `RocketLaunch` data model class.

5. Add a function to insert data into the database:

    ```kotlin
    internal fun createLaunches(launches: List<RocketLaunch>) {
        dbQuery.transaction {
            launches.forEach { launch ->
                insertLaunch(launch)
            }
        }
    }
    
    private fun insertLaunch(launch: RocketLaunch) {
        dbQuery.insertLaunch(
            flightNumber = launch.flightNumber.toLong(),
            missionName = launch.missionName,
            details = launch.details,
            launchSuccess = launch.launchSuccess ?: false,
            launchDateUTC = launch.launchDateUTC,
            patchUrlSmall = launch.links.patch?.small,
            patchUrlLarge = launch.links.patch?.large,
            articleUrl = launch.links.article
        )
    }
    ```

The `Database` class instance will be created later, along with the SDK facade class.

> You can find the state of the project after this section [on the `final` branch](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## Implement an API service

To retrieve data over the internet, you'll need the [SpaceX public API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)
and a single method to retrieve the list of all launches from the `v5/launches` endpoint.

Create a class that will connect the application to the API:

1. In the common source set `shared/src/commonMain/kotlin`, create the `com.jetbrains.handson.kmm.shared.network`
   package and the `SpaceXApi` class inside it:

   ```kotlin
   package com.jetbrains.handson.kmm.shared.network

   import com.jetbrains.handson.kmm.shared.entity.RocketLaunch
   import io.ktor.client.*
   import io.ktor.client.call.*
   import io.ktor.client.plugins.contentnegotiation.*
   import io.ktor.client.request.*
   import io.ktor.serialization.kotlinx.json.*
   import kotlinx.serialization.json.Json

   class SpaceXApi {
       private val httpClient = HttpClient {
           install(ContentNegotiation) {
               json(Json {
                   ignoreUnknownKeys = true
                   useAlternativeNames = false
               })
           }
       }
   }
   ```

    * This class executes network requests and deserializes JSON responses into entities from the `entity` package.
      The Ktor `HttpClient` instance initializes and stores the `httpClient` property.
    * This code uses the [Ktor `ContentNegotiation` plugin](https://ktor.io/docs/serialization-client.html)
      to deserialize the `GET` request result. The plugin processes the request and the response payload as JSON,
      serializing and deserializing them using a special serializer.

2. Declare the data retrieval function that will return the list of `RocketLaunch`es:

   ```kotlin
   suspend fun getAllLaunches(): List<RocketLaunch> {
       return httpClient.get("https://api.spacexdata.com/v5/launches").body()
   }
   ```

   * The `getAllLaunches` function has the `suspend` modifier because it contains a call of the suspend function `get()`,
     which includes an asynchronous operation to retrieve data over the internet and can only be called from a
     coroutine or another suspend function. The network request will be executed in the HTTP client's thread pool.
   * The URL is defined inside the `get()` function to send requests.

### Add internet access permission

To access the internet, the Android application needs the appropriate permission. Since all network requests are made
from the shared module, adding the internet access permission to this module's manifest makes sense.

In the `androidApp/src/main/AndroidManifest.xml` file, add the following permission to the manifest:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    
</manifest>
```

> You can find the state of the project after this section [on the `final` branch](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
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

   class SpaceXSDK (databaseDriverFactory: DatabaseDriverFactory) {
       private val database = Database(databaseDriverFactory)
       private val api = SpaceXApi()
   }
   ```

   This class will be the facade over the `Database` and `SpaceXApi` classes.

2. To create a `Database` class instance, you'll need to provide the `DatabaseDriverFactory` platform instance to it, so
   you'll inject it from the platform code through the `SpaceXSDK` class constructor.

   ```kotlin
   import com.jetbrains.handson.kmm.shared.entity.RocketLaunch
   
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
     returns cached values or loads the data from the internet and then updates the cache with the results. If there is
     no cached data, it loads the data from the internet independently of the `forceReload` flag’s value.
   * Clients of your SDK could use a `forceReload` flag to load the latest information about the launches, which would
     allow the user to use the pull-to-refresh gesture.
   * To handle exceptions produced by the Ktor client in Swift, the function is marked with the `@Throws` annotation.

   All Kotlin exceptions are unchecked, while Swift has only checked errors. Thus, to make your Swift code aware of expected
   exceptions, Kotlin functions should be marked with the `@Throws` annotation specifying a list of potential exception
   classes.

> You can find the state of the project after this section [on the `final` branch](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## Create the Android application

The Kotlin Multiplatform Mobile plugin for Android Studio has already handled the configuration for you, so the Kotlin
Multiplatform shared module is already connected to your Android application.

Before implementing the UI and the presentation logic, add all the required dependencies to
the `androidApp/build.gradle.kts`:

```kotlin
// ...
dependencies {
    implementation(project(":shared"))
    implementation("com.google.android.material:material:1.9.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.1")
    implementation("androidx.core:core-ktx:1.10.1")
    implementation("androidx.recyclerview:recyclerview:1.3.0")
   implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
   implementation("androidx.cardview:cardview:1.0.0")
}
// ...
```

### Implement the UI: display the list of rocket launches

1. To implement the UI, create the `layout/activity_main.xml` file in `androidApp/src/main/res`.

   The screen is based on the `ConstraintLayout` with the `SwipeRefreshLayout` inside it, which contains `RecyclerView`
   and `FrameLayout` with a background with a `ProgressBar` across its center:

   ```xml
   ```
   {src="multiplatform-mobile-tutorial/activity_main.xml" initial-collapse-state="collapsed" collapsed-title="androidx.constraintlayout.widget.ConstraintLayout xmlns:android" lines="1-26"}

2. In `androidApp/src/main/java`, replace the implementation of the `MainActivity` class, adding the properties for the
   UI elements:

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
   will convert raw data into list item views. To do this, create a separate `LaunchesRvAdapter` class:

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
   {src="multiplatform-mobile-tutorial/item_launch.xml" initial-collapse-state="collapsed" collapsed-title="androidx.cardview.widget.CardView xmlns:android" lines="1-28"}

5. In `androidApp/src/main/res/values/`, either create your appearance of the app or copy the following styles:

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
       // ...
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

7. Update the `MainActivity` class as follows:

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

   Here you create an instance of `LaunchesRvAdapter`, configure the `RecyclerView` component, and implement all the
   `LaunchesListView` interface functions. To catch the screen refresh gesture, you add a listener to the `SwipeRefreshLayout`.

### Implement the presentation logic

1. Create an instance of the `SpaceXSDK` class from the shared module and inject an instance of `DatabaseDriverFactory` in
   it:

   ```kotlin
   class MainActivity : AppCompatActivity() {
       // ...
       private val sdk = SpaceXSDK(DatabaseDriverFactory(this))
   }
   ```

2. Implement the private function `displayLaunches(needReload: Boolean)`. It runs the `getLaunches()` function inside
   the coroutine launched in the main `CoroutineScope`, handles exceptions, and displays the error text in the toast message:

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

3. Select **androidApp** from the run configurations menu, choose an emulator, and click the run button:

![Android application](android-application.png){width=350}

You've just created an Android application that has its business logic implemented in the Kotlin Multiplatform Mobile
module.

> You can find the state of the project after this section [on the `final` branch](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

# Create the iOS application

For the iOS part of the project, you'll make use of [SwiftUI](https://developer.apple.com/xcode/swiftui/) to build the user
interface and the "Model View View-Model" pattern to connect the UI to the shared module, which contains all the business logic.

The shared module is already connected to the iOS project because the Android Studio plugin wizard has done all the configuration.
You can import it the same way you would regular iOS dependencies: `import shared`.

### Implement the UI

First, you'll create a `RocketLaunchRow` SwiftUI view for displaying an item from the list. It will be based on the `HStack`
and `VStack` views. There will be extensions on the `RocketLaunchRow` structure with useful helpers for displaying the
data.

1. Launch your Xcode app and select **Open a project or file**.
2. Navigate to your project and select the `iosApp` folder. Click **Open**.
3. In your Xcode project, create a new Swift file with the type **SwiftUI View**, name it `RocketLaunchRow`, and update
   it with the following code:

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

   The list of launches will be displayed in the `ContentView`, which the project wizard has already created.

4. Create a `ViewModel` class for the `ContentView`, which will prepare and manage the data. Declare it as an extension
   to the `ContentView`, as they are closely connected, and then add the following code to `ContentView.swift`:

   ```swift
   // ...
   extension ContentView {
       enum LoadableLaunches {
           case loading
           case result([RocketLaunch])
           case error(String)
       }
       
      @MainActor
      class ViewModel: ObservableObject {
          @Published var launches = LoadableLaunches.loading
      }
   }
   ```

    * The [Combine framework](https://developer.apple.com/documentation/combine) connects the view model (`ContentView.ViewModel`)
      with the view (`ContentView`).
    * `ContentView.ViewModel` is declared as an `ObservableObject` and `@Published` wrapper is used for the `launches`
      property, so the view model will emit signals whenever this property changes.

5. Implement the body of the `ContentView` file and display the list of launches:

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

6. To make it compile, the `RocketLaunch` class needs to confirm the `Identifiable` protocol, as it is used as a
   parameter for initializing the `List` Swift UIView. The `RocketLaunch` class already has a property named `id`, so
   add the following to the bottom of `ContentView.swift`:

   ```Swift
   extension RocketLaunch: Identifiable { }
   ```

### Load the data

To retrieve the data about the rocket launches in the view model, you'll need an instance of `SpaceXSDK` from the Multiplatform
library.

1. In `ContentView.swift`, pass it in through the constructor:

   ```swift
   extension ContentView {
       // ...
       @MainActor
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

2. Call the `getLaunches()` function from the `SpaceXSDK` class and save the result in the `launches` property:
   
   ```Swift
   func loadLaunches(forceReload: Bool) {
       Task {
           do {
               self.launches = .loading
               let launches = try await sdk.getLaunches(forceReload: forceReload)
               self.launches = .result(launches)
           } catch {
               self.launches = .error(error.localizedDescription)
           }
       }
   }
   ```

   * When you compile a Kotlin module into an Apple framework, [suspending functions](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
     are available in it as Swift's `async`/`await` mechanism.
   * Since the `getLaunches` function is marked with the `@Throws(Exception::class)` annotation, any exceptions that are
     instances of the `Exception` class or its subclass will be propagated as `NSError`. Therefore, all such errors can
     be caught by the `loadLaunches()` function.

3. Go to the entry point of the app, `iOSApp.swift`, and initialize the SDK, view, and view model:

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

4. In Android Studio, switch to the **iosApp** configuration, choose an emulator, and run it to see the result:

![iOS Application](ios-application.png){width=350}

> You can find the final version of the project [on the `final` branch](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final).
>
{type="note"}

## What's next?

You can also check out these additional learning materials:

* [Use the Ktor HTTP client in multiplatform projects](https://ktor.io/docs/http-client-engines.html#mpp-config)
* [Make your Android application work on iOS](multiplatform-mobile-integrate-in-existing-app.md)
* [Introduce your team to Kotlin Multiplatform Mobile](multiplatform-mobile-introduce-your-team.md)