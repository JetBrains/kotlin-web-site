[//]: # (title: Kotlin Notebook)

[Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) is a dynamic plugin for IntelliJ IDEA that 
provides an interactive environment to create and edit notebooks, leveraging the full potential of Kotlin's capabilities.

Get ready for a seamless coding experience where you can develop and experiment with Kotlin code, receive immediate outputs, and integrate code, 
visuals, and text within the IntelliJ IDEA ecosystem.

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

The Kotlin Notebook plugin comes with [various features](https://www.jetbrains.com/help/idea/kotlin-notebook.html) to boost your development process, such as: 

* Accessing APIs within cells
* Importing and exporting files with a few clicks
* Using REPL commands for a quick project exploration
* Getting a rich set of output formats
* Managing dependencies intuitively with annotations or Gradle-like syntax
* Importing various libraries with a single line of code or even adding new libraries to your project
* Getting insights for debugging with error messages and traceback

Kotlin Notebook is based on our [Kotlin Kernel for Jupyter Notebooks](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter), 
making it easy to integrate with other [Kotlin notebook solutions](https://kotlinlang.org/docs/data-analysis-overview.html#notebooks).
Without compatibility issues, you can effortlessly share your work among Kotlin Notebook,
[Datalore](https://datalore.jetbrains.com/), and [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter).

With these capabilities, you can embark on a wide range of tasks, from simple code experiments to comprehensive data projects. 

Dive deeper into the sections below to discover what you can achieve with Kotlin Notebook!

## Data analytics and visualization

Whether you're conducting preliminary data exploration or completing an end-to-end data analysis project, Kotlin Notebook has
the right tools for you.

Within Kotlin Notebook, you can intuitively integrate [libraries](data-analysis-libraries.md) that let you retrieve, transform, plot, and model your data 
while getting immediate outputs of your operations.

For analytics-related tasks, the [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) library 
provides robust solutions. This library facilitates loading, creating, filtering, and cleaning structured data.

Kotlin DataFrame also supports seamless connection with SQL databases and reads data right in the IDE from 
different file formats, including CSV, JSON, and TXT.

[Kandy](https://kotlin.github.io/kandy/welcome.html), an open-source Kotlin library, allows you to create charts of various types.
Kandy's idiomatic, readable, and type-safe features let you visualize data effectively and gain valuable insights.

![data-analytics-and-visualization](data-analysis-kandy-example.png){width=700}

## Prototyping

Kotlin Notebook provides an interactive environment for running code in small chunks and seeing the results in real-time. 
This hands-on approach enables rapid experimentation and iteration during the prototyping phase.

With the help of Kotlin Notebook, you can test the concepts of solutions early in the ideation stage. Additionally, Kotlin Notebook supports both 
collaborative and reproducible work, enabling the generation and assessment of new ideas.

![kotlin-notebook-prototyping](kotlin-notebook-prototyping.png){width=700}

## Backend development

Kotlin Notebook offers the ability to call APIs within cells and work with protocols like OpenAPI. Its capability to 
interact with external services and APIs makes it useful for certain backend development scenarios, such as 
retrieving information and reading JSON files directly within your notebook environment.

![kotlin-notebook-backend-development](kotlin-notebook-backend-development.png){width=700}

## Code documentation

In Kotlin Notebook, you can include inline comments and text annotations within code cells to provide additional context, 
explanations, and instructions relevant to the code snippets.

You can also write text in Markdown cells, which support rich formatting options such as headers, lists, links, images, and more. 
To render a Markdown cell and see the formatted text, simply run it as you would a code cell.

![kotlin-notebook-documenting](kotlin-notebook-documentation.png){width=700}

## Sharing code and outputs

Given Kotlin Notebook's adherence to the universal Jupyter format, it's possible to share your code and outputs across different notebooks.
You can open, edit, and run your Kotlin Notebook with any Jupyter client, such as [Jupyter Notebook](https://jupyter.org/) or [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/). 

You can also distribute your work by sharing the `.ipynb` notebook file with any notebook web viewer. One option is [GitHub](https://github.com/), 
which natively renders this format. Another option is [JetBrain's Datalore](https://datalore.jetbrains.com/) platform, 
which facilitates sharing, running, and editing notebooks with advanced features like scheduled notebook runs. 

![kotlin-notebook-sharing-datalore](kotlin-notebook-sharing-datalore.png){width=700}

## What's next

* [Learn about the Kotlin Notebook's usage and key features.](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
* [Try out Kotlin Notebook.](get-started-with-kotlin-notebooks.md)
* [Deep dive into Kotlin for data analysis.](data-analysis-overview.md)