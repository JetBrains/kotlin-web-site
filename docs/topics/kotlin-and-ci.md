[//]: # (title: Kotlin and continuous integration with TeamCity)

On this page, you'll learn how to configure [TeamCity](https://www.jetbrains.com/teamcity/) to build Kotlin applications.
For TeamCity installation and basic setup, refer to the [TeamCity documentation](https://www.jetbrains.com/teamcity/documentation/).

Kotlin integrates directly with standard build tools like Gradle and Maven, so configuring a Kotlin build in TeamCity 
requires the same workflow as any project. If you compile your project using the IntelliJ IDEA build system instead, 
TeamCity provides a dedicated runner.

## Gradle and Maven

When you build with Gradle or Maven, the build configuration file (`build.gradle.kts` or `pom.xml`) already 
declares the Kotlin dependencies and compiler plugins. TeamCity does not require any additional Kotlin-specific settings.

For Gradle, add a Gradle build step to your build configuration and specify the **Step name** and **Gradle tasks** you want to run.
<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700" border-effect="line"/>

Similarly, for Maven, add a Maven build step and specify the **Step name** and **Goals** you want to execute.

## IntelliJ IDEA build system

If you build your project using IntelliJ IDEA project files, the Kotlin version in TeamCity must match the version configured in your IDE project. 
You can automate downloading and configuring the Kotlin compiler by using a TeamCity recipe. Recipes are the evolution of meta-runners: 
they serve the same purpose but offer additional benefits like YAML support and easy sharing on [JetBrains Marketplace](https://plugins.jetbrains.com/teamcity_recipe).

1. Download and import the recipe.
   * Download the Kotlin meta-runner file from [GitHub](https://github.com/JetBrains/Kotlin.TeamCity).
   * Import it into TeamCity as a new recipe. For details, see [Working with recipes](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html).
  <img src="teamcity-add-recipe.png" alt="TeamCity recipe" width="700" border-effect="line"/>

2. Add the Kotlin compiler fetching step.
   * Add a build step using the imported runner.
   * Specify the **Step name** and the required **Kotlin Version**.
  <img src="teamcity-step-name.png" alt="Setup Kotlin Compiler" width="700" border-effect="line"/>

  >Before running the build, add `system.path.macro.KOTLIN.BUNDLED` as a system parameter in your build configuration. 
  >You can assign any placeholder value, and the runner will overwrite it with the resolved compiler path at build time.
  >
  > {style="note"}

3. Add the compilation step.
   Add an IntelliJ IDEA Project runner step after the compiler-fetching step to compile the project and produce the build artifacts.
  <img src="teamcity-intellij-step.png" alt="IntelliJ IDEA Project runner" width="500" border-effect="line"/>

## Other CI servers

If you use a CI system other than TeamCity, invoke the standard Gradle or Maven commands directly in your pipeline scripts.

## What's next

* Learn how to [configure TeamCity for a Kotlin Multiplatform application](https://kotlinlang.org/docs/multiplatform/configure-teamcity-for-kmp.html)  
   to build, test, and deploy Kotlin Multiplatform applications.
* Follow the tutorial to [configure an iOS delivery pipeline for your Kotlin Multiplatform project](https://kotlinlang.org/docs/multiplatform/ios-ci-cd-teamcity.html) 
   on hosted macOS agents and automate deployments to TestFlight.
* Learn how to [store project settings in version control](https://www.jetbrains.com/help/teamcity/storing-project-settings-in-version-control.html) 
   and manage your pipelines as code using the Kotlin DSL.