[//]: # (title: Set repositories and dependencies in a Maven project)

For your Kotlin Maven project, you can configure where Maven looks for artifacts beyond the default Maven Central repository
and define the libraries your project depends on.

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

In general, to add a dependency on a library, you should declare a new `<dependency>` entry in the `<dependencies>` section:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

## Set dependencies

### Dependency on the standard library

Kotlin has an extensive standard library that you can use in your applications. You can add the standard library
dependency manually or enable the `<extensions>` option to set it up automatically if it's missing.

#### Automatic setup

You can avoid manual configuration using the [`<extensions>` option](maven-configure-project.md#automatic-configuration) provided
by the Kotlin Maven plugin. It automatically adds the `kotlin-stdlib` dependency if it's not defined in the project.
For example, when you create a new Kotlin Maven project or introduce Kotlin to your existing Java Maven project.

If you already declared a dependency `kotlin-stdlib`, for example, with a different version, the Kotlin Maven plugin with
`<extensions>` will not overwrite it.

You can also opt out from the automatic addition of the standard library. For that, add the following to the `<properties>`
section:

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

> This property disables not only automatic addition of the standard library, but also the registration of source root paths.
> Other `<extensions>` features are not affected.
>
{style="note"}

#### Manual configuration

To manually add Kotlin's standard library to your project, update the `dependencies` section in your `pom.xml` file with the following:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- Uses kotlin.version specified in <properties/>: --> 
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

[Configure Kotlin compiler](maven-kotlin-compiler.md)
