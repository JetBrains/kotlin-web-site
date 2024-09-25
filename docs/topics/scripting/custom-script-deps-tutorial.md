[//]: # (title: Get started with Kotlin custom scripting – tutorial)

> Kotlin scripting is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Use it only for evaluation purposes. We appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{style="warning"}

_Kotlin scripting_ is the technology that enables executing Kotlin code as scripts without prior compilation or
packaging into executables.

For an overview of Kotlin scripting with examples, check out the talk [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)
by Rodrigo Oliveira from KotlinConf'19.

In this tutorial, you'll create a Kotlin scripting project that executes arbitrary Kotlin code with Maven dependencies.
You'll be able to execute scripts like this:


```kotlin
@file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")

import kotlinx.html.*
import kotlinx.html.stream.*
import kotlinx.html.attributes.*

val addressee = "World"

print(
    createHTML().html {
        body {
            h1 { +"Hello, $addressee!" }
        }
    }
)
```

The specified Maven dependency (`kotlinx-html-jvm` for this example) will be resolved from the specified Maven
repository or local cache during execution and used for the rest of the script.

## Project structure

A minimal Kotlin custom scripting project contains two parts:

* _Script definition_ – a set of parameters and configurations that define how this script type should be recognized,
  handled, compiled, and executed.
* _Scripting host_ – an application or component that handles script compilation and execution – actually
  running scripts of this type.

With all of this in mind, it's best to split the project into two modules.

## Before you start

Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## Create a project

1. In IntelliJ IDEA, select **File** | **New** | **Project**.
2. In the panel on the left, select **New Project**.
3. Name the new project and change its location if necessary.

   > Select the **Create Git repository** checkbox to place the new project under version control. You will be able to do
   > it later at any time.
   >
   {style="tip"}

4. From the **Language** list, select **Kotlin**.
5. Select the **Gradle** build system.
6. From the **JDK** list, select the [JDK](https://www.oracle.com/java/technologies/downloads/) that you want to use in
   your project.
   * If the JDK is installed on your computer, but not defined in the IDE, select **Add JDK** and specify the path to the
     JDK home directory.
   * If you don't have the necessary JDK on your computer, select **Download JDK**.

7. Select the Kotlin or Gradle language for the **Gradle DSL**.
8. Click **Create**.

![Create a root project for custom Kotlin scripting](script-deps-create-root-project.png){width=700}

## Add scripting modules

Now you have an empty Kotlin/JVM Gradle project. Add the required modules, script definition and scripting host:

1. In IntelliJ IDEA, select **File | New | Module**.
2. In the panel on the left, select **New Module**. This module will be the script definition.
3. Name the new module and change its location if necessary. 
4. From the **Language** list, select **Java**.
5. Select the **Gradle** build system and Kotlin for the **Gradle DSL** if you want to write the build script in Kotlin.
6. As a module's parent, select the root module.
7. Click **Create**.

   ![Create script definition module](script-deps-module-definition.png){width=700}

8. In the module's `build.gradle(.kts)` file, remove the `version` of the Kotlin Gradle plugin. It is already in the
   root project's build script.

9. Repeat previous steps one more time to create a module for the scripting host.

The project should have the following structure:

![Custom scripting project structure](script-deps-project-structure.png){width=300}

You can find an example of such a project and more Kotlin scripting examples in the [kotlin-script-examples GitHub repository](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps).

## Create a script definition

First, define the script type: what developers can write in scripts of this type and how it will be handled.
In this tutorial, this includes support for the `@Repository` and `@DependsOn` annotations in the scripts.

1. In the script definition module, add the dependencies on the Kotlin scripting components in the `dependencies` block of
   `build.gradle(.kts)`. These dependencies provide the APIs you will need for the script definition:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven")
       // coroutines dependency is required for this particular definition
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%") 
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
       // coroutines dependency is required for this particular definition
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:%coroutinesVersion%'

   }
   ```

   </tab>
   </tabs>

2. Create the `src/main/kotlin/` directory in the module and add a Kotlin source file, for example, `scriptDef.kt`.

3. In `scriptDef.kt`, create a class. It will be a superclass for scripts of this type, so declare it `abstract` or `open`.

    ```kotlin
    // abstract (or open) superclass for scripts of this type
    abstract class ScriptWithMavenDeps
    ```

   This class will also serve as a reference to the script definition later.

4. To make the class a script definition, mark it with the `@KotlinScript` annotation. Pass two parameters to the annotation:
   * `fileExtension` – a string ending with `.kts` that defines a file extension for scripts of this type.
   * `compilationConfiguration` – a Kotlin class that extends `ScriptCompilationConfiguration` and defines the compilation
     specifics for this script definition. You'll create it in the next step.

   ```kotlin
    // @KotlinScript annotation marks a script definition class
    @KotlinScript(
        // File extension for the script type
        fileExtension = "scriptwithdeps.kts",
        // Compilation configuration for the script type
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
   ```
   
   > In this tutorial, we provide only the working code without explaining Kotlin scripting API.
   > You can find the same code with a detailed explanation [on GitHub](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt).
   > 
   {style="note"}

5. Define the script compilation configuration as shown below.

   ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            // Implicit imports for all scripts of this type
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                // Extract the whole classpath from context classloader and use it as dependencies
                dependenciesFromCurrentContext(wholeClasspath = true) 
            }
            // Callbacks
            refineConfiguration {
                // Process specified annotations with the provided handler
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
   ```

   The `configureMavenDepsOnAnnotations` function is as follows:

   ```kotlin
    // Handler that reconfigures the compilation on the fly
    fun configureMavenDepsOnAnnotations(context: ScriptConfigurationRefinementContext): ResultWithDiagnostics<ScriptCompilationConfiguration> {
        val annotations = context.collectedData?.get(ScriptCollectedData.collectedAnnotations)?.takeIf { it.isNotEmpty() }
            ?: return context.compilationConfiguration.asSuccess()
        return runBlocking {
            resolver.resolveFromScriptSourceAnnotations(annotations)
        }.onSuccess {
            context.compilationConfiguration.with { 
                dependencies.append(JvmDependency(it))
            }.asSuccess()
        }
    }
    
    private val resolver = CompoundDependenciesResolver(FileSystemDependenciesResolver(), MavenDependenciesResolver())
   ```

   You can find the full code [here](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt).


## Create a scripting host

The next step is creating the scripting host – the component that handles the script execution.

1. In the scripting host module, add the dependencies in the `dependencies` block of `build.gradle(.kts)`:
   * Kotlin scripting components that provide the APIs you need for the scripting host
   * The script definition module you created previously

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host")
       implementation(project(":script-definition")) // the script definition module
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition') // the script definition module
   }
   ```

   </tab>
   </tabs>

2. Create the `src/main/kotlin/` directory in the module and add a Kotlin source file, for example, `host.kt`.

3. Define the `main` function for the application. In its body, check that it has one argument – the path to the script file –
   and execute the script. You'll define the script execution in a separate function `evalFile` in the next step.
   Declare it empty for now.

   `main` can look like this:

   ```kotlin
    fun main(vararg args: String) {
        if (args.size != 1) {
            println("usage: <app> <script file>")
        } else {
            val scriptFile = File(args[0])
            println("Executing script $scriptFile")
            evalFile(scriptFile)
        }
    }
   ```

4. Define the script evaluation function. This is where you'll use the script definition. Obtain it by calling `createJvmCompilationConfigurationFromTemplate`
   with the script definition class as a type parameter. Then call `BasicJvmScriptingHost().eval`, passing it the script code and its
   compilation configuration. `eval` returns an instance of `ResultWithDiagnostics`, so set it as your function's return type.

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```

5. Adjust the `main` function to print information about the script execution:

   ```kotlin
    fun main(vararg args: String) {
        if (args.size != 1) {
            println("usage: <app> <script file>")
        } else {
            val scriptFile = File(args[0])
            println("Executing script $scriptFile")
            val res = evalFile(scriptFile)
            res.reports.forEach {
                if (it.severity > ScriptDiagnostic.Severity.DEBUG) {
                    println(" : ${it.message}" + if (it.exception == null) "" else ": ${it.exception}")
                }
            }
        }
    }
   ```

You can find the full code [here](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt)

## Run scripts

To check how your scripting host works, prepare a script to execute and a run configuration.

1. Create the file `html.scriptwithdeps.kts` with the following content in the project root directory:

   ```kotlin
   @file:Repository("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven")
   @file:DependsOn("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")
   
   import kotlinx.html.*; import kotlinx.html.stream.*; import kotlinx.html.attributes.*
   
   val addressee = "World"
   
   print(
       createHTML().html {
           body {
               h1 { +"Hello, $addressee!" }
           }
       }
   )
   ```
   
   It uses functions from the `kotlinx-html-jvm` library which is referenced in the `@DependsOn` annotation argument.

2. Create a run configuration that starts the scripting host and executes this file:
   1. Open `host.kt` and navigate to the `main` function. It has a **Run** gutter icon on the left.
   2. Right-click the gutter icon and select **Modify Run Configuration**.
   3. In the **Create Run Configuration** dialog, add the script file name to **Program arguments** and click **OK**.
   
      ![Scripting host run configuration](script-deps-run-config.png){width=800}

3. Run the created configuration.

You'll see how the script is executed, resolving the dependency on `kotlinx-html-jvm` in the specified repository and
printing the results of calling its functions:

```text
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

Resolving dependencies may take some time on the first run. Subsequent runs will complete much faster because they use
downloaded dependencies from the local Maven repository.

## What's next?

Once you've created a simple Kotlin scripting project, find more information on this topic:
* Read the [Kotlin scripting KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)
* Browse more [Kotlin scripting examples](https://github.com/Kotlin/kotlin-script-examples)
* Watch the talk [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/) by Rodrigo Oliveira
