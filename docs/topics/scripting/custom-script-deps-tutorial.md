[//]: # (title: Get started with Kotlin custom scripting – tutorial)

> Kotlin scripting in [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see details below). Use it only for evaluation purposes. We appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

_Kotlin scripting_ is a technology that enables executing Kotlin code as scripts, without prior compilation or
packaging into executables.

For an overview of Kotlin scripting with examples, see the talk [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/) 
by Rodrigo Oliveira from KotlinConf'19 .

In this tutorial, you'll create a Kotlin scripting project that executes arbitrary Kotlin code with maven dependencies.
You'll be able to execute scripts like the following:

```kotlin
@file:DependsOn("junit:junit:4.11")
org.junit.Assert.assertTrue(true)
```

The specified maven dependency will be downloaded during execution and used for the rest of the script.

## Project structure

A minimal Kotlin custom scripting project contains two parts:

* _Script definition_ - a set of parameters and configurations that define the script type. It includes the file extension
and location, compilation parameters, and so on.
* _Scripting host_ - an application or component that handles script execution.

So, you'll need a Kotlin/JVM Gradle project with two modules.

## Create a root project

1. Go to **File | New | Project**.
2. Add a new **Gradle** module with **Kotlin/JVM**. Select the **Kotlin DSL build script**
  checkbox if you want to write the build script in Kotlin.
  TODO: screenshot

Now you have an empty Kotlin/JVM Gradle project where you will add the required modules: script definition and scripting host.

## Create a script definition

1. Go to **File | New | Module** and add a new **Gradle** module with **Kotlin/JVM**. Select the **Kotlin DSL build script**
checkbox if you want to write the build script in Kotlin.

2. Give the module a name and select the root module as its parent.
TODO: screenshot

3. In the module's `build.gradle(.kts)` file, remove the `version` of the Kotlin Gradle plugin. You already have it in the
root project's build script.

4. Add the dependencies on the Kotlin scripting components in the `dependencies` block of `build.gradle(.kts)`. These dependencies
provide the APIs you will need for the script definition:

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

5. Create the `src/main/kotlin/` directory in the module and add Kotlin source file, for example, `scriptDef.kt`.

6. In `scriptDef.kt`, create an abstract class. It will be a _script definition_. 

    ```kotlin
    abstract class ScriptWithMavenDeps
    ```

7. To make the class a script definition, mark it with the `@KotlinScript` annotation. Pass two parameters to the annotation:
   * `fileExtension` - a string ending with `.kts` that defines a file extension for scripts of this type. 
   * `compilationConfiguration` - a Kotlin class that extends `ScriptCompilationConfiguration` and defines the compilation
    specifics for this script definition. You'll create it in the next step.

   ```kotlin
    @KotlinScript(
        fileExtension = "scriptwithdeps.kts",
        compilationConfiguration = ScriptWithMavenDepsConfiguration::class
    )
    abstract class ScriptWithMavenDeps

    object ScriptWithMavenDepsConfiguration: ScriptCompilationConfiguration()
   ```

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

Now you have the script definition: you know what can be written in the scripts and their file extensions. The next step
is creating the scripting host – the component that handles the script execution. 

## Create a scripting host

1. Go to **File | New | Module** and add a new **Gradle** module with **Kotlin/JVM**. Select the **Kotlin DSL build script**
   checkbox if you want to write the build script in Kotlin.

2. Give the module a name and select the root module as its parent.
   TODO: screenshot

3. In the module's `build.gradle(.kts)` file, remove the `version` of the Kotlin Gradle plugin. You already have it in the
   root project's build script.

4. Add the dependencies in the `dependencies` block of `build.gradle(.kts)`:
   * Kotlin scripting components that provide the APIs you need for the scripting host
   * The script definition module you've created previously
    
   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-scripting-common:$kotlinVersion")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm:$kotlinVersion")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm-host:$kotlinVersion")
       implementation(project(":script-definition"))
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm-host'
       implementation project(':script-definition')
   }
   ```

   </tab>
   </tabs>

7. Create the `src/main/kotlin/` directory in the module and add Kotlin source file, for example, `host.kt`.

8. Define the `main` function for the application. The application should run with one argument - the path to the script file,
  and execute the script. You'll define the script execution in a separate function on the next step. Just declare it empty for now.

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

9. Define the script evaluation function. This is where you'll use the script definition. Obtain it by calling `createJvmCompilationConfigurationFromTemplate`
  with the script definition as a type parameter. Then call `BasicJvmScriptingHost().eval` passing it the script code and its
  compilation configuration. `eval` returns an instance of `ResultWithDiagnostics`, so set your function's return type to it.

   ```kotlin
    fun evalFile(scriptFile: File): ResultWithDiagnostics<EvaluationResult> {
        val compilationConfiguration = createJvmCompilationConfigurationFromTemplate<ScriptWithMavenDeps>()
        return BasicJvmScriptingHost().eval(scriptFile.toScriptSource(), compilationConfiguration, null)
    }
   ```


You can find the full code [here](https://github.com/Kotlin/kotlin-script-examples/blob/master/jvm/basic/jvm-maven-deps/host/src/main/kotlin/org/jetbrains/kotlin/script/examples/jvm/resolve/maven/host/host.kt)

## Run scripts

## What's next?

* [Kotlin scripting KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)
* [Kotlin scripting examples](https://github.com/Kotlin/kotlin-script-examples)
* [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/) - KotlinConf'19 talk by Rodrigo Oliveira