[//]: # (title: Kotlin for data analysis)
[//]: # (description: Learn how to use Kotlin for data analysis with Kotlin DataFrame and Kandy to retrieve, transform, analyze, and visualize data.)

Exploring and analyzing data is something you may not do every day, but it's a crucial skill you need as a software developer.

Let's think about software development duties where data analysis is key: analyzing what's actually inside collections when debugging,
digging into memory dumps or databases, or receiving JSON files with large amounts of data when working with REST APIs, to mention some.

With Kotlin's Exploratory Data Analysis (EDA) tools, such as [Kotlin DataFrame](#kotlin-dataframe) and [Kandy](#kandy), you
have at your disposal a rich set of capabilities to enhance your analytics skills and support you across different scenarios:

* **Load, transform, and visualize data in various formats:** with our Kotlin EDA tools, you can perform tasks like filtering, sorting, and aggregating data. Our tools can seamlessly
  read data right in the IDE from different data sources, such as CSV, JSON, SQL Databases, or Parquet files.
  See all supported formats in the [DataFrame documentation](https://kotlin.github.io/dataframe/data-sources.html).


    Kandy, our plotting tool, allows you to create a wide range of charts to visualize and gain insights from the dataset.

* **Efficiently analyze data stored in relational databases:** Kotlin DataFrame seamlessly integrates with databases and provides capabilities similar to SQL queries.
  You can retrieve, manipulate, and visualize data directly from various databases.

* **Fetch and analyze real-time and dynamic datasets from web APIs:** the EDA tools' flexibility allows integration with external APIs via protocols like OpenAPI.
  This feature helps you fetch data from web APIs, to then clean and transform the data to your needs.

## Kotlin DataFrame

The [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) library lets you manipulate structured data in your Kotlin projects. From data creation and
cleaning to in-depth analysis and feature engineering, this library has you covered.

With the Kotlin DataFrame library, you can work with different file formats, including CSV, JSON, XLS, and XLSX. This library also facilitates the data retrieval process
with its ability to connect with SQL databases or APIs.
See all supported formats in the [DataFrame documentation](https://kotlin.github.io/dataframe/data-sources.html).

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) is an open-source Kotlin library that provides a powerful and flexible DSL for plotting charts of various types.
This library is a simple, idiomatic, readable, and type-safe tool to visualize data. You can also easily combine Kandy
with Kotlin Dataframe to complete different data-related tasks.

![Kandy](data-analysis-kandy-example.png){width=700}

## What's next

* [Retrieve and transform data using the Kotlin DataFrame library](data-analysis-work-with-data-sources.md)
* [Visualize data using the Kandy library](data-analysis-visualization.md)
* [Learn more about Kotlin and Java libraries for data analysis](data-analysis-libraries.md)