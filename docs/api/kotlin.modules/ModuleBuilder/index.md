---
layout: api
title: ModuleBuilder
---
[stdlib](../../index.html) / [kotlin.modules](../index.html) / [ModuleBuilder](index.html)

# ModuleBuilder

```
open class ModuleBuilder
```
## Members
| Name | Summary |
|------|---------|
|[*.init*](_init_.html)|&nbsp;&nbsp;`public ModuleBuilder(name: String, outputDir: String)`<br>|
|[addAnnotationsPathEntry](addAnnotationsPathEntry.html)|&nbsp;&nbsp;`public fun addAnnotationsPathEntry(name: String): Unit`<br>|
|[addClasspathEntry](addClasspathEntry.html)|&nbsp;&nbsp;`public fun addClasspathEntry(name: String): Unit`<br>|
|[addSourceFiles](addSourceFiles.html)|&nbsp;&nbsp;`public fun addSourceFiles(pattern: String): Unit`<br>|
|[annotationsPath](annotationsPath/index.html)|&nbsp;&nbsp;`val annotationsPath: AnnotationsPathBuilder`<br>|
|[annotationsRoots0](annotationsRoots0.html)|&nbsp;&nbsp;`private val annotationsRoots0: ArrayList<String>`<br>|
|[classpath](classpath/index.html)|&nbsp;&nbsp;`val classpath: ClasspathBuilder`<br>|
|[classpathRoots0](classpathRoots0.html)|&nbsp;&nbsp;`private val classpathRoots0: ArrayList<String>`<br>|
|[getAnnotationsRoots](getAnnotationsRoots.html)|&nbsp;&nbsp;`open public fun getAnnotationsRoots(): List<String>`<br>|
|[getClasspathRoots](getClasspathRoots.html)|&nbsp;&nbsp;`open public fun getClasspathRoots(): List<String>`<br>|
|[getModuleName](getModuleName.html)|&nbsp;&nbsp;`open public fun getModuleName(): String`<br>|
|[getOutputDirectory](getOutputDirectory.html)|&nbsp;&nbsp;`open public fun getOutputDirectory(): String`<br>|
|[getSourceFiles](getSourceFiles.html)|&nbsp;&nbsp;`open public fun getSourceFiles(): List<String>`<br>|
|[name](name.html)|&nbsp;&nbsp;`val name: String`<br>|
|[outputDir](outputDir.html)|&nbsp;&nbsp;`val outputDir: String`<br>|
|[sourceFiles0](sourceFiles0.html)|&nbsp;&nbsp;`private val sourceFiles0: ArrayList<String>`<br>|
|[sources](sources/index.html)|&nbsp;&nbsp;`val sources: SourcesBuilder`<br>|
