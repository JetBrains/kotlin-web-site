[//]: # (title: Use annotation processors in Kotlin projects)

<tldr>

* Use **[kapt](kapt.md)** if:
  * You have a Maven project.
  * You have a Gradle project, but the required Java annotation processor does not yet support KSP. [See the list of supported libraries](ksp-overview.md#supported-libraries).
* Use **[KSP](ksp-overview.md)** if:
  * You have a Gradle project, and the required Java annotation processor supports KSP.
  * You want to create your own annotation processors.

</tldr>

Annotation processors analyze your source code at compile time to generate boilerplate code, validate usage, or produce other artifacts.
Kotlin supports two ways to work with annotation processors:

* [The kapt compiler plugin](#use-kapt-with-java-annotation-processors) works by generating stub files from Kotlin source
  code and then running the Java annotation processors on those stubs. This extra stub-generation step makes
  the build time slower and means it cannot understand Kotlin-specific constructs, such as extension functions or null safety.

  kapt supports both Maven and Gradle. It's recommended for all Maven projects and for Gradle projects with processor
  libraries that have not yet adopted KSP, such as [MapStruct](https://mapstruct.org/).

* [The KSP framework](#use-ksp-in-gradle-projects) reads Kotlin source code directly through a Kotlin-first API,
  without generating stubs. It understands Kotlin-specific features natively and runs builds faster than kapt.

  Currently, KSP has official support only for Gradle. It's recommended for writing your own processors and working with
  KSP-compatible libraries like [Dagger](https://dagger.dev/).

## Use kapt with Java annotation processors

[kapt](kapt.md) lets you use existing Java annotation processors in Kotlin projects without any changes to the processors
themselves.

The example below shows how to use the [MapStruct](https://mapstruct.org/) annotation processor, which generates type-safe
mapper implementations between Java beans at compile time.

1. Apply the `kapt` plugin and add MapStruct as a dependency:

   <tabs group="build-tool">
   <tab title="Maven" group-key="maven">
   
   ```xml
   <properties>
       <kotlin.compiler.jvmTarget>11</kotlin.compiler.jvmTarget>
       <mapstruct.version>1.6.3</mapstruct.version>
   </properties>
   
   <dependencies>
       <dependency>
           <groupId>org.mapstruct</groupId>
           <artifactId>mapstruct</artifactId>
           <version>${mapstruct.version}</version>
       </dependency>
   </dependencies>
   
   <plugin>
       <groupId>org.jetbrains.kotlin</groupId>
       <artifactId>kotlin-maven-plugin</artifactId>
       <version>${kotlin.version}</version>
       <extensions>true</extensions>
       <executions>
           <execution>
               <id>kapt</id>
               <goals>
                   <goal>kapt</goal>
               </goals>
               <configuration>
                   <sourceDirs>
                       <sourceDir>src/main/kotlin</sourceDir>
                       <sourceDir>src/main/java</sourceDir>
                   </sourceDirs>
                   <aptMode>stubs</aptMode>
                   <annotationProcessorPaths>
                       <annotationProcessorPath>
                           <groupId>org.mapstruct</groupId>
                           <artifactId>mapstruct-processor</artifactId>
                           <version>${mapstruct.version}</version>
                       </annotationProcessorPath>
                   </annotationProcessorPaths>
               </configuration>
           </execution>
       </executions>
   </plugin>
   ```
   
   * The execution of the `kapt` goal from `kotlin-maven-plugin` is added **before** the `compile` execution.
   * The `aptMode` option configures the [level of annotation processing](kapt.md#use-in-maven).

   </tab>
   <tab title="Gradle Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       kotlin("kapt") version "%kotlinVersion%"
   }
   
   dependencies {
       implementation("org.mapstruct:mapstruct:1.6.3")
       kapt("org.mapstruct:mapstruct-processor:1.6.3")
   }
   ```
   
   </tab>
   <tab title="Gradle Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
   }
   
   dependencies {
       implementation "org.mapstruct:mapstruct:1.6.3"
       kapt "org.mapstruct:mapstruct-processor:1.6.3"
   }
   ```
   
   </tab>
   </tabs>

2. Define your data classes and a mapper interface:

   ```kotlin
   import org.mapstruct.Mapper
   import org.mapstruct.factory.Mappers
   
   data class UserDto(val id: Long, val firstName: String, val lastName: String)
   
   data class UserEntity(val id: Long, val firstName: String, val lastName: String)
   
   @Mapper
   interface UserMapper {
       fun toDto(entity: UserEntity): UserDto
       fun toEntity(dto: UserDto): UserEntity
   
       companion object : UserMapper by Mappers.getMapper(UserMapper::class.java)
   }
   ```

3. Build the project. MapStruct generates the `UserMapperImpl` class in the generated sources directory.
   Use the generated mapper in your code:

   ```kotlin
   fun main() {
       val entity = UserEntity(id = 1L, firstName = "John", lastName = "Doe")
       val dto = UserMapper.toDto(entity)
       println(dto) // UserDto(id=1, firstName=John, lastName=Doe)
   }
   ```

## Use KSP in Gradle projects

With [KSP](ksp-overview.md), you can use existing annotation processors in Gradle projects and create your own 
processors that generate code based on annotations in your source code.

### Use KSP with Java annotation processors

For Gradle projects, it's recommended to use KSP and its compatible annotation processors since it's faster than kapt and
can understand Kotlin-specific features natively. See the list of [libraries that already support KSP](ksp-overview.md#supported-libraries).

The example below shows how to use [Dagger](https://dagger.dev/), a compile-time dependency injection framework that
generates the wiring code for your dependency graph.

1. Add the KSP plugin and the Dagger dependency to your `build.gradle(.kts)` file:
 
   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   // build.gradle.kts
   
   plugins {
       kotlin("jvm") version "%kotlinVersion%"
       id("com.google.devtools.ksp") version "%kspVersion%"
   }
   
   dependencies {
       implementation("com.google.dagger:dagger:2.59.2")
       ksp("com.google.dagger:dagger-compiler:2.59.2")
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   // build.gradle
   
   plugins {
       id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
       id 'com.google.devtools.ksp' version '%kspVersion%'
   }
   
   dependencies {
       implementation 'com.google.dagger:dagger:2.59.2'
       ksp 'com.google.dagger:dagger-compiler:2.59.2'
   }
   ```
   
   </tab>
   </tabs>

   > To find the latest version of KSP, check the GitHub [Releases](https://github.com/google/ksp/releases) page.
   >
   {style="tip"}

2. Annotate your Kotlin classes with Dagger annotations:

   ```kotlin
   import javax.inject.Inject
   import javax.inject.Singleton
   import dagger.Component
   import dagger.Module
   import dagger.Provides
   
   @Singleton
   class UserRepository @Inject constructor() {
       fun getUser(): String = "John Doe"
   }
   
   @Module
   class AppModule {
       @Provides
       @Singleton
       fun provideUserRepository(): UserRepository = UserRepository()
   }
   
   @Singleton
   @Component(modules = [AppModule::class])
   interface AppComponent {
       fun userRepository(): UserRepository
   }
   ```

3. Build the project. Dagger generates implementation classes, for example `DaggerAppComponent`, in the
   `build/generated/ksp` directory. Use the generated class in your code:

    ```kotlin
    fun main() {
        val appComponent = DaggerAppComponent.create()
        val userRepository = appComponent.userRepository()
        println("User: ${userRepository.getUser()}") // User: John Doe
    }
    ```

For more information on Dagger support for KSP, see its [documentation](https://dagger.dev/dev-guide/ksp.html).

### Create your own annotation processor

You can use the KSP API to write your own annotation processors that generate code at compile time.
A new processor requires three modules:

* An `annotation` module that declares the custom annotation.
* A `processor` module that implements the `SymbolProcessor` with the main logic and the `SymbolProcessorProvider` factory
  that creates your processor, and registers the provider in the `META-INF/services/` path.
* An `app` module that applies the KSP plugin, depends on the processor, and uses the annotation.

For a complete step-by-step instructions, see the [KSP quickstart](ksp-quickstart.md#create-your-own-processor).

## What's next

* [Learn more about kapt configuration](kapt.md)
* [Get started with KSP](ksp-quickstart.md)
* [See how to migrate from kapt to KSP](ksp-kapt-migration.md)
