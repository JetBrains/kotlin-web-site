[//]: # (title: Retrieve data from files)

Kotlin Notebook, coupled with the  [DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html), enables 
you to work with both non-structured and structured data. It offers the flexibility to transform non-structured data, 
such as those found in TXT files, into structured datasets. For this transformation, you can utilize methods 
such as [`add`](https://kotlin.github.io/dataframe/adddf.html), [`split`](https://kotlin.github.io/dataframe/split.html),
[`convert`](https://kotlin.github.io/dataframe/convert.html), and [`parse`](https://kotlin.github.io/dataframe/parse.html)
for this purpose. Additionally, this toolset enables the retrieval and manipulation of data from various structured file formats, 
including CSV, JSON, XLS, and XLSX.

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
2. Import the DataFrame library by adding `%use dataframe` in a code cell at the start of your Notebook.
> Make sure to run the code cell with the `%use dataframe` line before you run any other code cells that rely on the DataFrame library.
>
{type="note"}

3. Use the `.read()` function from DataFrame to retrieve data. For example, to read a CSV file, use: `DataFrame.read("example.csv")`.

The `.read()` function automatically detects the input format based on the file extension and content.
You can also add other arguments to customize the function, such as specifying the delimiter with `delimiter = ';'`.

For a comprehensive overview of additional file formats and a variety of read functions, see the 
[DataFrame library documentation](https://kotlin.github.io/dataframe/read.html).

## Display data

Once you [have the data in your notebook](#retrieve-data-from-a-file), you can easily store it in a variable and access it by running the 
following code cell: 

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

This will display the data from the file of your choice, such as CSV, JSON, XLS, or XLSX.
![Display data](display-data.png){width=700}

To gain insights into the structure or schema of your data, apply the `.schema()` function on your DataFrame variable. 
For example, `dfJson.schema()` will list the type of each column in your JSON dataset.

![Schema example](schema-data-analysis.png){width=700}

## Refine data

Among the various functions available for refining your dataset in DataFrame, key examples include [grouping](https://kotlin.github.io/dataframe/group.html),
[filtering](https://kotlin.github.io/dataframe/filter.html), [updating](https://kotlin.github.io/dataframe/update.html), 
and [adding new columns](https://kotlin.github.io/dataframe/add.html). These functions are essential for data analysis, allowing you to organize, clean, and 
transform your data effectively.  Let's look at an example where our data includes movie titles, which also contain 
the release year of the movies. The goal is to refine this dataset for easier analysis:

1. **Import libraries:** Import the DataFrame library necessary for data manipulation tasks.

```kotlin
%use dataframe
```

2. **Read data from a CSV file:**
Load your data into the notebook. This example involves reading data from a CSV file named "movies.csv" and creating a DataFrame called `movies`:

```kotlin
val movies = DataFrame.read("movies.csv")
```

3. **Add a new data column for the year:** Extract the release year from the movie titles using regex and add it as a new column:

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

4. **Update movie titles:** Modify the movie titles by removing the release year from each title. 
This cleans up the titles for consistency:

```kotlin
val moviesTitle = moviesWithYear
    .update("title") {
        "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
    }
```

5. **Filter movies and display the resulting DataFrame:** Use the `.filter` method to focus on specific data. 
In this case, the dataset is filtered to focus on movies that were released after the year 1990:

```kotlin
val moviesNew = moviesWithYear.filter { year >= 1990 }
moviesNew
```

![Data refinement result](refined-data.png){width=700}

This is a practical demonstration of how DataFrame's functions, like `.add`, `.update`, and `.filter` can be used to 
effectively refine and analyze data in Kotlin.

For more examples, see [Examples of Kotlin Dataframe](https://github.com/Kotlin/dataframe/tree/master/examples). 

## What's next

* Visualize data using the Kandy library
* Check out the list of supported libraries