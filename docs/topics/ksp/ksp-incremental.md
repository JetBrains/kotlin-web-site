[//]: # (title: Incremental processing)

KSP uses incremental processing. This means KSP reprocesses files only when one or more of the file’s dependencies have 
been changed. The goal of incremental processing is to reduce repeated compilation time.

Incremental processing is enabled by default. To disable it, add the following Gradle property to your 
`gradle.properties` file:

```
ksp.incremental=false
```

> For general information, see Wikipedia's article on [incremental computing](https://en.wikipedia.org/wiki/Incremental_computing).
>
{style=”tip”}

## Dirty files

A source that requires reprocessing is considered dirty. To determine which sources are dirty, KSP relies on processors 
to associate generated outputs with their corresponding input sources. KSP uses these associations to identify the 
sources that must be reprocessed when changes occur.

KSP requires only a minimal set of root sources. Processors use these sources as entry points to navigate the code structure.

When a processor generates an output, it must associate that output with the sources of the corresponding `KSNode`. This 
association is required if the `KSNode` is obtained from any of the following methods:

* `Resolver.getAllFiles()`
* `Resolver.getSymbolsWithAnnotation()`
* `Resolver.getClassDeclarationByName()`
* `Resolver.getDeclarationsFromPackage()`


## Aggregating and isolating outputs

KSP classifies generated outputs into two types: aggregating and isolating.

| **Output type**   | **Description**                                                                                   | **Behavior**                                                                                                                                   | **Example**                                                       |
|-------------------|---------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| Aggregating       | Can be affected by changes in any source file, except for removals that do not impact other files | Any input change triggers a rebuild of all aggregating outputs and reprocessing of all corresponding registered, new, or modified source files | An output that collects all symbols with a particular annotation  |
| Isolating         | Depends only on its specified sources                                                             | Changes to other sources do not affect the output. Multiple source files can be associated with a single output                                | A generated class that is dedicated to an interface it implements |

> Unlike Gradle annotation processing, KSP applies the categorization to individual outputs
> rather than entire processors.
>
{style=”note”}

## Implementation

Dependencies are determined by the many-to-many relationship between input and output files.

This is how KSP determines which files need to be reprocessed:

* If an input file is changed, it will always be reprocessed.

    **Why?** If an input is changed, new information can be introduced. Processors need to run again with the input.

* If an input file is changed and is associated with an output, then all other input files associated with the same 
output will also be reprocessed. This happens repeatedly until there is no new dirty file.

    **Why?** An output is made out of a set of inputs. Processors may need all the inputs to regenerate the output.

* If an unchanged input file isn't associated with any aggregating outputs, it won't be reprocessed.

    **Why?** If an output file is categorized as isolating, the processor is sure that the information comes from a 
specific set of input files. If those files don’t change, neither will the output file.

## Dirtiness propagation

A file is considered dirty if it is either directly modified by the user or indirectly affected by changes in other dirty files.
KSP propagates dirtiness in two steps:

* Propagation by **resolution tracing**: Type resolution is the only way to traverse from one file to another. When a 
processor resolves a type reference (explicitly or implicitly), KSP considers dependencies between the file containing 
the reference and any file that defines a symbol affecting that resolution. As a result, a change in a resolved symbol 
may mark the referencing file as dirty.

* Propagation by **input-output correspondence**: If a source file is changed or affected, all other source files that 
share generated outputs with it are also marked as affected. This groups related files into equivalence classes based on 
shared outputs.

Note that both of these steps will be repeated until there are no dirty files.

## Example 1

A processor generates `outputForA` after reading class A in `A.kt` and class B in `B.kt`, where A extends B.

The processor gets A by `Resolver.getSymbolsWithAnnotation` and B by `KSClassDeclaration.superTypes` from A.

Because the inclusion of B is due to A, `B.kt` doesn't need to be specified in dependencies for `outputForA`. You can 
still specify `B.kt` in this case, but it is unnecessary.

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

## Example 2

A processor generates `outputA` after reading `sourceA` and `outputB` after reading `sourceB`.

When `sourceA` is changed:

* If outputB is aggregating, both sourceA and sourceB are reprocessed.

* If outputB is isolating, only sourceA is reprocessed.

When `sourceC` is added:

* If `outputB` is aggregating, both `sourceC` and `sourceB` are reprocessed.
* If `outputB` is isolating, only `sourceC` is reprocessed.

When either `sourceA` or `sourceB` is removed, nothing needs to be reprocessed.


## Reporting bugs

If you encounter any error that only occurs in incremental mode, report it by creating an issue in GitHub. Follow the 
following steps to retrieve the relevant logs:

1. Enable logs that dump the dirty set according to dependencies and outputs. To do this, add this line to 
`gradle.properties`: 

    ```
    ksp.incremental.log=true
    ```

2. Perform a clean build. This build produces two log files in the build output directory with a `.log` file extension:

    * `build/kspCaches/<source set>/logs/kspDirtySet.log`
    * `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

    You can then run successive incremental builds, which will generate two additional log files:

    * `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
    * `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

   These logs contain file names of sources and outputs, plus the timestamps of the builds.
