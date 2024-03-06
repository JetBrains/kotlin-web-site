[//]: # (title: Kotlin for data analysis)

Data analysis isn’t something that software developers do every day.
However, exploring and analyzing data is something that needs to be done often. 
For example, analyze what’s actually inside collections when debugging, dig into memory dumps or databases, 
work with REST APIs, and receive JSON files with data in them.

Exploratory Data Analysis (EDA) tools, such as Kandy and DataFrame, offer you a rich set of capabilities to help you with the following scenarios:

1. Load, clean, and transform data stored in various file formats, including CSV, JSON, TXT, right in the IDE.

    With our EDA tools, you can perform tasks like filtering the data, sorting, aggregating, and visualizing it. 
    Kandy, our plotting tool, allows you to create a wide range of charts to gain insights into the dataset.

2. Efficiently analyze data stored in relational databases.

    DataFrame seamlessly integrates with databases and provides capabilities similar to SQL queries. 
    You can retrieve, manipulate, and visualize data directly from databases.

3. Fetch and analyze real-time and dynamic datasets from web APIs.

    The EDA tools’ flexibility allows integration with external APIs via OpenAPI and other protocols.
    This helps you with fetching data from web APIs, cleaning, and transforming it, and creating visualizations.

<!-- VIDEO -->

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="700" alt="Get started with Kotlin Notebook"/></a>

## Notebooks

_Notebooks_ are interactive editors. Notebooks such as [Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
[Datalore](http://jetbrains.com/datalore)and [Jupyter Notebook](https://jupyter.org/), 
provide convenient tools for data visualization and exploratory research.

Kotlin integrates with these tools to help you explore data, share your findings with 
colleagues, or build up your data science and machine learning skills.

### Kotlin Notebook

The [Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) is a plugin for IntelliJ IDEA that
allows you to create notebooks in Kotlin. It leverages the [Kotlin kernel](#jupyter-notebooks-with-kotlin-kernel) for executing the
cells and harnesses the powerful Kotlin IDE support to offer real-time code insights. Kotlin Notebook is the preferred method
for working with Kotlin notebooks.

![Kotlin Notebook](kotlin-notebook.png){width=800}

### Kotlin notebooks in Datalore

With Datalore, you can use Kotlin in the browser straight out of the box, no installation required.
You can also collaborate on Kotlin notebooks in real time,
get smart coding assistance when writing code, and share results as interactive or static reports.

### Jupyter Notebooks with Kotlin kernel

The Jupyter Notebook is an open-source web application
that allows you to create and share documents that can contain code,
visualizations, and Markdown text. 
[Kotlin-jupyter](https://github.com/Kotlin/kotlin-jupyter) is an open source project that brings Kotlin 
support to Jupyter Notebook. 

## Kandy

Text about the Kandy library.

## DataFrame

Text about the DataFrame library.

## What's next

* [Get started with Kotlin Notebook]()
* [Visualize data using Kandy library]()
* Learn more about [Kotlin and Java libraries for data visualization](data-science-libraries.md)