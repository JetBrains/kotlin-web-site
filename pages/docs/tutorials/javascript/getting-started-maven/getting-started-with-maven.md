---
type: tutorial
layout: tutorial
title:  "Getting Started with Kotlin and JavaScript with Maven"
description: "A look at how to use Maven to target JavaScript."
authors: Hadi Hariri 
date: 
showAuthorInfo: false
---

In this tutorial we'll see how to

* [Create an application targeting JavaScript with Maven](#Creatinganapplicationtargetingjavascript)
* [Configure compiler options](#configuringcompileroptions)


## Creating an application targeting JavaScript


### Automatic Configuration

The easiest way to create a new application targeting JavaScript with Maven is to allow IntelliJ IDEA
to configure the Maven project for ys. Simply create a new Maven project in IntelliJ IDEA. Once the project is created, add a new 
folder to host your Kotlin source code, removing the default Java one created. The project should end up with the following structure
 
![Project Structure]({{ url_for('tutorial_img', filename='javascript/getting-started-maven/project-structure.png')}})

We can now add our first Kotlin source code file and IntelliJ IDEA will prompt us to configure the project for Kotlin. On doing so, we should select as target
JavaScript


![Configure Kotlin]({{ url_for('tutorial_img', filename='javascript/getting-started-maven/configure-kotlin.png')}})


IntelliJ IDEA will add the corresponding entries `pom.xml` for us in the [Maven configuration](#mavenconfiguration). 


### Manual Configuration

If we're not using IntelliJ IDEA, we can configure the `pom.xml` file manually to target JavaScript, by adding the following entries


#### Maven configuration

```xml
    <properties>
        <kotlin.version>1.0.4</kotlin.version> 
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-js-library</artifactId>
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

## Configuring Compiler Options

Similar to when we're using [IntelliJ IDEA build system](../getting-started-idea/getting-started-with-intellij-idea.md) or the command line, we can have the compiler output JavaScript to comply with a specific module system such as AMD, CommonJS or UMD. 

In order to specify the module kind, we can add a configuration to our plugin as below

```xml
 </executions>
 ...
 <configuration>
        <moduleKind>commonjs</moduleKind>
 </configuration>

```

where `moduleKind` can be

* plain (default)
* amd
* commonjs
* umd

For more information about the different types of module outputs, please see [Working with Modules](../working-with-modules/working-with-modules.md)

