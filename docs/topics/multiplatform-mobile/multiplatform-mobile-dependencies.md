[//]: # (title: Add dependencies to your project)

<microformat>
    <p>This is the fourth part of the <strong>Getting started with Kotlin Multiplatform for mobile</strong> tutorial. Before proceeding, make sure you've completed previous steps.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up an environment</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-mobile-create-first-app.md">Create your first cross-platform app</a><br/>
        <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-mobile-update-ui.md">Update the user interface</a><br/>
        <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>Add dependencies</strong><br/>
        <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Share more logic<br/>
        <img src="icon-6-todo.svg" width="20" alt="Sixth step"/> Wrap up your project</p>
</microformat>

You've already created your first cross-platform Kotlin Multiplatform project! Now let's learn how to add dependencies
to third-party libraries, which is necessary for building successful cross-platform applications.

## Dependency types

There are two types of dependencies that you can use in Multiplatform Mobile projects:

* _Multiplatform dependencies_. These are multiplatform libraries that support multiple targets and can be used in the
  common source set, `commonMain`.

  Many modern Android libraries already have multiplatform support, like [Koin](https://insert-koin.io/),
  [Apollo](https://www.apollographql.com/), and [Okio](https://square.github.io/okio/).
* _Native dependencies_. These are regular libraries from relevant ecosystems. You usually work with them in native iOS
   projects using CocoaPods or another dependency manager and in Android projects using Gradle.

When you work with a shared module, you can also depend on native dependencies and use them in the native source sets,
`androidMain` and `iosMain`. Typically, you'll need these dependencies when you want to work with platform APIs,
for example, security storage, and there is common logic.

For both types of dependencies, you can use local and external repositories.

## Add a multiplatform dependency

> If you have experience developing Android apps, adding a multiplatform dependency is similar to adding a
> Gradle dependency in a regular Android project. The only difference is that you need to specify the source set.
>
{type="tip"}

Let's now go back to the app and make the greeting a little more festive. In addition to the device information, add a
function to display the number of days left until New Year's Day. The `kotlinx-datetime` library, which has full
multiplatform support, is the most convenient way to work with dates in your shared code.

1. Navigate to the `build.gradle.kts` file in the `shared` directory.
2. Add the following dependency to the `commonMain` source set dependencies:

   ```kotlin
   kotlin {
       sourceSets {
           val commonMain by getting {
               dependencies {
                   implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.4.0")
               }
           } 
       }
   }
   ```

3. Synchronize the Gradle files by clicking **Sync Now** in the notification.

   ![Synchronize the Gradle files](gradle-sync.png)

4. In `shared/src/commonMain/kotlin`, create a new file `NewYear.kt` in the project folder.
5. Update the file with a short function that calculates
   the number of days from today until the New Year using the `date-time` date arithmetic:
   
   ```kotlin
   import kotlinx.datetime.*
   
   fun daysUntilNewYear(): Int {
       val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
       val closestNewYear = LocalDate(today.year + 1, 1, 1)
       return today.daysUntil(closestNewYear)
   }
   ```

6. In `Greeting.kt`, update the `greet()` function to see the result:
    
    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()
   
        val daysPhrase = "There are only ${daysUntilNewYear()} days left until New Year! 🎆"
   
        fun greet(): List<String> = buildList {
            add(if (Random.nextBoolean()) "Hi!" else "Hello!")
            add("Guess what it is! > ${platform.name.reversed()}!")
            add(daysPhrase)
        }
    }
    ```

7. To see the results, re-run your **androidApp** and **iosApp** configurations from Android Studio:

![Updated mobile multiplatform app with external dependencies](first-multiplatform-project-3.png){width=500}

## Next step

In the next part of the tutorial, you'll add more dependencies and more complex logic to your project.

**[Proceed to the next part](multiplatform-mobile-upgrade-app.md)**

### See also

* Discover how to work with multiplatform dependencies of all
  kinds: [Kotlin libraries, Kotlin Multiplatform libraries, and other multiplatform projects](multiplatform-add-dependencies.md).
* Learn how to [add Android dependencies](multiplatform-mobile-android-dependencies.md)
  and [iOS dependencies with or without CocoaPods](multiplatform-mobile-ios-dependencies.md) for use in
  platform-specific source sets.
* Check out the examples of [how to use Android and iOS libraries](multiplatform-mobile-samples.md) in sample projects
  (be sure to check the Platform APIs column).

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).