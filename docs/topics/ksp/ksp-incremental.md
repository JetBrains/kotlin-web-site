[//]: # (title: Incremental processing)

KSP supports incremental processing: KSP reprocesses a file only when one or more of its dependencies change. This
avoids unnecessary reprocessing and therefore reduces compilation time.

Incremental processing is enabled by default. You can disable it when troubleshooting or when you need to force a full 
rebuild. To disable it, add the following line to your `gradle.properties` file:

```properties
ksp.incremental=false
```

## Dirty files

A file is considered _dirty_ (needing to be reprocessed) if it is either directly modified by a developer or indirectly 
affected by changes in other dirty files.

To determine which sources are dirty, KSP relies on processors, which associate generated outputs with their
corresponding input sources. KSP uses these associations to identify the sources that must be reprocessed when a change
occurs.

KSP requires only a minimal set of root sources. Processors use these sources as entry points to navigate the code structure.

A root source is a source file whose symbols are obtained directly from any of the following methods:

* `Resolver.getAllFiles()`
* `Resolver.getSymbolsWithAnnotation()`
* `Resolver.getClassDeclarationByName()`
* `Resolver.getDeclarationsFromPackage()`

A processor can obtain additional symbols from other source files by resolving information from a root source. KSP 
automatically tracks these dependencies.

When generating an output, the processor must declare the root sources that contribute to that output. KSP uses those 
root sources and their tracked dependencies to determine when the output needs to be regenerated.

> Use the `CodeGenerator` interface to create output files and associate inputs with outputs. For more information, 
> see [`CodeGenerator.kt` in the source code](https://github.com/google/ksp/blob/main/api/src/main/kotlin/com/google/devtools/ksp/processing/CodeGenerator.kt).
>
{style="tip"}

### Aggregating and isolating outputs

KSP classifies generated outputs into two types: aggregating and isolating.

> Unlike Gradle annotation processing, KSP applies the categorization to individual outputs
> rather than entire processors.
>
{style="note"}

<deflist collapsible="true">
<def title="Aggregating">

Aggregating outputs can be affected by changes in any source file, except for removals that do not impact other files.

Any input change triggers a rebuild of all aggregating outputs and reprocessing of all corresponding registered, new,
or modified source files.

For example, an output that collects all symbols with a particular annotation is aggregating.

</def>
<def title="Isolating">

Isolating outputs depend only on their specified sources.

Changes to other sources do not affect the output. Multiple source files can be associated with a single output.

For example, a generated class that is dedicated to an interface it implements is isolating.

</def>
</deflist>

### Dirtiness propagation

KSP propagates dirtiness in the following ways:

1. By **resolution tracing**: Type resolution is the only way to traverse from one file to another. When a
   processor resolves a type reference (explicitly or implicitly), KSP considers dependencies between the file containing
   the reference and any file that defines a symbol affecting that resolution. As a result, a change in a resolved symbol
   may mark the referencing file as dirty.

2. By **input-output correspondence**: If a source file is changed or affected, all other source files that
   share generated outputs with it are also marked as affected. This groups related files into equivalence classes based on
   shared outputs.

> Rules (1) and (2) can trigger each other repeatedly. For example, rule (1)
> can trigger rule (2), which can then trigger rule (1) again.
>
{style="tip"}

## Implementation

Dependencies are determined by the many-to-many relationship between input and output files.

This is how KSP determines which files need to be reprocessed:

* If an input file is changed, it will always be reprocessed.

   **Why?** If an input is changed, new information can be introduced. Processors need to run again with the input.

* If an input file is changed and is associated with an output, then all other input files associated with the same
  output will also be reprocessed. This happens repeatedly until there is no new dirty file.

   **Why?** An output is made out of a set of inputs. Processors may need all the inputs to regenerate the output.

* If an unchanged input file isn't associated with any aggregating outputs, it won't be reprocessed.

   **Why?** This file can't affect any outputs because it is unchanged and isn't associated with an aggregating output.
It won't be reprocessed unless one of the above rules applies.

For example, consider a project with the following structure:

```none
.
├── src
│   ├── sourceA.kt
│   └── sourceB.kt
└── generated
   ├── outputA
   └── outputB
```

A processor:

1. reads `sourceA`.

2. generates `outputA`.

3. reads `sourceB`.

4. generates `outputB`.

When `sourceA` changes:

* If `outputB` is aggregating, KSP reprocesses both `sourceA` and `sourceB`.

* If `outputB` is isolating, KSP reprocesses `sourceA` only.

If `sourceC` is added:

* If `outputB` is aggregating, KSP reprocesses `sourceC` and `sourceB`.

* If `outputB` is isolating, KSP reprocesses only `sourceC`.

If either `sourceA` or `sourceB` is removed, KSP doesn't need to reprocess any files.

## Example processor

The following project contains classes `A` and `B`, where `A` extends `B`:

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor : SymbolProcessor {
   override fun process(resolver: Resolver) {
       val declA = resolver.getSymbolsWithAnnotation("Interesting").first() as KSClassDeclaration
       val declB = declA.superTypes.first().resolve().declaration
       // B.kt isn't required, because it can be deduced as a dependency by KSP
       val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
       // outputForA.kt
       val outputName = "outputFor${declA.simpleName.asString()}"
       // outputForA depends on A.kt and B.kt
       val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
       output.write("// $declA : $declB\n".toByteArray())
       output.close()
   }
   // ...
}
```

To generate `outputForA`, the processor:

1. gets A by calling `Resolver.getSymbolsWithAnnotation`.

2. gets B by calling `KSClassDeclaration.superTypes` on A.

KSP tracks this relationship through resolution tracing and automatically records `B` as a dependency of `A`. Therefore,
you don't need to explicitly declare `B.kt` as a dependency of `outputForA`.


## Reporting bugs

If you encounter any error that occurs only when incremental processing is enabled, create an issue in
[the GitHub repository](https://github.com/google/ksp/issues) and attach the relevant log files.

1. Enable incremental processing logs by adding the following line to `gradle.properties`:

   ```properties
   ksp.incremental.log=true
   ```

2. Perform a clean build that completes successfully.

3. Save the generated log files by copying them to another location:

   * `build/kspCaches/<source set>/logs/kspDirtySet.log`
   * `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

4. Modify a source file that triggers the issue and run the build again.

5. Attach the log files from both the successful build and the build that reproduces the issue to the GitHub issue.

### Visualizing the symbol dependency graph

To help debug incremental processing, KSP can generate a Graphviz DOT file that visualizes the symbol dependency graph
explored from a specified symbol.

Enable incremental logging and specify the [fully qualified name](https://kotlinlang.org/docs/packages.html#package-headers) 
of the symbol to visualize:

```properties
ksp.incremental.log=true
ksp.incremental.log.graph.origin=<fully-qualified-name>
```

If you're using KSP from the command line, add the following options:

```bash
-incremental-log=true -incremental-log.graph.origin=<fully-qualified-name>
```

The DOT file is generated in the `logs` directory.
