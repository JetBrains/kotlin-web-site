---
type: tutorial
layout: tutorial
title:  "Getting Started with Kotlin and JavaScript with Maven"
description: "A look at how to use Maven to target JavaScript."
authors: Hadi Hariri 
date: 2016-11-04
showAuthorInfo: false
---

>__Warning__: this tutorial is outdated for Kotlin {{ site.data.releases.latest.version }}.
>We strongly recommend using Gradle for Kotlin/JS projects. For instructions on creating 
>Kotlin/JS projects with Gradle, see [Setting up a Kotlin/JS project](../setting-up.html)
{:.note}
>

* [Create an application targeting JavaScript with Maven](#creating-an-application-targeting-javascript)
* [Configure compiler options](#configuring-compiler-options)


## Creating an application targeting JavaScript


### Automatic Configuration

The easiest way to create a new application targeting JavaScript with Maven is to allow IntelliJ IDEA
to configure the Maven project for us. Simply create a new Maven project in IntelliJ IDEA and once the project is created, add a new 
folder to host the Kotlin source code, removing the default Java one. The project should end up with the following structure
 
![Project Structure]({{ url_for('tutorial_img', filename='javascript/getting-started-maven/project-structure.png')}})

We can now add our first Kotlin source code file and IntelliJ IDEA will prompt us to configure the project for Kotlin. On doing so, we should select as target
JavaScript


![Configure Kotlin]({{ url_for('tutorial_img', filename='javascript/getting-started-maven/configure-kotlin.png')}})


IntelliJ IDEA will add the corresponding entries for us in the [Maven configuration](#maven-configuration). 


### Manual Configuration

If we're not using IntelliJ IDEA, we can configure the `pom.xml` file manually to target JavaScript, by adding the following entries


#### Maven configuration

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<properties>
    <kotlin.version>{{ site.data.releases.latest.version }}</kotlin.version> 
</properties>

<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib-js</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>

<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>js</goal>
                    </goals>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>test-js</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>

```
</div>

On compiling, Maven will produce the following output

![Maven Output]({{ url_for('tutorial_img', filename='javascript/getting-started-maven/maven-output.png')}})

where we can see the output of our application, which is the `kotlinjs-maven.js` file. 

In order to use this, we also need to include the Kotlin standard library in our application, i.e. `kotlin.js`, which was included as a dependency. By default,
Maven does not expand the JAR as part of the build process, so we would need to add an additional step in our build to do so.

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <executions>
        <execution>
            <id>unpack</id>
            <phase>compile</phase>
            <goals>
                <goal>unpack</goal>
            </goals>
            <configuration>
                <artifactItems>
                    <artifactItem>
                        <groupId>org.jetbrains.kotlin</groupId>
                        <artifactId>kotlin-stdlib-js</artifactId>
                        <version>${kotlin.version}</version>
                        <outputDirectory>${project.build.directory}/js/lib</outputDirectory>
                        <includes>*.js</includes>
                    </artifactItem>
                </artifactItems>
            </configuration>
        </execution>
    </executions>
</plugin>
```
</div>

For more information on the output generated please see [Kotlin to JavaScript](../kotlin-to-javascript/kotlin-to-javascript.html)

## Configuring Compiler Options

Similar to when we're using [IntelliJ IDEA build system](../getting-started-idea/getting-started-with-intellij-idea.html) or the command line, we can have the compiler output JavaScript to comply with a specific module system such as AMD, CommonJS or UMD. 

In order to specify the module kind, we can add a configuration to our plugin as below

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
 </executions>
 ...
 <configuration>
        <moduleKind>commonjs</moduleKind>
        <sourceMap>true</sourceMap>
 </configuration>

```
</div>

where `moduleKind` can be

* plain (default)
* amd
* commonjs
* umd

For more information about the different types of module outputs, please see [Working with Modules](../working-with-modules/working-with-modules.html)

We can also see how we can define whether we want the compiler to generate sourcemaps for us by indicating this via the `sourceMap` parameter.


