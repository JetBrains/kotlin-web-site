[//]: # (title: Tips for improving IDE performance)
[//]: # (description: )

This article gives a summary of helpful actions and techniques that you can use to improve your IDE performance on large-scale projects.  

For your convenience, it’s split into two parts:
* Setting up an IDE
* Organizing you code

> Each of the tips does not guarantee improvement, as performance depends on many factors. Consider them rather as probabilities.
> 
{type="tip"}

## Setting up your IDE

1. Disable all unnecessary plugins
   Most likely, from the whole set of plugins that your IDE consists of, there are some ones that you don’t use. It may be pre-installed plugins, or ones that were installed manually, but no more needed. IDE plugins may consume resources, especially if they use IntelliJ platform API in a not optimal way.

2. Increase memory for IntelliJ IDEA
   See https://www.jetbrains.com/help/clion/performance-tuning-tips.html#increase_memory_heap

3. Enable Power Save Mode
   This mode reduces the set of Code Inspections that IDE automatically runs in background during code editing.

4. Disable on-the-fly import management
   The settings can be found at Preferences → Editor → General → Auto Import → Kotlin:
   Add unambiguous imports on the fly
   Optimize imports on the fly
   The first option substitutes the explicit context actions call (Alt+Enter) on an Unresolved reference if there is only one available import. The second performs import list optimization after all possible relevant actions, instead of one explicit Optimize imports action call. We intentionally extracted these options because any additional value that they bring may be offset by performance degradation.

5. Exclude folders and Unload modules
   You can reduce a scope that the IDE has to index and use for searching operations like Find Usages or Code Completion. You can consider excluding folders that contain generated files, logs, project documentation, etc. For unloading – modules that you don’t need and you’ll not use. You can find more details in the IntelliJ IDEA documentation.

## Organizing your project

These suggestions are not a call to action, but rather things to consider

1. Explicit type annotations for public methods
   Public methods and properties represent a so-called “public API,” which is a form of abstraction. Forcing API users to investigate the inner workings of public methods (or to guess the result type) is a sure way to break encapsulation and degrade code quality. Explicit type annotation makes public API well-marked and easy to use.
   What’s also important is that explicit result types can greatly improve code editing performance. Unlike the compiler, an IDE has to re-infer types on each code update. To optimize the workload, IntelliJ IDEA tries its best to cache and preserve as much type information as possible. However, as the result type of a method with omitted type annotation can change, even on “external” update, IntelliJ IDEA has to re-process the whole content of such a method on many kinds of file change. In addition to that, type annotations on public methods increase the speed of incremental compilation by minimizing the amount of recompiled code.

2. File size
   There’s no doubt that there are cases of long files when their structure is reasonable. At the same time, we know “code smells” like the “Long method” and “God class”. We also know about the Single-responsibility principle, etc.
   Kotlin spec. discusses it:
   Placing multiple declarations (classes, top-level functions, or properties) in the same Kotlin source file is encouraged as long as these declarations are closely related to each other semantically, and the file size remains reasonable (does not exceed a few hundred lines).
   This is very important in terms of IDE performance. File is one of the scopes that the IDE considers when re-analyzing after every code modification. Optimization in code analysis algorithms helps, but it does not save us from performance degradation as a result of increasing file size.

3. Compilation delegation to IntelliJ IDEA native builder
   If we think of how a project and its build process may be configured, we usually get the three following options:
   Both project and build configuration are related to a 3rd party build system (Maven, Gradle, Bazel …).
   When the project is opening, IDE imports project configuration from the build system.
   And this build system executes build tasks, using IDE only for reflecting progress and results of execution.
   Project and build are configured in a 3rd party build system, but this system delegates build execution to IntelliJ native builder.
   Project doesn’t use a 3rd party build system. It’s configured by IDE and IDE executes build tasks.

   The thing is that project build and IDE code analysis during reading/writing code have a set of similar/identical operations. IDE often needs to resolve references. Compiled classes contain that references resolved. With proper management, IDE could rely on .class files for obtaining information for code analysis. And this capability is implemented for cases, when project build is delegated or completely managed by IntelliJ native builder.

   TLDR: enabling build delegation to the IntelliJ native builder increases speed of IDE Code analysis. It’s especially noticeable in Search operations (e.g. Find Usages).

4. Keep different JVM languages in different modules
   To make Kotlin interoperable with Java in IDE, the compiler generates “Java-like” representation of Kotlin code, which is called LightClasses.
   Java “understands” them and code, from an IDE analysis perspective, becomes interconnected. But generating LightClasses takes costs.
   IOW, cross-language IDE operations are usually longer than equivalent operations within one language.

5. Unique names for references
   How does reference search work, in a nutshell:
   IDE does full-text search by given name in available scope
   Then IDE processes every match and decides if it’s valid
   The more unique name the reference has, the less list IDE has to process in step 2.

By saying that we understand that sometimes unique names are inappropriate.
So please, condired is not as a recommendation, but just as knowledge about IDE.
Sometimes, a more unique name looks better even from code readability perspective, especially in wide scopes. 






