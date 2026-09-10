[//]: # (title: FAQ for Kotlin backend development)

This page answers some common questions about building, testing, and shipping Kotlin backend applications with Maven.
Each answer has a link to a more detailed explanation in the Kotlin or external documentation.

## Multi-module builds, BOM, and version management

### How do I pin a single Kotlin version across a multi-module build?

Declare a single `kotlin.version` property in the parent POM file and reuse it everywhere:

* Set the `kotlin-maven-plugin` version once in your parent `pom.xml` file. To do so, set the Kotlin version in the
  `<properties>` section and reference it as `${kotlin.version}` in `<build><plugins>` or `<build><pluginManagement>` sections.
  For more information, see [Project configuration](mixing-java-kotlin-intellij.md#maven).
* Keep the Kotlin library versions aligned through the Kotlin BOM file so that `kotlin-stdlib`, `kotlin-reflect`,
  `kotlin-test`, and other artifacts always resolve to the same release and don't differ from module to module.
  For more information, see [Manage dependencies with a BOM](maven-set-dependencies.md#manage-dependencies-with-a-bom).

### What is the Kotlin BOM and how do I use it?

The Kotlin BOM (`org.jetbrains.kotlin:kotlin-bom`) is a special POM file that manages the versions of Kotlin libraries so that
related artifacts stay aligned to the same Kotlin release, even when they come in as transitive dependencies.

Import it in the `<dependencyManagement>` section of your `pom.xml` with `<type>pom</type>` and `<scope>import</scope>`.
You can then declare Kotlin dependencies without a `<version>`. The versions come from the BOM file automatically.

For more information, see [Manage dependencies with a BOM](maven-set-dependencies.md#manage-dependencies-with-a-bom).

### Do I need to keep the Kotlin Maven plugin version aligned with Kotlin library versions?

Yes. Mixing a compiler version with incompatible Kotlin libraries may lead to "Mixed Kotlin versions" failures and metadata
incompatibilities. The easiest way to stay consistent is to use the same Kotlin version defined once. For example:

* Set the [`kotlin-maven-plugin`](maven-kotlin-compiler.md) version once in your parent `pom.xml` file and then
  reference it as `${kotlin.version}` everywhere.
* Import the [Kotlin BOM](maven-set-dependencies.md#manage-dependencies-with-a-bom) so all Kotlin libraries follow the same
  release.

### How do I configure Kotlin compiler options across all modules?

To configure the Kotlin compiler across all Maven modules, set the options in one place in the parent `pom.xml` file
in one of the following ways:

* Set compiler options, such as `kotlin.compiler.languageVersion`, `kotlin.compiler.apiVersion`, and
  `kotlin.compiler.jvmTarget` in the parent `<properties>` section.
* Share a single `kotlin-maven-plugin` `<configuration>` (for example, additional `<args>`) in the parent `pom.xml` file,
  so that all modules compile with the same settings.

Module-specific overrides are possible but should be rare. For the full list of options and their property names, see
[Compiler options](maven-kotlin-compiler.md).

### Why do I get bytecode level mismatches in a multi-module build?

You may encounter the `UnsupportedClassVersionError` and similar errors that mean that bytecode was produced for a newer
JVM version than the one running your code. To avoid such issues, keep the following consistent across modules and CI:

* The JDK that runs Maven.
* The Java compiler target.
* The Kotlin `jvmTarget` option.

If you have the `<extensions>` option enabled in your project, the Kotlin and Java compilers target the same bytecode
version automatically. For more information on how the Kotlin Maven plugin resolves the JVM target version based on 
different options in the build file, see [JVM target version](maven-configure-project.md#jvm-target-version).

For a manual setup, use the `maven-toolchains-plugin` to configure a single toolchain that controls the JDK version across
all plugins in the build. For more information, see [Set JDK version](maven-configure-project.md#set-jdk-version).

## Testing: Surefire, Failsafe, and JUnit

### Why does `mvn test` skip Kotlin tests?

You may encounter the "Tests run: 0" error when trying to run the `mvn test` command. The most common causes are:

* **Test discovery**: Surefire runs tests that follow the `*Test` naming pattern. Integration tests named with the `*IT`
  suffix are run by the Failsafe plugin with the `mvn verify` command instead. For more information, see [Run tests](jvm-test-maven.md#run-tests).
* **Missing engine on the classpath**: add a JUnit test dependency so that JUnit can discover and run your tests.
  The easiest option is to use [`kotlin-test-junit5`](jvm-test-maven.md#junit-5-and-later), which pulls in the necessary JUnit
  artifacts. For more information, see [Dependencies on test libraries](maven-set-dependencies.md#dependencies-on-test-libraries).
* **Test sources aren't compiled**: ensure that the Kotlin `test-compile` execution runs so your Kotlin test sources are
  compiled before tests execute.

### How do I configure Surefire plugin to run JUnit tests?

To configure the Surefire plugin for running JUnit tests:

1. Add a JUnit test dependency such as [`kotlin-test-junit5`](jvm-test-maven.md#junit-5-and-later) with `<scope>test</scope>`
   to include JUnit on the test classpath.
2. Add the [Surefire plugin](jvm-test-maven.md#with-surefire-plugin) to your `pom.xml` file.
3. Check for conflicting test providers on the classpath, which cause "missing engine / wrong provider" errors.

For the full setup and a sample project, see [Test Kotlin projects with Maven](jvm-test-maven.md).

### How to upgrade a Maven Kotlin backend to JUnit 6?

Kotlin/JVM supports the latest stable JUnit versions, including JUnit 6.
For JUnit 6, keep the same [`kotlin-test-junit5`](jvm-test-maven.md#junit-5-and-later) dependency in your `pom.xml`.

When upgrading, ensure that:

* The baseline Java version required by the new JUnit release is set correctly.
* The versions of all JUnit-related dependencies are aligned.
* You don't have deprecated components in your test code.

For more information, see [Create tests with JUnit](jvm-test-maven.md#create-tests-with-junit).

### How do I split unit and integration tests?

Split execution between two plugins. For unit tests, use the [Surefire plugin](jvm-test-maven.md#with-surefire-plugin) during the `test` phase.
Use the `*Test` naming convention for your unit tests.

For integration tests, use the [Failsafe plugin](jvm-test-maven.md#with-failsafe-plugin) during the `integration-test`
and `verify` phases. Use the `*IT` naming convention for your integration tests.

Run `mvn test` for unit tests only, or `mvn verify` for both.

For more information, see [Test Kotlin projects with Maven](jvm-test-maven.md).

## Annotation processing: kapt and KSP

### When should I use kapt versus KSP in a Maven-based Kotlin backend?

Since KSP currently has official support only for Gradle, use [kapt](kapt.md) for all Maven projects.

If you'd like to use existing Java annotation processors in Kotlin Gradle projects, first check if [KSP already supports them](ksp-overview.md#supported-libraries).
For unsupported processors, use [kapt](kapt.md).

If you'd like to write your own annotation processors, use [KSP](ksp-quickstart.md#create-your-own-processor).

For more information, see [Annotation processors in Kotlin projects](jvm-annotation-processors.md).

### How do I configure kapt?

To configure kapt in your Kotlin Maven project, add an execution of the `kapt` goal from `kotlin-maven-plugin` **before**
the `compile` execution and list the annotation processors explicitly under `<annotationProcessorPaths>`. This ensures
that the generated sources are produced before the code that references them is compiled.

For more information, see [Set up kapt in Maven](kapt.md#set-up-in-maven) and an example of using [kapt with MapStruct](jvm-annotation-processors.md#use-kapt-with-java-annotation-processors).

### Why does kapt fail on newer JDKs?

You may encounter "IllegalAccessError" or "InaccessibleObjectException" errors when using modern JDKs in your Kotlin
projects with kapt integration. This can be caused by strong encapsulation of internal packages, which kapt needs to
access for annotation processing.

You can fix this by updating Kotlin to the latest version and adding the required `--add-opens` arguments to the JVM that
runs Maven. For example, through a repository-level `.mvn/jvm.config` file, so every developer and CI runner uses the same settings.

For more information on kapt configuration, see [kapt compiler plugin](kapt.md).

### Where does kapt generate sources and how to fix their IDE imports?

kapt generates sources in the module's `target/` directory and adds them as source roots so that they're compiled as
part of the build.

If you see "red" imports in your IDE, reimport your Kotlin Maven project so that the IDE can 
pick up directories for the generated sources.

For more information on kapt configuration, see [kapt compiler plugin](kapt.md).

### Can I use KSP with Maven?

KSP has no official support for Maven. You can try community Maven plugins for KSP, but they come with their own support
and maintenance processes.

Another option for Maven is to run KSP through its [command-line](ksp-command-line.md) entry point in a
build phase.

For more information on Kotlin annotation processors, see [Use annotation processors in Kotlin projects](jvm-annotation-processors.md).

### How do I wire KSP code generation into the Maven lifecycle?

To wire KSP code generation into the Maven lifecycle, run KSP during an early phase, such as `generate-sources`, and
output the generated code into a stable directory. Then add that directory to the compile source roots and ensure
generation runs **before** Kotlin compilation.

For more information, see [Running KSP from the command line](ksp-command-line.md).

## Quality gates: formatting and coverage

### How do I enforce Kotlin formatting checks?

Bind a ktlint `check` goal to the `verify` phase in your `pom.xml` build file, so CI fails if formating rules are violated.
Keep `format` as an explicit developer action. You can adjust formatting rules in the `.editorconfig` file.

For more information, see [Code formatting with ktlint](jvm-code-analysis.md#code-formatting-with-ktlint).
You can also add static analysis with [detekt](jvm-code-analysis.md#code-analysis-with-detekt) to your project's quality gates.

### Why do Kotlin linters or formatters fail on Java 17+?

You may encounter module access errors when using Kotlin linters or formatters with Java 17 and later versions.

These tools run inside the Maven JVM, so on newer JDKs they may need extra `--add-opens` arguments. Put those arguments in
a repository-level `.mvn/jvm.config` file so the same settings are checked into the repo and used both locally and in CI.

### Which code coverage tools are recommended?

[Kover](https://github.com/Kotlin/kotlinx-kover) is the official JetBrains coverage tool for Kotlin. It understands
Kotlin-specific constructs and provides a Maven plugin with built-in verification rules, so it's the recommended choice for
Kotlin-first projects.

Another option is to use [JaCoCo](https://github.com/jacoco/jacoco) if you already have an established Java coverage 
pipeline and reporting around it.

For more information, see [Code coverage with Kover](jvm-code-analysis.md#code-coverage-with-kover).

### How do I generate an aggregated coverage report for a multi-module project?

To generate a coverage report for all modules in your Maven project, collect coverage data from every module
and aggregate it in a dedicated reporting module that depends on the others. This way,
aggregation runs after the individual modules have produced their execution data. You can use
the [`kover-maven-plugin`](https://kotlin.github.io/kotlinx-kover/maven-plugin/) for implementing this workflow.

For more information, see [Code coverage with Kover](jvm-code-analysis.md#code-coverage-with-kover).

## Building applications: packaging and runtime

### How do I build a runnable JAR and set the entry point?

To build a runnable JAR, you need to set the `Main-Class` entry point. It should be the name of the JVM class compiled
from the Kotlin file with a top-level `main()` function. For example, the `main()` function in the `Main.kt` file
is compiled to the `MainKt` class.

Set that class name as `Main-Class` entry point through the `maven-jar-plugin` manifest configuration.

For more information, see [Create JAR files](maven-compile-package.md#create-jar-files).

### Why does the packaged application fail with main class errors?

You may encounter "Could not find or load main class" errors when building the application, especially in containers.
To debug the problem, work through this checklist:

* Check that the `Main-Class` in the manifest points to the [correct compiled class](#how-do-i-build-a-runnable-jar-and-set-the-entry-point).
* Ensure that you're running the right artifact: a thin [JAR](maven-compile-package.md#create-jar-files) requires its
  dependencies on the classpath, while a [self-contained JAR](maven-compile-package.md#create-self-contained-jar-files) bundles them.
* Check if the container entry point uses the correct `java -jar` command and classpath.

### How do I build a fat JAR together with Kotlin runtime classes?

To build a fat (uber) JAR and avoid missing Kotlin runtime classes, build a self-contained JAR that bundles your
dependencies and ensures the Kotlin standard library is on the runtime classpath. Because the fat JAR includes dependencies,
having [`kotlin-stdlib`](maven-set-dependencies.md#dependency-on-the-standard-library) as a declared dependency ensures
the Kotlin runtime is packaged.

For more information, see [Create self-contained JAR files](maven-compile-package.md#create-self-contained-jar-files).

### Where should JVM arguments be?

Keep JVM arguments for the Maven build process, test JVMs, and runtime in three separate buckets:

* **Maven build JVM**: put shared arguments in a repository-level `.mvn/jvm.config` file.
* **Test JVMs**: place them in the [Surefire](jvm-test-maven.md#with-surefire-plugin) and
  [Failsafe](jvm-test-maven.md#with-failsafe-plugin) plugin configurations sections.
* **Runtime**: set them in the container command or deployment configuration that launches the
  [packaged application](maven-compile-package.md).

## Publishing libraries: sources and signing

### What are the requirements to publish to Maven Central?

To publish a Kotlin library to [Maven Central](https://central.sonatype.com/), at a minimum you need:

* The main artifact plus a [source JAR](#how-do-i-attach-and-deploy-a-source-jar)
* Documentation (Javadoc) JAR
* [GPG signatures for every artifact](#how-do-i-sign-artifacts-for-maven-central-in-a-ci-friendly-way)
* Complete POM metadata, including name, description, license, developers, and SCM information.

Remember that Maven Central releases are immutable: once a version is published, it can't be replaced.

For more information on generating the documentation JAR, see the [Dokka documentation engine](dokka-maven.md).

### How do I attach and deploy a source JAR?

To attach and deploy a source JAR for a Maven-based Kotlin library, bind the [`maven-source-plugin`](https://maven.apache.org/plugins/maven-source-plugin/)
to the build lifecycle so that the source artifact is attached automatically and deployed together with the main artifact.

If your project publishes several libraries released together, consider providing your own [BOM](maven-set-dependencies.md#manage-dependencies-with-a-bom)
file so that consumers can align versions the same way you align Kotlin artifacts.

### How do I sign artifacts for Maven Central in a CI-friendly way?

To configure Maven Central artifacts in a CI-friendly way, we recommend to:

* Use the [`maven-gpg-plugin`](https://maven.apache.org/plugins/maven-gpg-plugin/) to sign all the project's attached artifacts.
* Supply the key material and passphrase through CI secrets or environment variables rather than committing them.
* Ensure signing runs before the deploy step so every published artifact, including the sources and Javadoc JARs, is signed.

## Troubleshooting

### How to fix the plugin failure on JDK 17?

You may encounter the Kotlin Maven plugin failures on JDK 17 with a recommendation to add `--add-opens` arguments to
the JVM that runs Maven.

To fix this on the project level, put the required JVM arguments in a repository-level `.mvn/jvm.config` file so that
every developer and CI runner uses the same settings and keep your [Kotlin version](maven-kotlin-compiler.md) up to date.
This keeps local and CI behavior consistent.

### Why do I get mismatch errors for Kotlin or API versions?

You may encounter "API version X is no longer supported" or "module was compiled with an incompatible version of Kotlin"
errors. They indicate a mismatch between the Kotlin compiler and the Kotlin libraries on the classpath. To fix it:

* Align the version used by the compiler and all Kotlin libraries. Declare the Kotlin version once in the `<properties>` section
  and reference it with `${kotlin.version}` and use the [Kotlin BOM](maven-set-dependencies.md#manage-dependencies-with-a-bom) file.
* Remove older transitive Kotlin artifacts that use in an incompatible version.
* Check [`languageVersion` and `apiVersion`](maven-kotlin-compiler.md#attributes-specific-to-jvm) against the Kotlin
  version you want to target.