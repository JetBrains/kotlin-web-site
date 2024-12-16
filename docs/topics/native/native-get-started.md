[//]: # (title: Get started with Kotlin/Native)

In this tutorial, you'll learn how to create a Kotlin/Native application. Choose the tool that works best for you and
create your app using:

* **[The IDE](#in-ide)**. Here, you can clone the project template from a version control system and use it in IntelliJ IDEA.
* **[The Gradle build system](#using-gradle)**. To better understand how things work under the hood,
  create build files for your project manually.
* **[The command line tool](#using-the-command-line-compiler)**. You can use the Kotlin/Native compiler,
  which is shipped as a part of the standard Kotlin distribution, and create the app directly in the command line tool.

  Console compilation may seem easy and straightforward, but it doesn't scale well for larger projects with hundreds of
  files and libraries. For such projects, we recommend using an IDE or a build system.

With Kotlin/Native, you can compile for [different targets](native-target-support.md), including Linux, macOS, and Windows.
While cross-platform compilation is possible, which means using one platform to compile for a different one,
in this tutorial, you'll be targeting the same platform you're compiling on.

> If you use a Mac and want to create and run applications for macOS or other Apple targets, you also need to
> install [Xcode Command Line Tools](https://developer.apple.com/download/), launch it, and accept the license terms first.
>
{style="note"}

## In IDE

In this section, you'll learn how to use IntelliJ IDEA to create a Kotlin/Native application. You can use both
the Community Edition and the Ultimate Edition.

### Create the project

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. Clone the [project template](https://github.com/Kotlin/kmp-native-wizard)
   by selecting **File** | **New** | **Project from Version Control** in IntelliJ IDEA and using this URL:

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```   

3. Open the `gradle/libs.versions.toml` file, which is the version catalog for project dependencies. To create Kotlin/Native
   applications, you need the Kotlin Multiplatform Gradle plugin, which has the same version as Kotlin. Ensure that you
   use the latest Kotlin version:

   ```none
   [versions]
   kotlin = "%kotlinVersion%"
   ```

4. Follow the suggestion to reload Gradle files:

   ![Load Gradle changes button](load-gradle-changes.png){width=295}

For more information about these settings, see the [Multiplatform Gradle DSL reference](multiplatform-dsl-reference.md).

### Build and run the application

Open the `Main.kt` file in the `src/nativeMain/kotlin/` directory:

* The `src` directory contains Kotlin source files.
* The `Main.kt` file includes code that prints "Hello, Kotlin/Native!" using the [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) function.

Press the green icon in the gutter to run the code:

![Run the application](native-run-gutter.png){width=478}

IntelliJ IDEA runs the code using the Gradle task and outputs the result in the **Run** tab:

![Application output](native-output-gutter-1.png){width=331}

After the first run, the IDE creates the corresponding run configuration at the top:

![Gradle run configuration](native-run-config.png){width=503}

> IntelliJ IDEA Ultimate users can install
> the [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)
> plugin that allows debugging compiled native executables and also automatically creates run configurations for
> imported Kotlin/Native projects.

You can [configure IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build) to build
your project automatically:

1. Go to **Settings | Build, Execution, Deployment | Compiler**.
2. On the **Compiler** page, select **Build project automatically**.
3. Apply the changes.

Now, when you make changes in the class files or save the file (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>),
IntelliJ IDEA automatically performs an incremental build of the project.

### Update the application

Let's add a feature to your application so it can count the number of letters in your name:

1. In the `Main.kt` file, add code to read the input. Use the [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)
   function to read the input value and assign it to the `name` variable:

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

2. To run this app using Gradle, specify `System.in` as the input to use in the `build.gradle.kts` file
   and load the Gradle changes:

   ```kotlin
   kotlin {
       //...
       nativeTarget.apply {
           binaries {
               executable {
                   entryPoint = "main"
                   runTask?.standardInput = System.`in`
               }
           }
       }
       //...
   }
   ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="runTask?.standardInput = System.`in`"}

3. Eliminate the whitespaces and count the letters:

   * Use the [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) function to remove the
     empty spaces in the name.
   * Use the scope function [`let`](scope-functions.md#let) to run the function within the object context.
   * Use a [string template](strings.md#string-templates) to insert your name length into the string by adding a dollar
     sign `$` and enclosing it in curly braces – `${it.length}`. `it` is the default name of a [lambda parameter](coding-conventions.md#lambda-parameters).

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. Run the application.
5. Enter your name and enjoy the result:

   ![Application output](native-output-gutter-2.png){width=422}

Now let's count only the unique letters in your name:

1. In the `Main.kt` file, declare the new [extension function](extensions.md#extension-functions)
   `.countDistinctCharacters()` for `String`:

   * Convert the name to lowercase using the [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) function.
   * Convert the input string to a list of characters using the [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) function.
   * Select only the distinct characters in your name using the [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) function.
   * Count the distinct characters using the [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) function.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. Use the `.countDistinctCharacters()` function to count the unique letters in your name:

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // Print the number of unique letters.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. Run the application.
4. Enter your name and see the result:

   ![Application output](native-output-gutter-3.png){width=422}

## Using Gradle

In this section, you'll learn how to manually create a Kotlin/Native application using [Gradle](https://gradle.org).
It's the default build system for Kotlin/Native and Kotlin Multiplatform projects, which is also commonly used in Java,
Android, and other ecosystems.

### Create project files

1. To get started, install a compatible version of [Gradle](https://gradle.org/install/). See the [compatibility table](gradle-configure-project.md#apply-the-plugin)
   to check the Kotlin Gradle plugin (KGP) compatibility with available Gradle versions.
2. Create an empty project directory. Inside it, create a `build.gradle(.kts)` file with the following content:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64("native") {  // on macOS
       // linuxArm64("native") // on Linux
       // mingwX64("native")   // on Windows
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "%gradleVersion%"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64('native') {  // on macOS
       // linuxArm64('native') // on Linux
       // mingwX64('native')   // on Windows
           binaries {
               executable()
           }
       }
   }

   wrapper {
       gradleVersion = '%gradleVersion%'
       distributionType = 'BIN'
   }
   ```

   </tab>
   </tabs>

   You can use different [target names](native-target-support.md), such as `macosArm64`, `iosArm64` `linuxArm64`,
   and `mingwX64` to define the targets for which you are compiling your code.
   These target names can optionally take the platform name as a parameter, which in this case is `native`.
   The platform name is used to generate the source paths and task names in the project.

3. Create an empty `settings.gradle(.kts)` file in the project directory.
4. Create a `src/nativeMain/kotlin` directory and place a `hello.kt` file inside with the following content:

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

By convention, all sources are located in the `src/<target name>[Main|Test]/kotlin` directories, where `Main` is for the
source code and `Test` is for tests. `<target name>` corresponds to the target platform (in this case, `native`),
as specified in the build file.

### Build and run the project

1. From the root project directory, run the build command:

   ```bash
   ./gradlew nativeBinaries
   ```

   This command creates the `build/bin/native` directory with two directories inside: `debugExecutable` and
   `releaseExecutable`. They contain the corresponding binary files.

   By default, the name of the binary file is the same as the project directory.

2. To run the project, execute the following command:

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

The terminal prints "Hello, Kotlin/Native!".

### Open the project in IDE

Now, you can open your project in any IDE that supports Gradle. If you use IntelliJ IDEA:

1. Select **File** | **Open**.
2. Select the project directory and click **Open**.
   IntelliJ IDEA automatically detects if it's a Kotlin/Native project.

If you encounter a problem with the project, IntelliJ IDEA displays the error message in the **Build** tab.

## Using the command-line compiler

In this section, you'll learn how to create a Kotlin/Native application using the Kotlin compiler in the command line tool.

### Download and install the compiler

To install the compiler:

1. Go to the Kotlin's [GitHub releases](%kotlinLatestUrl%) page.
2. Look for a file with `kotlin-native` in the name and download one that is suitable for your operating system,
   for example `kotlin-native-prebuilt-linux-x86_64-2.0.21.tar.gz`.
3. Unpack the archive to a directory of your choice.
4. Open your shell profile and add the path to the compiler's `/bin` directory to the `PATH` environment variable: 

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

> Although the compiler output has no dependencies or virtual machine requirements, the compiler itself
> requires Java 1.8 or higher runtime. It's supported
> by [JDK 8 (JAVA SE 8) or later versions](https://www.oracle.com/java/technologies/downloads/).
>
{style="note"}

### Create the program

Choose a working directory and create a file named `hello.kt`. Update it with the following code:

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### Compile the code from the console

To compile the application, execute the following command with the downloaded compiler:

```bash
kotlinc-native hello.kt -o hello
```

The value of the `-o` option specifies the name of the output file, so this call generates the `hello.kexe` binary file
on macOS and Linux (and `hello.exe` on Windows).

For the full list of available options, see [Kotlin compiler options](compiler-reference.md).

### Run the program

To run the program, in your command line tool, navigate to the directory containing the binary file and run the
following command:

<tabs>
<tab title="macOS and Linux">

```none
./hello.kexe
```

</tab>
<tab title="Windows">

```none
./hello.exe
```

</tab>
</tabs>

The application prints "Hello, Kotlin/Native" to the standard output.

## What's next?

* Complete the [Create an app using C Interop and libcurl](native-app-with-c-and-libcurl.md) tutorial that explains how
  to create a native HTTP client and interoperate with C libraries.
* Learn how to [write Gradle build scripts for real-life Kotlin/Native projects](multiplatform-dsl-reference.md).
* Read more about the Gradle build system in the [documentation](gradle.md).