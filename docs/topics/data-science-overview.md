[//]: # (title: Kotlin for data analysis)

Exploring and analyzing data is something you may not do every day, but it's a crucial skill you need as a software developer. 

Let's think about some software development duties where data analysis is key: analyzing what's actually inside collections when debugging, 
digging into memory dumps or databases, or receiving JSON files with large amounts of data when working with REST APIs, to mention some.

With Kotlin's Exploratory Data Analysis (EDA) tools, such as [Kotlin notebooks](#notebooks), [Kotlin DataFrame](#kotlin-dataframe), and [Kandy](#kandy), you
have at your disposal a rich set of capabilities to enhance your analytics skills and support you across different scenarios:

* **Load, transform, and visualize data in various formats:** with our Kotlin EDA tools, you can perform tasks like filtering, sorting, and aggregating data. Our tools can seamlessly
read data right in the IDE from different file formats, including CSV, JSON, and TXT. 

    Kandy, our plotting tool, allows you to create a wide range of charts to visualize and gain insights from the dataset.

* **Efficiently analyze data stored in relational databases:** Kotlin DataFrame seamlessly integrates with databases and provides capabilities similar to SQL queries. 
You can retrieve, manipulate, and visualize data directly from various databases.

* **Fetch and analyze real-time and dynamic datasets from web APIs:** the EDA tools' flexibility allows integration with external APIs via protocols like OpenAPI. 
This feature helps you fetch data from web APIs, to then clean and transform the data to your needs.

Would you like to try our Kotlin tools for data analysis?

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook"/></a>

Our Kotlin data analysis tools let you smoothly handle your data from start to finish. Effortlessly 
retrieve your data with simple drag-and-drop functionality in our Kotlin Notebook. Clean, transform, and visualize it with just a few lines of code. 
Additionally, export your output charts in a matter of clicks.

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## Notebooks

_Notebooks_ are interactive editors that integrate code, graphics, and text in a single environment. When using a notebook, 
you can run code cells and immediately see the output. 

Kotlin offers different notebook solutions, such as [Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook), [Datalore](http://jetbrains.com/datalore), 
and [Jupyter Notebook](https://jupyter.org/), to provide convenient features for data retrieving, transformation, exploration, modeling, and more.
These Kotlin notebook solutions are based on our [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter).

You can benefit from the features of our powerful Kotlin notebooks and the perks of coding with Kotlin. Kotlin integrates with these notebooks 
to help you manage data and share your findings with colleagues while building up your data science and machine learning skills.

Discover the features of our different Kotlin notebook solutions and choose the one that best aligns with your project requirements. 

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook

The [Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) is a plugin for IntelliJ IDEA that allows you to create notebooks in Kotlin. It provides our IDE experience with all common IDE features,
offering real-time code insights and project integration.

### Kotlin notebooks in Datalore

With [Datalore](https://datalore.jetbrains.com/), you can use Kotlin in the browser straight out of the box without additional installation.
You can also collaborate with other Kotlin notebooks in real-time,
receive smart coding assistance as you write code, and share results through interactive or static reports.

### Jupyter Notebook with Kotlin Kernel

[Jupyter Notebook](https://jupyter.org/) is an open-source web application
that allows you to create and share documents containing code,
visualizations, and Markdown text. 
[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) is an open-source project that brings Kotlin 
support to Jupyter Notebook to harness Kotlin's power within the Jupyter environment.

## Kotlin DataFrame

The [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) library lets you manipulate structured data in your Kotlin projects. From data creation and
cleaning to in-depth analysis and feature engineering, this library has you covered.

With the Kotlin DataFrame library, you can work with different file formats, including CSV, JSON, XLS, and XLSX. This library also facilitates the data retrieval process
with its ability to connect with SQL databases or APIs.

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) is an open-source Kotlin library that provides a powerful and flexible DSL for plotting charts of various types.
This library is a simple, idiomatic, readable, and type-safe tool to visualize data.

Kandy has seamless integration with Kotlin Notebook, Datalore, and Jupyter Notebook. You can also easily combine the Kandy and 
Kotlin DataFrame libraries to complete different data-related tasks.

![Kandy](data-analysis-kandy-example.png){width=700}

## What's next

* [Get started with Kotlin Notebook.](get-started-with-kotlin-notebooks.md)
* [Retrieve and transform data using the Kotlin DataFrame library.](data-analysis-work-with-data-sources.md)
* [Visualize data using the Kandy library.](data-analysis-visualization.md)
* [Learn more about Kotlin and Java libraries for data analysis.](data-science-libraries.md)