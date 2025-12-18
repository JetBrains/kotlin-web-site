[//]: # (title: Configure a Maven project)

To build a Kotlin project with Maven, you need to add the Kotlin Maven plugin to your `pom.xml` build file,
declare repositories, and configure the project's dependencies.

## Enable and configure the plugin

The `kotlin-maven-plugin` compiles Kotlin sources and modules. Currently, only Maven v3 is supported.

To apply the Kotlin Maven plugin, update your `pom.xml` build file as follows:

1. In the `<properties>` section, define the version of Kotlin you want to use in the `kotlin.version` property:

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. In the `<build><plugins>` section, add the Kotlin Maven plugin:

   ```xml
   <plugins>
       <plugin>
           <artifactId>kotlin-maven-plugin</artifactId>
           <groupId>org.jetbrains.kotlin</groupId>
           <version>%kotlinVersion%</version>
       </plugin>
   </plugins>
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

## Set dependencies

To add a dependency on a library, include it in the `<dependencies>` section:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### Dependency on the standard library

Kotlin has an extensive standard library that you can use in your applications.
To use the standard library in your project, add the following dependency to your `pom.xml` file:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- Uses the kotlin.version property 
            specified in <properties/>: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> If you're targeting JDK 7 or 8 with Kotlin versions older than:
> * 1.8, use `kotlin-stdlib-jdk7` or `kotlin-stdlib-jdk8`, respectively.
> * 1.2, use `kotlin-stdlib-jre7` or `kotlin-stdlib-jre8`, respectively.
>
{style="note"}

### Dependencies on test libraries

If your project uses [Kotlin reflection](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/)
or testing frameworks, add the relevant dependencies.
Use `kotlin-reflect` for the reflection library, and `kotlin-test` and `kotlin-test-junit5` for testing libraries:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Dependency on a kotlinx library

For kotlinx libraries, you can either add the base artifact name or the name with a `-jvm` suffix. Refer to
the library's README file on [klibs.io](https://klibs.io/).

For example, to add a dependency on [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) library:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

To add a dependency on the [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) library:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

### Use BOM dependency mechanism

To use a Kotlin [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms),
add a dependency on [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom):

```xml
<dependencyManagement>
    <dependencies>  
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-bom</artifactId>
            <version>%kotlinVersion%</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## What's next?

[Compile and package your Kotlin Maven project](maven-compile-package.md)