[//]: # (title: Add dependencies to your project)

<microformat>
    <p>This is a part of the <strong>Getting started with Kotlin Multiplatform Mobile</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up environment</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-mobile-create-first-app.md">Create your first cross-platform app</a><br/><img src="icon-3.svg" width="20" alt="Third step"/> <strong>Add dependencies</strong><br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Upgrade your app<br/><img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Wrap up your project</p>
</microformat>

You’ve already created your first cross-platform application, but one thing is still missing. It’s hard to imagine
modern
mobile development without a third-party library. Learn how to work with dependencies in Kotlin Multiplatform Mobile
projects.

## Dependency types

There are two types of dependencies that you can use in Multiplatform Mobile projects:

* _Multiplatform dependencies_. These are multiplatform libraries that support multiple targets and can be used in a
  common
  source set. A lot of modern Android libraries already have multiplatform support, for
  example, [Koin](https://insert-koin.io/), [Appolo](https://www.apollographql.com/), [Okio](https://square.github.io/okio/).
* _Native dependencies_. These are regular libraries, you usually work with in native iOS (using CocoaPods or other
  dependency managers) or Android projects using Gradle.

  When you work with a common module, you can also depend on them and use them in native source sets. Typically, this is
  needed when you want to work with platform API, for example, security storage, and there is a common logic around it.
    * For Android.
    * For iOS. You reuse libraries and frameworks from the iOS ecosystem in your iOS source sets. Kotlin supports
      interoperability with Objective-C dependencies and Swift dependencies if their APIs are exported to Objective-C
      with the `@objc` attribute.

For both types of dependencies, you can use local and external repositories.

## Add dependencies using external repositories

Adding a multiplatform dependency is pretty straightforward and mostly looks like adding Gradle dependency in a regular
Android Project. The only difference is the need to specify the source set.

Now go back to the app and make the greeting a little more festive. In addition to the device information, add a
function to display the number of days left until New Year. The `kotlinx-datetime` library, which has full multiplatform
support, is the most convenient way to work with dates in your shared code.

1. In the common module, open `build.gradle.kts`.
2. Add a dependency to the `commonMain` source set dependencies:

   ```kotlin
   kotlin {
       sourceSets {
           commonMain {
               dependencies {
                   implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.3.2")
               }
           } 
       }
   }
   ```

3. In the greetings class, create a short function that calculates the number of days from today until the new year
   using the `date-time` date arithmetic. The result of this function will update the greeting string:

   ```kotlin
   fun daysUntilNewYear(): Int {
       val today = Clock.System.todayAt(TimeZone.currentSystemDefault())
       val closestNewYear = LocalDate(today.year + 1, 1, 1)
       return today.daysUntil(closestNewYear)
   }

    class Greeting {
        fun greeting(): String {
            return "Guess what it is! > ${Platform().platform.reversed()}!" +
            " There are only ${daysUntilNewYear()} left! 🎅🏼 "
        }
    }
   ```

## Next step

Go on and [add more dependencies and more complex logic to your project](multiplatform-mobile-update-app.md).

### See also

* See how to work with multiplatform dependencies of all
  kinds: [Kotlin libraries, Kotlin Multiplatform libraries, and other multiplatform projects](multiplatform-add-dependencies.md)
* Learn how to [add Android dependencies](multiplatform-mobile-android-dependencies.md)
  and [iOS dependencies with or without CocoaPods](multiplatform-mobile-ios-dependencies.md) to use them in
  platform-specific source sets
* Check out the examples of [how to use Android and iOS libraries](multiplatform-mobile-samples.md)in sample projects
  (check the Platform APIs column)