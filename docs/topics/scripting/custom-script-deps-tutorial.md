[//]: # (title: Get started with Kotlin custom scripting – tutorial)

> Kotlin scripting in [Experimental](components-stability.md). It may be dropped or changed at any time.
> Use it only for evaluation purposes. We appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

_Kotlin scripting_ is the technology that enables executing Kotlin code as scripts, without prior compilation or
packaging into executables.

For an overview of Kotlin scripting with examples, see the talk [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/)
by Rodrigo Oliveira from KotlinConf'19 .

In this tutorial, you'll create a Kotlin scripting project that executes arbitrary Kotlin code with Maven dependencies.
You'll be able to execute scripts like the following:

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

The specified Maven dependency (`kotlinx-html-jvm` for this example) will be downloaded during execution and used for the
rest of the script.


## Project structure

A minimal Kotlin custom scripting project contains two parts:

* _Script definition_ – a set of parameters and configurations that define how this script type should be recognized,
   compiled, and executed, and other aspects of the handling.
* _Scripting host_ – an application or component that handles script compilation and execution; in other words, actually 
   runs scripts of this type.

According to this, it’s convenient to organize the project in two modules.

## Set up the project structure

Create a Kotlin/JVM Gradle project with two modules:

1. Go to **File | New | Project**.
2. Create a new **Gradle** project with **Kotlin/JVM**. Select the **Kotlin DSL build script**
   checkbox if you want to write the build script in Kotlin.
   TODO: screenshot

   Now you have an empty Kotlin/JVM Gradle project where you will add the required modules: script definition and scripting host.

3. Go to **File | New | Module** and add a new **Gradle** module with **Kotlin/JVM**. Select the **Kotlin DSL build script**
   checkbox if you want to write the build script in Kotlin. This module will be the script definition.

4. Give the module a name and select the root module as its parent.
   TODO: screenshot

5. In the module's `build.gradle(.kts)` file, remove the `version` of the Kotlin Gradle plugin. You already have it in the
   root project's build script.

6. Repeat steps 3, 4, and 5 one more time to create a module for the scripting host.

TODO: project structure screenshot

You can find an example of such project and more Kotlin scripting examples in [this GitHub repository](https://github.com/Kotlin/kotlin-script-examples/tree/master/jvm/basic/jvm-maven-deps).

## Create a script definition

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
   }
   ```

   </tab>
   </tabs>

5. Create the `src/main/kotlin/` directory in the module and add a Kotlin source file, for example, `scriptDef.kt`.

6. In `scriptDef.kt`, create an abstract class. It will be the _script definition_.

    ```kotlin
    abstract class ScriptWithMavenDeps
    ```

7. To make the class a script definition, mark it with the `@KotlinScript` annotation. Pass two parameters to the annotation:
   * `fileExtension` - a string ending with `.kts` that defines a file extension for scripts of this type.
   * `compilationConfiguration` - a Kotlin class that extends `ScriptCompilationConfiguration` and defines the compilation
     specifics for this script definition. You'll create it on the next step.

   ```kotlin
    @KotlinScript(
        fileExtension = "scriptwithdeps.kts",
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
   ```
   
   > In this tutorial, we provide only the working code without explaining Kotlin scripting API in general.
   > You can find the same code with detailed explanation comments [here](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/script/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/scriptDef.kt).
   > 
   {type="note"}

8. Define the script compilation configuration as shown below.

   ```kotlin
    object ScriptWithMavenDepsConfiguration : ScriptCompilationConfiguration(
        {
            defaultImports(DependsOn::class, Repository::class)
            jvm {
                dependenciesFromCurrentContext(
                    "script", // script library jar name
                    "kotlin-scripting-dependencies" // DependsOn annotation is taken from this jar
                )
            }
            refineConfiguration {
                onAnnotations(DependsOn::class, Repository::class, handler = ::configureMavenDepsOnAnnotations)
            }
        }
    )
   ```

   The `configureMavenDepsOnAnnotations` function is as follows:

   ```kotlin
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


Now you have the script definition: you know what can be written in the scripts and their file extension. The next step
is creating the scripting host – the component that handles the script execution.

## Create a scripting host

1. In the scripting host module, add the dependencies in the `dependencies` block of `build.gradle(.kts)`:
   * Kotlin scripting components that provide the APIs you need for the scripting host
   * The script definition module you've created previously

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

2. Create the `src/main/kotlin/` directory in the module and add Kotlin source file, for example, `host.kt`.

3. Define the `main` function for the application. The application should run with one argument – the path to the script file –
   and execute the script. You'll define the script execution in a separate function `evalFile` on the next step. Declare it empty for now.

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
   with the script definition class as a type parameter. Then call `BasicJvmScriptingHost().eval` passing it the script code and its
   compilation configuration. `eval` returns an instance of `ResultWithDiagnostics`, so set your function's return type to it.

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
      TODO: screenshot

3. Run the created configuration.

You'll see how the script is executed: it resolves the dependency on `kotlinx-html-jvm` in the specified repository and
prints the results of calling its functions:

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