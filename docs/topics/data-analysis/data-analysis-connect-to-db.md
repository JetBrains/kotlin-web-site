[//]: # (title: Connect and retrieve data from databases)
[//]: # (description: Learn how to connect to SQL databases from Kotlin Notebook, inspect table schemas, and retrieve data with Kotlin DataFrame.)

[Kotlin Notebook](kotlin-notebook-overview.md) offers capabilities for connecting to and retrieving data from various types of SQL databases, such as 
MariaDB, PostgreSQL, MySQL, and SQLite. 
Utilizing the [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html), Kotlin Notebook can establish 
connections to databases, execute SQL queries, and import the results for further operations.

[Kotlin Notebook](kotlin-notebook-overview.md) provides support for the most common SQL databases:
* [PostgreSQL](https://kotlin.github.io/dataframe/postgresql.html)
* [MySQL](https://kotlin.github.io/dataframe/mysql.html)
* [Microsoft SQL Server](https://kotlin.github.io/dataframe/microsoft-sql-server.html)
* [SQLite](https://kotlin.github.io/dataframe/sqlite.html)
* [H2](https://kotlin.github.io/dataframe/h2.html)
* [MariaDB](https://kotlin.github.io/dataframe/mariadb.html)
* [DuckDB](https://kotlin.github.io/dataframe/duckdb.html)

With [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html), Kotlin Notebook can establish connections to databases, 
execute SQL queries, and import the results for further operations.

> For a detailed example, see the [Notebook in the KotlinDataFrame SQL Examples GitHub repository](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb).
>
{style="tip"}

## Before you start

Kotlin Notebook relies on the [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
which is bundled and enabled in IntelliJ IDEA by default.

If the Kotlin Notebook features are not available, ensure the plugin is enabled. For more information,
see [Set up an environment](kotlin-notebook-set-up-env.md).

To follow this tutorial:
1. Create a [new Kotlin Notebook](kotlin-notebook-create.md).
2. Add the Java Database Connectivity (JDBS) driver dependency for your database. 
   For example, to connect to a MariaDB database, add:

   ```kotlin 
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```
3. Import the Kotlin DataFrame library:
```kotlin
%use dataframe
```

> Make sure to run the code cell with the `%use dataframe` line before you run any other code cells
> that rely on the Kotlin DataFrame library.
>
{style="note"}

## Connect to a database

To connect to a database, create a connection configuration using `DbConnectionConfig`:

1. Import required functionality:
   
   ```kotlin
   import org.jetbrains.kotlinx.dataframe.io.DbConnectionConfig
   import org.jetbrains.kotlinx.dataframe.schema.DataFrameSchema
   ```

2. Define connection parameters (URL, username, password) using `DbConnectionConfig`:


   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DbConnectionConfig(URL, USER_NAME, PASSWORD)
   ```

> For more information on connecting to SQL databases, see [Read from SQL databases in the Kotlin DataFrame documentation](https://kotlin.github.io/dataframe/readsqldatabases.html).
>
{style="tip"}

## Inspect database schema

Before loading the data, you can inspect the table schemas. 
This helps you understand what tables you have and what columns they contain. 
You can also use the schemas to decide which table to load into a `DataFrame`.

To retrieve schemas for all non-system tables in your database, use `.readAllSqlTables()`:

```kotlin
val dataSchemas = DataFrameSchema.readAllSqlTables(dbConfig)

dataSchemas.forEach { (tableName, schema) ->
    println("---Schema for table: $tableName---")
    println(schema)
    println()
}
```

## Retrieve data

After establishing connection to an SQL database, you can retrieve data from a table
or with an SQL query.

### Retrieve data from a table

To retrieve data from a table, use [`DataFrame.readSqlTable`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables).

The following example reads the first 100 rows from the `movies` table:

```kotlin
val moviesDf = DataFrame.readSqlTable(
    dbConfig = dbConfig,
    tableName = "movies",
    limit = 100
)

moviesDf
```
The result is a `DataFrame` that you can process and inspect in Kotlin Notebook.

### Retrieve data with an SQL query

To execute a specific SQL query on your database, use [`DataFrame.readSqlQuery`](https://kotlin.github.io/dataframe/readsqldatabases.html#executing-sql-queries). 
This helps when you need to retrieve specific columns, join tables, filter rows, or aggregate data.

Let’s retrieve a specific dataset related to movies directed by Quentin Tarantino. 
This query selects movie details and combines genres for each movie:

```kotlin
val TARANTINO_FILMS_SQL_QUERY = """
    SELECT name, year, rank, GROUP_CONCAT(genre) as "genres"
    FROM movies JOIN movies_directors ON movie_id = movies.id
    JOIN directors ON directors.id=director_id LEFT JOIN movies_genres ON movies.id = movies_genres.movie_id
    WHERE directors.first_name = "Quentin" AND directors.last_name = "Tarantino"
    GROUP BY name, year, rank
    ORDER BY year
    """

val tarantinoMoviesDf = DataFrame.readSqlQuery(dbConfig, TARANTINO_FILMS_SQL_QUERY)

tarantinoMoviesDf
```

## Process data
After loading your database into a `DataFrame`, you can use Kotlin DataFrame
operations to process retrieved data.

For example, let’s manipulate data from the previous example. The following code:
1. Replaces missing values in the `year` column using [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna).
2. Converts the column to `Int` using [`convert`](https://kotlin.github.io/dataframe/convert.html).
3. Keeps only films released after 2000 using [`filter`](https://kotlin.github.io/dataframe/filter.html).

```kotlin
val filteredTarantinoMovies = tarantinoMoviesDf
    .fillNA { year }.with { 0 }
    .convert { year }.toInt()
    .filter { year > 2000 }

filteredTarantinoMovies
```

## Analyze data

You can use [Kotlin Notebook](kotlin-notebook-overview.md) and [DataFrame library](https://kotlin.github.io/dataframe/home.html)
to group, sort, and aggregate data. 
This helps you uncover and understand patterns of your data.

For example, let’s read actor data from the `actors` table and find the 20 most common first names:

```kotlin
// Extract data from the actors table
val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
val top20ActorNames = actorDf
   // Groups the data by the first_name column
   .groupBy { first_name }
   
   // Counts the occurrences of each unique first name
   .count()
   
    // Sorts the results in descending order of count
   .sortByDesc("count")
    
   // Selects the top 20 most frequent names for analysis.
   .take(20)
```

## What's next

* Explore data visualization using the [Kandy library](https://kotlin.github.io/kandy/examples.html)
* Find additional information about data visualization in [Data visualization in Kotlin Notebook with Kandy](data-analysis-visualization.md)
* For an extensive overview of tools and resources available for data science and analysis in Kotlin, see [Kotlin and Java libraries for data analysis](data-analysis-libraries.md)