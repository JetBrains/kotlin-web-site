[//]: # (title: Incremental processing)

<web-summary>Learn how KSP incremental processing decides which files to reprocess and how processors declare aggregating 
and isolating outputs.</web-summary>

Kotlin Symbol Processing (KSP) supports incremental processing: KSP reprocesses a file only when one or more of its
dependencies change. This reduces compilation time by avoiding unnecessary reprocessing.

Incremental processing is enabled by default. You can disable it when troubleshooting or when you need to force a full
rebuild. To disable incremental processing, add the following line to the `gradle.properties` file:

```properties
ksp.incremental=false
```

## Dirty files

A file is considered _dirty_ (needing to be reprocessed) if it is either directly modified by a developer or indirectly
affected by changes in other dirty files.

To determine which sources are dirty, KSP relies on processors, which associate generated outputs with their
corresponding input sources. KSP uses these associations to identify the sources that must be reprocessed when a change
occurs.

KSP requires processors to declare only a minimal set of _root sources_. Processors use root sources as entry points to
navigate the code structure.

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
> see [`CodeGenerator.kt` in the KSP source code](https://github.com/google/ksp/blob/main/api/src/main/kotlin/com/google/devtools/ksp/processing/CodeGenerator.kt).
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

Aggregating outputs can be affected by changes in any source file, except for removals that don't impact other files.
For example, an output that collects all symbols with a particular annotation is aggregating.

Any input change triggers a rebuild of all aggregating outputs and reprocessing of all corresponding registered, new,
or modified source files.

</def>
<def title="Isolating">

Isolating outputs depend only on their specified sources. For example, a class generated to implement a specific
interface is isolating.

Changes to sources other than the explicitly specified ones don't affect the output. Multiple source files can be
associated with a single output.

</def>
</deflist>

### Dirtiness propagation

When a file becomes dirty, KSP propagates dirtiness in the following ways:

* **Resolution tracing**: when a processor resolves a type reference, KSP records a dependency between the file
  that contains the reference and every file that can affect the result. If any of those files changes, the file
  with the reference becomes dirty. This applies to both explicit and implicit type resolution.

  Processors can only move from one file to another by resolving types, so these are the only cross-file dependencies
  that KSP needs to track.

* **Shared outputs**: if a dirty file contributes to a generated output, all other files that contribute to the same
  output also become dirty. This groups related files into equivalence classes based on shared outputs.

> KSP applies both rules repeatedly until no new dirty files appear. For example, a file that becomes dirty
> through resolution tracing can make other files dirty through shared outputs. Those files can then make more files
> dirty through resolution tracing.
>
{style="note"}

## Implementation

Dependencies are determined by the many-to-many relationship between input and output files.

This is how KSP determines which files need to be reprocessed:

* If an input file is changed, it is always reprocessed.

  **Why?** If an input is changed, new information can be introduced. Processors need to run again with the input.

* If an input file is changed and is associated with an output, then all other input files associated with the same
  output are also reprocessed. This happens repeatedly until no new dirty files appear.

  **Why?** An output is generated from a set of inputs. Processors may need all the inputs to regenerate the output.

* If an unchanged input file isn't associated with any aggregating outputs, it isn't reprocessed.

  **Why?** This file can't affect any outputs because it is unchanged and isn't associated with an aggregating output.
  It isn't reprocessed unless one of the above rules applies.

For example, consider a project with the following structure, where `sourceA` and `sourceB` are independent of each 
other, and `outputA` is isolating:

```text
.
├── src
│   ├── sourceA.kt
│   └── sourceB.kt
└── generated
    ├── outputA
    └── outputB
```

A processor:

* Reads `sourceA` and generates `outputA`. 
* Reads `sourceB` and generates `outputB`.

If `sourceA` changes:
* If `outputB` is aggregating, KSP reprocesses both `sourceA` and `sourceB`.
* If `outputB` is isolating, KSP reprocesses only `sourceA`.

If `sourceC` is added:
* If `outputB` is aggregating, KSP reprocesses `sourceC` and `sourceB`.
* If `outputB` is isolating, KSP reprocesses only `sourceC`.

If either `sourceA` or `sourceB` is removed, KSP doesn't need to reprocess any files, because neither source 
contributes to the other's output.

## Example processor

The following project contains classes `A` and `B`, where `A` extends `B`:

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor(private val codeGenerator: CodeGenerator) : SymbolProcessor {
    override fun process(resolver: Resolver): List<KSAnnotated> {
        // Returns early in later rounds, when no new annotated symbols are found
        val declA = resolver.getSymbolsWithAnnotation("Interesting")
            .firstOrNull() as? KSClassDeclaration ?: return emptyList()
        val declB = declA.superTypes.first().resolve().declaration
        // B.kt isn't required, because it can be deduced as a dependency by KSP
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA depends on A.kt and B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB\n".toByteArray())
        output.close()
        return emptyList()
    }
    // ...
}
```

To generate `outputForA`, the processor:

1. Gets `A` by calling `Resolver.getSymbolsWithAnnotation()`.
2. Gets `B` by resolving the supertype reference from `A`'s `superTypes`.

KSP tracks this relationship through resolution tracing and automatically records `B` as a dependency of `A`. Therefore,
you don't need to explicitly declare `B.kt` as a dependency of `outputForA`.

## Reporting bugs

If you encounter any error that occurs only when incremental processing is enabled, create an issue in
the [KSP GitHub repository](https://github.com/google/ksp/issues) and attach the relevant log files.

1. To capture incremental processing logs, add the following line to the `gradle.properties` file:

   ```properties
   ksp.incremental.log=true
   ```

2. Perform a clean build that completes successfully.
3. Copy the generated log files to another location to save them:

   * `build/kspCaches/<source set>/logs/kspDirtySet.log`
   * `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

4. Modify a source file that triggers the issue and run the build again.
5. Attach the log files from both the successful build and the build that reproduces the issue to the GitHub issue.

### Visualizing the symbol dependency graph

To help debug incremental processing, KSP can generate a Graphviz DOT file that visualizes the symbol dependency graph
starting from a specified symbol.

Enable incremental logging and specify the [fully qualified name](packages.md#package-headers)
of the symbol to use as the starting point for visualizing the graph:

```properties
ksp.incremental.log=true
ksp.incremental.log.graph.origin=<fully-qualified-name>
```

If you're using KSP from the command line, add the following options:

```bash
-incremental-log=true -incremental-log-graph-origin=<fully-qualified-name>
```

KSP writes the graph to the `kspLookupGraphOrigin.dot` file in the same `logs` directory as the other incremental
processing logs.

## See also

* [How a processor declares the dependencies of its output](ksp-quickstart.md#create-and-register-a-processor)
* [Multiple-round processing](ksp-multi-round.md)
* [How KSP models Kotlin code](ksp-kotlin-model.md)
* [Running KSP from the command line](ksp-command-line.md)
