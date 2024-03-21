[//]: # (title: Add dependencies to your Kotlin notebook)

<microformat>
   <p>This is the third part of the <strong>Getting started with Kotlin notebooks</strong> tutorial. Before proceeding, make sure you've completed the previous step.</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">Set up an environment</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create.md">Create a Kotlin notebook</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>Add dependencies to the Kotlin notebook</strong><br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Share the Kotlin notebook<br/>
  </p>
</microformat>

You've already created your first Kotlin notebook! Now let's learn how to add dependencies to libraries, which
is necessary to unlock advanced features.

> The Kotlin Standard Library can be used out of the box, so you don't have to import it.
> 
{type="note"}

## Add a dependency to your Kotlin notebook

Although you can load any library from the Maven repository by specifying its coordinates using Gradle-style 
syntax in any code cell, Kotlin Notebook has a simplified method to load popular libraries:

1. Click **Add Code Cell** to create a new code cell.
2. Type the following code in the code cell:

```kotlin
// Replace libraryName with the library dependency you want to add.
%use libraryName

// For example, if you want to add a dependency to the Kotlin DataFrame library, write: 
// %use dataframe
```

You can also use the autocompletion feature in Kotlin Notebook to quickly access available libraries.
![Autocompletion feature in Kotlin Notebook](autocompletion-feature-notebook.png){width=700}

3. Run the code cell.

And that's it! When the `%use` statement is executed, it downloads the library dependencies and also adds 
the default imports to your notebook.

> Make sure to run the code cell with the `%use libraryName` line before you run any other code cells that rely on the 
> library.
> 
{type="note"}

## Next step

In the next part of the tutorial, you will learn how to share a Kotlin notebook.

**[Proceed to the next chapter](kotlin-notebook-share.md)**
