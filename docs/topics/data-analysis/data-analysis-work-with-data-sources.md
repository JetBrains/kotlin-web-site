[//]: # (title: Retrieve data from files)
[//]: # (description: Learn how to load data from files in Kotlin Notebook using Kotlin DataFrame, including CSV, JSON, SQL, Excel, Apache Arrow files.)

[Kotlin Notebook](kotlin-notebook-overview.md), coupled with the [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html), enables 
you to work with both non-structured and structured data. This combination offers the flexibility to transform non-structured data, 
such as data found in TXT files, into structured datasets. 

For data transformations, you can use such methods as [`add`](https://kotlin.github.io/dataframe/adddf.html), [`split`](https://kotlin.github.io/dataframe/split.html),
[`convert`](https://kotlin.github.io/dataframe/convert.html), and [`parse`](https://kotlin.github.io/dataframe/parse.html). 
Additionally, this toolset enables the retrieval and manipulation of data from various structured file formats, 
including CSV, JSON, XLS, and Apache Arrow. 
See all supported formats in the [DataFrame documentation](https://kotlin.github.io/dataframe/data-sources.html).

In this guide, you can learn how to retrieve, refine, and handle data through multiple examples.

## Before you start

Kotlin Notebook relies on the [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
which is bundled and enabled in IntelliJ IDEA by default.

If the Kotlin Notebook features are not available, ensure the plugin is enabled. For more information,
see [Set up an environment](kotlin-notebook-set-up-env.md).

To follow this tutorial:

1. Create a [new Kotlin Notebook](kotlin-notebook-create.md).
2. Import the [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html):

   ```kotlin
   %use dataframe
   ```

> Make sure to run the code cell with the `%use dataframe` line before you run any other code cells
> that rely on the Kotlin DataFrame library.
>
{style="note"}

## Retrieve data

To retrieve data from a file into your Kotlin Notebook, use `DataFrame.read()`:

```kotlin
val movies = DataFrame.read(“movies.csv”)
```

`DataFrame.read()` detects the input format based on the file extension and content.

You can also pass additional arguments to control how `DataFrame` reads the input data.
For example, you can specify a custom delimiter (`;`) for a CSV file:

```kotlin
val movies = DataFrame.read(“movies.csv”, delimiter = ‘;’)
```

> For a comprehensive overview of additional file formats and a variety of read functions, see the 
> [Kotlin DataFrame library documentation](https://kotlin.github.io/dataframe/read.html).
> 
{style="tip"}

## Display data

Once you [have the data in your notebook](#retrieve-data), you can display it. For that, 
store your data in a variable and then return it:

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

This code displays the data from your file as an interactive table:

![Display data](display-data.png){width=700}

You can use this view to inspect values, check column names, and easily understand 
the state of your dataset.

## Inspect data structure

To gain insights into the structure or schema of your data, apply the `.schema()` function on your `DataFrame` variable. 

For example, `dfJson.schema()` lists the type of each column in your JSON dataset.

![Schema example](schema-data-analysis.png){width=700}

You can also use the autocompletion feature in Kotlin Notebook to quickly access and manipulate the properties of your 
`DataFrame`. After loading your data, simply type the `DataFrame` variable followed by a dot(`.`) 
to see a list of available columns and their types.

![Available properties](auto-completion-data-analysis.png){width=700}

## Refine data

Kotlin DataFrame provides various operations for refining your dataset. 
For example, [grouping](https://kotlin.github.io/dataframe/group.html),
[filtering](https://kotlin.github.io/dataframe/filter.html), [updating](https://kotlin.github.io/dataframe/update.html), or
[adding new columns](https://kotlin.github.io/dataframe/add.html). These functions are essential for data analysis, 
allowing you to organize, clean, and transform your data effectively.

For example, let's look at the `movies.csv` dataset. It stores movie titles and release years 
in the same cell. The goal is to refine this dataset for easier analysis:

1. **Load the data**
   
   Load the file into a `DataFrame` using `.read()`:

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. **Add a column** 

   To extract the release year from the `title column`, add a new `year` column:

   ```kotlin
   val moviesWithYear = movies
       .add("year") { 
           "\\d{4}".toRegex()
               .findAll(title)
               .lastOrNull()
               ?.value
               ?.toInt()
               ?: -1
       }
   
   moviesWithYear
   ```

3. **Update values**

   To remove the release year from the movie titles, update the `title` column:

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "") 
   }
   
   moviesTitle
   ```

   The code keeps the movie titles in one column and moves the release years into another column.

4. **Filter rows**

   To focus on specific data, use the `filter` method. For example, to keep only the movies
   released after 1986, run:

   ```kotlin
   val newMovies = moviesTitle.filter { 
       year >= 1996 
   }
   
   newMovies
   ```
   
5. **Remove column**

   To remove a column that you do not need, use `remove`:

   ```kotlin
   val refinedMovies = newMovies.remove { 
       movieID 
   }
   
   refinedMovies
   ```


For comparison, here is the dataset before refinement:

![Original dataset](original-dataset.png){width=700}

The refined dataset:

![Data refinement result](refined-data.png){width=700}

> For additional use cases and detailed examples, see [Examples of Kotlin Dataframe](https://github.com/Kotlin/dataframe/tree/master/examples).
> 
{style="tip"}

## Export data

After [refining data in Kotlin Notebook](#refine-data) using the Kotlin DataFrame library, you can easily export your processed 
data. 

You can utilize a variety of [`.write()`](https://kotlin.github.io/dataframe/write.html) functions for this purpose, which support saving in multiple formats,
including CSV, JSON, XLS, XLSX, Apache Arrow, and even HTML tables. See all supported formats in the [DataFrame documentation](https://kotlin.github.io/dataframe/data-sources.html)
This can be particularly useful for sharing your findings, creating reports, or making your data available for further analysis.

For example, let’s save the result as:

* JSON file using [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json):
 
  ```kotlin
  refinedMovies.writeJson("movies.json")
  ```
* CSV file using [`writeCsv()`](https://kotlin.github.io/dataframe/write.html#writing-to-csv): 

  ```kotlin
  refinedMovies.writeCsv("movies.csv")
  ```
* [Apache Arrow files](https://kotlin.github.io/dataframe/write.html#writing-to-apache-arrow-formats) using `writeArrorIPC()` or `writeArrorFeather()`:

  ```kotlin
  refinedMovies.writeArrowIPC("movies.arrow")
  refinedMovies.writeArrowFeather("movies.feather")
  ```

You can also open a standalone HTML table in your browser. Use [`.toStandaloneHTML()`](https://kotlin.github.io/dataframe/tohtml.html):

```kotlin
refinedMoviesDf
    .toStandaloneHTML(DisplayConfiguration(rowsLimit = null))
    .openInBrowser()
```

## What's next

* Explore data visualization using the [Kandy library](https://kotlin.github.io/kandy/examples.html)
* Find additional information about data visualization in [Data visualization in Kotlin Notebook with Kandy](data-analysis-visualization.md)
* For an extensive overview of tools and resources available for data science and analysis in Kotlin, see [Kotlin and Java libraries for data analysis](data-analysis-libraries.md)