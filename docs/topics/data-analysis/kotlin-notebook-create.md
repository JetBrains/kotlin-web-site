[//]: # (title: Create your first Kotlin notebook)

<microformat>
   <p>This is the second part of the <strong>Getting started with Kotlin notebooks</strong> tutorial. Before proceeding, make sure you've completed the previous step.</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">Set up an environment</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>Create a Kotlin notebook</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> Add dependencies to the Kotlin notebook<br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Share the Kotlin notebook<br/>
  </p>
</microformat>

Here you will learn how to create your first Kotlin notebook and run a single code cell. 

## Create an empty project

1. In IntelliJ IDEA, select **File | New | Project**.
2. In the panel on the left, select **New Project**. 
3. Name the new project and change its location if necessary.
4. From the **Language** list, select **Kotlin**.
5. Select the **IntelliJ** build system.
6. From the **JDK list**, select the [JDK](https://www.oracle.com/java/technologies/downloads/) that you want to use in your project.
6. Click **Create**.

## Create a Kotlin notebook

1. To create a new notebook, select **File | New | Kotlin Notebook**.
2. Set the name of the new notebook, for example, **first-notebook**, and press **Enter**.
   A new tab with a Kotlin notebook **first-notebook.ipynb** will open.
3. In the open tab, type the following code in the code cell:

   ```kotlin
   println("Hello, it's a Kotlin notebook!")
   ```
4. Press the ![Run Cell and Select Below](run-cell-and-select-below.png){width=30}{type="joined"} button or press **Shift** + **Return** to run the code cell. 

Congratulations! You have just created your first Kotlin notebook.

## Next step

In the next part of the tutorial, you will learn how to add dependencies to a Kotlin notebook.

**[Proceed to the next chapter](kotlin-notebook-add-dependencies.md)**
