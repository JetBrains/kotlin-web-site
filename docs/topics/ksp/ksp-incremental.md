[//]: # (title: Incremental processing)

<web-summary>Learn how incremental processing in KSP works and how it reduces build time.</web-summary>

KSP supports incremental processing. It reprocesses a file only when one or more of its dependencies change. This
reduces compilation time by avoiding unnecessary reprocessing.

Incremental processing is enabled by default. You can disable it when troubleshooting or to force a full
rebuild. To disable incremental processing, add the following line to the `gradle.properties` file:

```properties
ksp.incremental=false
```

## Dirty files

A _dirty_ file is a file that KSP needs to reprocess. A file becomes dirty if a developer modifies it directly or if
changes in other dirty files affect it indirectly.

To determine which sources are dirty, KSP relies on processors, which associate generated outputs with their
corresponding input sources. KSP uses these associations to identify the sources that must be reprocessed when a change
occurs.

KSP requires processors to declare only a minimal set of _root sources_. Processors use them as entry points to
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

Aggregating outputs can be affected by changes in any source file.
For example, an output that collects all symbols with a particular annotation.

Any input change, including a file removal, triggers a rebuild of all aggregating outputs and reprocessing of all corresponding registered, new,
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
  output also become dirty. This groups the related files into equivalence classes based on shared outputs.

KSP applies both rules repeatedly until no new dirty files appear. For example, a file that becomes dirty through
resolution tracing can make other files dirty through shared outputs. Those files can then make more files dirty
through resolution tracing.

## Implementation

Dependencies are determined by the many-to-many relationship between input and output files.

KSP uses the following rules to determine which files to reprocess:

* If an input file is changed, it's always reprocessed, because the change can introduce new information for processors.
* If a changed input file is associated with an output, KSP also reprocesses all other input files associated with
  the same output. This happens because processors may need all the inputs to regenerate the output.
  KSP repeats this until no new dirty files appear.
* Unless one of the previous rules applies, KSP doesn't reprocess an unchanged input file that isn't associated with
  any aggregating outputs. Such a file can't affect any outputs.

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

If `sourceA` is removed:
* If `outputB` is aggregating, KSP reprocesses `sourceB`.
* If `outputB` is isolating, KSP doesn't need to reprocess any files.

If `sourceB` is removed, KSP doesn't need to reprocess any files in either case, because `sourceB` was the only source
of `outputB`.

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
        val declA = resolver.getSymbolsWithAnnotation("Interesting")
            .firstOrNull() as? KSClassDeclaration
            // Returns early in later rounds, when no new annotated symbols are found
            ?: return emptyList()
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

To collect the log files and attach them to the issue:

1. Capture incremental processing logs by adding the following line to the `gradle.properties` file:

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

* Learn how a processor [declares the dependencies of its output](ksp-quickstart.md#create-and-register-a-processor).
* Learn how KSP [runs processors in multiple rounds](ksp-multi-round.md).
* Learn how [KSP models Kotlin code](ksp-kotlin-model.md) and when to resolve types.
* Learn how to [run KSP from the command line](ksp-command-line.md) without the KSP plugin for Gradle.
