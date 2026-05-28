[//]: # (title: Connect and retrieve data from databases)
[//]: # (description: Learn how to connect to SQL databases, inspect table schemas, and retrieve data with Kotlin DataFrame.)

[Kotlin Notebook](kotlin-notebook-overview.md) provides support for the most common SQL databases:

* [DuckDB](https://kotlin.github.io/dataframe/duckdb.html)
* [H2](https://kotlin.github.io/dataframe/h2.html)
* [MariaDB](https://kotlin.github.io/dataframe/mariadb.html)
* [Microsoft SQL Server](https://kotlin.github.io/dataframe/microsoft-sql-server.html)
* [MySQL](https://kotlin.github.io/dataframe/mysql.html)
* [PostgreSQL](https://kotlin.github.io/dataframe/postgresql.html)
* [SQLite](https://kotlin.github.io/dataframe/sqlite.html)

With [Kotlin DataFrame library](https://kotlin.github.io/dataframe/home.html), Kotlin Notebook can establish connections to databases, 
execute SQL queries, and import the results for further operations.

> For a detailed example, explore the notebook in the [KotlinDataFrame SQL Examples GitHub repository](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb).
>
{style="tip"}

## Before you start

Kotlin Notebook relies on the [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
which is bundled and enabled in IntelliJ IDEA by default.

If the Kotlin Notebook features are not available, ensure the plugin is enabled. For more information,
see [Set up an environment](kotlin-notebook-set-up-env.md).

To follow this tutorial:
1. Create a [new Kotlin Notebook](kotlin-notebook-create.md).
2. Add the Java Database Connectivity (JDBC) driver dependency for your database in the first cell of your notebook.
   
   For example, to connect to a MariaDB database, add:

   ```kotlin 
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```
3. Import Kotlin DataFrame:

   ```kotlin
   %use dataframe
   ```

> Run the code cell with the `%use dataframe` line before any other code cells
> to make sure the DataFrame library and its APIs are available in the notebook.
>
{style="note"}

## Connect to a database

To connect to a database, create a connection configuration using the `DbConnectionConfig()` function:

1. Import the following functionality:
   
   ```kotlin
   import org.jetbrains.kotlinx.dataframe.io.DbConnectionConfig
   import org.jetbrains.kotlinx.dataframe.schema.DataFrameSchema
   ```

2. Define connection parameters (URL, username, password) using the `DbConnectionConfig()` function:

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

Before loading the data, inspect the database schemas
to understand what tables you have and what columns they contain. 
You can use the schemas to decide which table to load into a DataFrame.

To retrieve schemas for all user-created tables in your database, use the `DataFrameSchema.readAllSqlTables()`
function:

```kotlin
val dataSchemas = DataFrameSchema.readAllSqlTables(dbConfig)

dataSchemas.forEach { (tableName, schema) ->
    println("---Schema for table: $tableName---")
    println(schema)
    println()
}
```

## Load data

After you inspect the database schemas and select the data, load the
data into a DataFrame.

Kotlin DataFrame provides two ways to load data from a database:

* Load data directly from a table.
* Load the result of a custom SQL query.

Both approaches return a DataFrame that you can inspect, transform, and analyze in Kotlin Notebook.

### Load data from a table

To load data from a table, use the [`DataFrame.readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) function.

The following example loads the first 100 rows from the `movies` table:

```kotlin
val moviesDf = DataFrame.readSqlTable(
    dbConfig = dbConfig,
    tableName = "movies",
    limit = 100
)

moviesDf
```


### Load data with an SQL query

To execute a specific SQL query on your database, use the [`DataFrame.readSqlQuery()`](https://kotlin.github.io/dataframe/readsqldatabases.html#executing-sql-queries) function.
This approach is useful when you need to load specific columns, join tables, filter rows, or aggregate data in a database.

Let's retrieve a specific dataset related to movies directed by Quentin Tarantino.
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

After loading your database into a DataFrame, you can use DataFrame
operations to process retrieved data.

For example, let's manipulate data from the previous section. The following code:
1. Replaces missing values in the `year` column using the [`.fillNA()`](https://kotlin.github.io/dataframe/fill.html#fillna) function.
2. Converts the column to `Int` using the [`.convert()`](https://kotlin.github.io/dataframe/convert.html) function.
3. Keeps only films released after 2000 using the [`.filter()`](https://kotlin.github.io/dataframe/filter.html) function.

```kotlin
val filteredTarantinoMovies = tarantinoMoviesDf
    .fillNA { year }.with { 0 }
    .convert { year }.toInt()
    .filter { year > 2000 }

filteredTarantinoMovies
```

## Analyze data

Use [Kotlin Notebook](kotlin-notebook-overview.md) and [DataFrame library](https://kotlin.github.io/dataframe/home.html)
to group, sort, and aggregate data so you can uncover and understand
patterns in your data.

For example, let's read actor data from the `actors` table and find the 20 most common first names:

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