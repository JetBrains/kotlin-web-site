[//]: # (title: Retrieve data from files)

Kotlin Notebook, coupled with the [Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html), enables 
you to work with both non-structured and structured data. This combination offers the flexibility to transform non-structured data, 
such as data found in TXT files, into structured datasets. 

For data transformations, you can utilize methods such as [`add`](https://kotlin.github.io/dataframe/adddf.html), [`split`](https://kotlin.github.io/dataframe/split.html),
[`convert`](https://kotlin.github.io/dataframe/convert.html), and [`parse`](https://kotlin.github.io/dataframe/parse.html). 
Additionally, this toolset enables the retrieval and manipulation of data from various structured file formats, 
including CSV, JSON, XLS, XLSX, and Apache Arrow.

In this guide, you can learn how to retrieve, refine, and handle data through multiple examples.

## Before you start

1. Download and install the latest version of [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac).
2. Install the [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) in IntelliJ IDEA.

   > Alternatively, access the Kotlin Notebook plugin from **Settings/Preferences** | **Plugins** | **Marketplace** within IntelliJ IDEA.
   >
   {type="tip"}

3. Create a new Kotlin Notebook by selecting **File** | **New** | **Kotlin Notebook**.
4. In the Kotlin Notebook, import the Kotlin DataFrame library by running the following command:

```kotlin
%use dataframe
```

## Retrieve data from a file

To retrieve data from a file in Kotlin Notebook:

1. Open your Kotlin Notebook file (`.ipynb`).
2. Import the Kotlin DataFrame library by adding `%use dataframe` in a code cell at the start of your Notebook.
> Make sure to run the code cell with the `%use dataframe` line before you run any other code cells that rely on the Kotlin DataFrame library.
>
{type="note"}

3. Use the `.read()` function from the Kotlin DataFrame library to retrieve data. For example, to read a CSV file, 
use: `DataFrame.read("example.csv")`.

The `.read()` function automatically detects the input format based on the file extension and content.
You can also add other arguments to customize the function, such as specifying the delimiter with `delimiter = ';'`.

For a comprehensive overview of additional file formats and a variety of read functions, see the 
[Kotlin DataFrame library documentation](https://kotlin.github.io/dataframe/read.html).

## Display data

Once you [have the data in your notebook](#retrieve-data-from-a-file), you can easily store it in a variable and access it by running the 
following in a code cell: 

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

This code displays the data from the file of your choice, such as CSV, JSON, XLS, XLSX, or Apache Arrow.
![Display data](display-data.png){width=700}

To gain insights into the structure or schema of your data, apply the `.schema()` function on your DataFrame variable. 
For example, `dfJson.schema()` lists the type of each column in your JSON dataset.

![Schema example](schema-data-analysis.png){width=700}

You can also use the autocompletion feature in Kotlin Notebook to quickly access and manipulate the properties of your 
DataFrame. After loading your data, simply type the DataFrame variable followed by a dot to see a list of available columns 
and their types.

![Available properties](auto-completion-data-analysis.png){width=700}

## Refine data

Among the various operations available in the Kotlin DataFrame library for refining your dataset, key examples include [grouping](https://kotlin.github.io/dataframe/group.html),
[filtering](https://kotlin.github.io/dataframe/filter.html), [updating](https://kotlin.github.io/dataframe/update.html), 
and [adding new columns](https://kotlin.github.io/dataframe/add.html). These functions are essential for data analysis, allowing you to organize, clean, and 
transform your data effectively. 

Let's look at an example where our data includes movie titles and their corresponding release year in the same cell. 
The goal is to refine this dataset for easier analysis:

1. Load your data into the notebook using the `.read()` function. This example involves reading data from a CSV file named 
`movies.csv` and creating a DataFrame called `movies`:

```kotlin
val movies = DataFrame.read("movies.csv")
```

2. Extract the release year from the movie titles using regex and add it as a new column:

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
```

3. Modify the movie titles by removing the release year from each title. 
This cleans up the titles for consistency:

```kotlin
val moviesTitle = moviesWithYear
    .update("title") {
        "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
    }
```

4. Use the `.filter` method to focus on specific data. 
In this case, the dataset is filtered to focus on movies that were released after the year 1996:

```kotlin
val moviesNew = moviesWithYear.filter { year >= 1996 }
moviesNew
```

For comparison, here is the dataset before refinement:

![Original dataset](original-dataset.png){width=700}

The refined dataset:

![Data refinement result](refined-data.png){width=700}

This is a practical demonstration of how you can use the Kotlin DataFrame library's methods, like `.add`, `.update`, and `.filter` to 
effectively refine and analyze data in Kotlin.

> For additional use cases and detailed examples, see [Examples of Kotlin Dataframe](https://github.com/Kotlin/dataframe/tree/master/examples).
> 
{type="tip"}

## Save DataFrame

After [refining data in Kotlin Notebook](#refine-data) using the Kotlin DataFrame library, you can easily export your processed 
data. You can utilize a variety of [`.write()`](https://kotlin.github.io/dataframe/write.html) functions for this purpose, which support saving in multiple formats,
including CSV, JSON, XLS, XLSX, Apache Arrow, and even HTML tables.
This can be particularly useful for sharing your findings, creating reports, or making your data available for further analysis.

Here's how you can filter a DataFrame, remove a column, save the refined data to a JSON file, and open an HTML table 
in your browser:

1. In Kotlin Notebook, use the `.read()` function to load a file named
`movies.csv` into a DataFrame named `moviesDf`:

```kotlin
val moviesDf = DataFrame.read("movies.csv")
```

2. Filter the DataFrame to only include movies that belong to the "Action" genre using the `.filter` method:

```kotlin
val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
```

3. Remove the `movieId` column from the DataFrame using `.remove`:

```kotlin
val refinedMoviesDf = actionMoviesDf.remove { movieId }
refinedMoviesDf
```

4. The Kotlin DataFrame library offers various write functions to save data in different formats. In this example, 
the [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) function is used to save the modified `movies.csv` as a JSON file:

```kotlin
refinedMoviesDf.writeJson("movies.json")
```

5. Use the `.toStandaloneHTML()` function to convert the DataFrame into a standalone HTML 
table and open it in your default web browser:

```kotlin
refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
```

## What's next

* Explore data visualization using the [Kandy library](https://kotlin.github.io/kandy/examples.html).
* Find additional information about data visualization in [Data visualization in Kotlin Notebook with Kandy](data-analysis-visualization.md).
* For an extensive overview of tools and resources available for data science and analysis in Kotlin, see [Kotlin and Java libraries for data analysis](data-science-libraries.md).