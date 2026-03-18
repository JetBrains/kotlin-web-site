[//]: # (title: Configure a Maven project)

When you want to introduce Kotlin to your existing Java Maven project or create a new Kotlin Maven project, you need
to add the Kotlin Maven plugin to your `pom.xml` build file and declare repositories.

The Kotlin Maven project `kotlin-maven-plugin` compiles Kotlin sources and modules. Currently, only Maven v3 is supported.

## Automatic configuration with extensions

You can simplify Maven configuration in both mixed Java-Kotlin projects and in pure Kotlin projects using the `<extensions>` option.
It allows skipping the Maven compiler plugin configuration.

To apply the Kotlin Maven plugin with `<extensions>`, update your `pom.xml` build file as follows:

1. In the `<properties>` section, define the version of Kotlin you want to use in the `kotlin.version` property:

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. In the `<build><plugins>` section, add the Kotlin Maven plugin with the enabled `<extensions>` option:

   ```xml
   <build>
       <plugins>
           <!-- Kotlin compiler plugin configuration -->
           <plugin>
               <groupId>org.jetbrains.kotlin</groupId>
               <artifactId>kotlin-maven-plugin</artifactId>
               <version>${kotlin.version}</version> <!-- Enable the extension -->
           </plugin>
           <!-- No need to configure Maven compiler plugin with extensions -->
       </plugins>
   </build>
   ```

The `<extensions>` option:

* Registers `src/main/kotlin` and `src/test/kotlin` directories as source roots if they already exist but are not specified in the plugin configuration.
* Adds the [`kotlin-stdlib` dependency](maven-set-dependencies.md#dependency-on-the-standard-library) if it's not already defined in the project.
* Adds `compile`, `test-compile`, `kapt`, and `test-kapt` executions to your build, bound to their appropriate [lifecycle phases](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html).
  So, you don't need to manually set up the `<executions>` section with `<id>` and `<goals>`.
   
If you have a mixed Java and Kotlin project, the configuration ensures that:

* Kotlin code is compiled first.
* Java code is compiled after Kotlin and can reference Kotlin classes.
* Default Maven behavior doesn't override the plugin order.

The extension configuration replaces the whole `<executions>` section. If you need to configure an execution,
see an example in [Compile Kotlin and Java sources](#compile-kotlin-and-java-sources).

> If several build plugins overwrite the default lifecycle, and you have also enabled the `<extensions>` option, the last plugin in
> the `<build>` section has priority for lifecycle settings. All earlier changes to lifecycle settings are ignored.
>
{style="note"}

### Change Maven compiler version

Currently, the default version of the Maven compiler plugin used with `<extensions>` is %mavenExtensionsVersion%.
You can set a different version separately:

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
        <!-- Maven compiler plugin configuration for Java classes -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>%mavenPluginVersion%</version>
        </plugin>
    </plugins>
</build>
```

## Manual configuration without extensions

Without enabling `<extensions>` in the Kotlin Maven plugin, a manual project configuration is necessary to ensure that
the source code is compiled correctly.

You can set up your Maven project to compile a combination of [Java and Kotlin sources](#compile-kotlin-and-java-sources)
or [Kotlin-only sources](#compile-kotlin-only-sources).

### Compile Kotlin and Java sources

To compile a project with both Kotlin and Java source files, ensure that the Kotlin compiler runs before the Java compiler.

The Java compiler can't see Kotlin declarations until they are compiled into `.class` files.
If your Java code uses Kotlin classes, those classes must be compiled first to avoid `cannot find symbol` errors.

Maven determines plugin execution order based on two main factors:

* The order of plugin declarations in the `pom.xml` file.
* Built-in default executions, such as `default-compile` and `default-testCompile`, which always run before user-defined executions,
  regardless of their position in the `pom.xml` file.

To control the execution order:

* Declare `kotlin-maven-plugin` before `maven-compiler-plugin`.
* Disable the Java compiler plugin's default executions.
* Add custom executions to control compile phases explicitly.

> You can use the special `none` phase in Maven to disable a default execution.
>
{style="note"}

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>kotlin-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- Ensure Kotlin code can reference Java code -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>kotlin-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <!-- Maven compiler plugin configuration -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.15.0</version>
            <executions>
                <!-- Disable default executions -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- Define custom executions -->
                <execution>
                    <id>java-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

This configuration ensures that:

* Kotlin code is compiled first.
* Java code is compiled after Kotlin and can reference Kotlin classes.
* Default Maven behavior doesn't override the plugin order.

For more details on how Maven handles plugin executions,
see [Guide to default plugin execution IDs](https://maven.apache.org/guides/mini/guide-default-execution-ids.html) in
the official Maven documentation.

### Compile Kotlin-only sources

To compile a project with just Kotlin source files, declare source roots and configure the Kotlin Maven plugin:

1. Specify the source directories in the `<build>` section:

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. Ensure that the Kotlin Maven plugin is applied:

    ```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <executions>
                    <execution>
                        <id>compile</id>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <goals>
                            <goal>test-compile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
    ```

### Use JDK 17

To use JDK 17, in your `.mvn/jvm.config` file, add:

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## Declare repositories

By default, the `mavenCentral` repository is available for all Maven projects. To access artifacts in other repositories,
specify a custom ID for the repository name and its URL in the `<repositories>` section:

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> If you declare `mavenLocal()` as a repository in a Gradle project, you may experience problems when switching
> between Gradle and Maven projects. For more information, see [Declare repositories](gradle-configure-project.md#declare-repositories).
>
{style="note"}

## What's next?

[Set dependencies in your Kotlin Maven project](maven-set-dependencies.md)