---
type: doc
layout: reference
title: "Using Ant"
description: "This tutorial walks you through different scenarios when using Ant for building applications that contain Kotlin code"
---

# Using Ant

## Getting the Ant Tasks

Kotlin provides three tasks for Ant:

* kotlinc: Kotlin compiler targeting the JVM
* kotlin2js: Kotlin compiler targeting JavaScript
* withKotlin: Task to compile Kotlin files when using the standard *javac* Ant task

These tasks are defined in the *kotlin-ant.jar* library which is located in the *lib* folder for the [Kotlin Compiler]({{site.data.releases.latest.url}})


## Targeting JVM with Kotlin-only source

When the project consists of exclusively Kotlin source code, the easiest way to compile the project is to use the *kotlinc* task

``` xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

where ${kotlin.lib} points to the folder where the Kotlin standalone compiler was unzipped.

## Targeting JVM with Kotlin-only source and multiple roots

If a project consists of multiple source roots, use *src* as elements to define paths

``` xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc output="hello.jar">
          <src path="root1"/>
          <src path="root2"/>
        </kotlinc>
    </target>
</project>
```

## Targeting JVM with Kotlin and Java source

If a project consists of both Kotlin and Java source code, while it is possible to use *kotlinc*, to avoid repetition of task parameters, it is
recommended to use *withKotlin* task

``` xml
<project name="Ant Task Test" default="build">

    <path id="classpath">
        <fileset dir="${idea.sdk}/lib" includes="annotations.jar"/>
        <fileset dir="${kotlin.home}" includes="kotlin-runtime.jar"/>
    </path>

    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <delete dir="classes" failonerror="false"/>
        <mkdir dir="classes"/>
        <javac destdir="classes" includeAntRuntime="false" srcdir="root1">
            <classpath refid="classpath"/>
            <withKotlin externalannotations="root1/b/">
                <externalannotations path="root1/a/" />
            </withKotlin>
        </javac>
        <jar destfile="hello.jar">
            <fileset dir="/classes"/>
        </jar>
    </target>
</project>
```


## Targeting JavaScript with single source folder

``` xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## Targeting JavaScript with Prefix, PostFix and sourcemap options

``` xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## Targeting JavaScript with single source folder and metaInfo option

The metaInfo option is useful, if you want to create a Kotlin/JavaScript library.
If metaInfo was set to true, then during compilation additional js-file with
binary metadata will be created.

``` xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js will be created, which contains binary descriptors -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## References

Complete list of elements and attributes are listed below

### kotlinc Attributes

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `src`  | Kotlin source file or directory to compile | Yes |  |
| `output`  | Destination directory or .jar file name | Yes |  |
| `classpath`  | Compilation class path | No |  |
| `classpathref`  | Compilation class path reference | No |  |
| `stdlib`  | Path to "kotlin-runtime.jar" | No | ""  |
| `includeRuntime`  | If `output` is a .jar file, whether Kotlin runtime library is included in the jar | No | true  |


### withKotlin attributes

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `externalannotations` | Path to external annotations | No |  |


### kotlin2js Attributes

| Name | Description | Required |
|------|-------------|----------|
| `src`  | Kotlin source file or directory to compile | Yes |
| `output`  | Destination file | Yes |
| `library`  | Library files (kt, dir, jar) | No |
| `outputPrefix`  | Prefix to use for generated JavaScript files | No |
| `outputSuffix` | Suffix to use for generated JavaScript files | No |
| `sourcemap`  | Whether sourcemap file should be generated | No |
| `metaInfo`  | Whether metadata file with binary descriptors should be generated | No |
| `main`  | Should compiler generated code call the main function | No |


