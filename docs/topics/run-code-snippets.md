[//]: # (title: Run code in IDE scratches and worksheets)

IntelliJ IDEA and Android Studio support Kotlin [scratch files and worksheets](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32).

* _Scratch files_ (or just _scratches_) let you create code drafts in the same IDE window as your project and run them on the fly.
  Scratches are not tied to projects; you can access and run all your scratches from any IntelliJ IDEA window on your OS.

  To create a Kotlin scratch, click **File** | **New** | **Scratch File** and select the **Kotlin** type.

* _Worksheets_ are project files: they are stored in project directories and tied to the project modules.
  Worksheets are useful for writing pieces of code that don't actually make a software unit but should still be stored together
  in a project, such as educational or demo materials.

  To create a Kotlin worksheet in a project directory, right-click the directory in the project tree and select
  **New** | **Kotlin Script** | **Kotlin Worksheet**.

Syntax highlighting, auto-completion, and other
IntelliJ IDEA code editing features are supported in scratches and worksheets. There's no need to declare the `main()` function 
– all the code you write is executed as if it were in the body of `main()`.

Once you have finished writing your code in a scratch or a worksheet, click **Run**.
The execution results will appear in the lines opposite your code.

![Run scratch](scratch-run.png){width=700}

## Interactive mode

The IDE can run code from scratches and worksheets automatically. To get execution results as soon as you stop
typing, switch on **Interactive mode**.

![Scratch interactive mode](scratch-interactive.png){width=700}

## Use modules

You can use classes or functions from a Kotlin project in your scratches and worksheets.

Worksheets automatically have access to classes and functions from the module where they reside.

To use classes or functions from a project in a scratch, import them into the scratch file with the
`import` statement, as usual. Then write your code and run it with the appropriate module selected in the **Use classpath of module** list.

Both scratches and worksheets use the compiled versions of connected modules. So, if you modify a module's source files,
the changes will propagate to scratches and worksheets when you rebuild the module.
To rebuild the module automatically before each run of a scratch or a worksheet, select **Make module before Run**.

![Scratch select module](scratch-select-module.png){width=700}

## Run as REPL 

To evaluate each particular expression in a scratch or a worksheet, run it with **Use REPL** selected. The code lines
will run sequentially, providing the results of each call.
You can later use the results in the same file by reffering to their auto-generated `res*` names (they are shown in the corresponding lines).

![Scratch REPL](scratch-repl.png){width=700}