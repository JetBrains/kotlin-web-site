[//]: # (title: Multiple round processing)

KSP supports multiple round processing, or processing files over multiple rounds. The output from each processing round 
is used as additional input in each subsequent round.

To use multiple-round processing, return deferred symbols from `SymbolProcessor.process()` as a `List<KSAnnotated>`. KSP 
processes these symbols in the next round.

To defer invalid symbols, filter them with `KSAnnotated.validate()`, as shown in the following example:

```kotlin
override fun process(resolver: Resolver): List<KSAnnotated> {
    val symbols = resolver.getSymbolsWithAnnotation("com.example.annotation.Builder")
    val result = symbols.filter { !it.validate() }
    symbols
        .filter { it is KSClassDeclaration && it.validate() }
        .map { it.accept(BuilderVisitor(), Unit) }
    return result
}
```

Multiple-round processing ends when an entire round generates no new files. If deferred symbols remain unprocessed, KSP
logs an error for each processor with remaining deferred symbols.

## Deferring symbols to the next round

Processors can defer symbols to a later round when additional information is required from other processors. A processor 
can continue deferring a symbol across multiple rounds until the required information becomes available. Once the 
information is available, the processor can process the symbol.

> Processors should only defer invalid symbols when necessary information is lacking.
> Processors should not defer symbols from classpath. KSP will also filter out any deferred
> symbols that are not from source code.
>
{style=”note”}

For example, a processor that generates a builder for an annotated class might require all constructor parameter types 
to resolve to concrete types. In the first round, one of the parameter types might not be resolvable. In a later round, 
it can become resolvable because of files generated in an earlier round. The processor can then process the class.

## Validating symbols

Validation is a convenient way to decide whether to defer a symbol to a later round. A processor should define the 
information required to process a symbol correctly.

> Validation often requires type resolution, which can be expensive. Check only the information required to process the symbol.
>
{style=”tip”}

Continuing the previous example, the builder processor might validate only the constructor parameter types of annotated 
classes. Specifically, it can check that each resolved parameter type has `isError == false`.

KSP validates all symbols that are directly reachable within the validated symbol's enclosing scope. By default, 
validation checks whether references in that scope resolve to concrete types. Validation does not recursively validate 
the referenced types.

> Default validation behavior might not be suitable for all use cases. To customize validation, use `KSValidateVisitor` 
> and provide a `predicate` lambda that selects the symbols to validate. `KSValidateVisitor` uses the `predicate` to 
> determine which symbols to check.
>
{style=”tip”}

## Files accessible at each round

Both newly generated files and existing files are accessible through a `Resolver`.

KSP provides two APIs for accessing files:

* `Resolver.getAllFiles()` returns a list of both previously existing and newly generated files.

* `Resolver.getNewFiles()` returns only the files that were generated in the previous round.

## `getSymbolsAnnotatedWith()`

Use `Resolver.getSymbolsAnnotatedWith()` as the primary entry point for obtaining relevant symbols.

In each round, `Resolver.getSymbolsAnnotatedWith()` returns only symbols from newly generated files and symbols deferred from 
the previous round. This helps avoid unnecessary reprocessing.

## Processor instantiation

KSP creates a processor instance only once. You can store information in the processor instance and reuse it across 
multiple rounds.

However, not all KSP symbols can be reused across rounds. Symbol resolution results can change when processors generate 
new files, which can affect the validity of previously resolved symbols.

## Error and exception handling

1. **Errors**

    A processor reports an error by calling `KSPLogger.error()`.

    When a processor reports an error, KSP calls `SymbolProcessor.onError()` instead of `SymbolProcessor.finish()`. 
    Processing stops after the current round completes.

    Other processors continue processing normally during that round. KSP handles errors only after all processors finish 
    the current round.

2. **Exceptions**

   KSP distinguishes between exceptions thrown by KSP and exceptions thrown by processors. Exceptions cause processing 
   to terminate immediately and are logged as an error through `KSPLogger`.

    > Report exceptions thrown by KSP to the KSP developers for investigation.
    >
    {style=”note”}

At the end of a round in which an error or exception occurs, KSP calls `SymbolProcessor.onError()` on all processors.
`SymbolProcessor` provides a default no-op implementation of `onError()`. Override this method to implement custom 
error-handling logic.