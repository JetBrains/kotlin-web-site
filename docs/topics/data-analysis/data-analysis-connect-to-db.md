[//]: # (title: Connect and retrieve data from databases)

Kotlin Notebook offers capabilities for connecting to and retrieving data from various types of SQL databases, such as 
MariaDB, PostgreSQL, MySQL, and SQLite. 
Utilizing the [DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html), Kotlin Notebook can establish 
connections to databases, execute SQL queries, and import the results for further operations.

For detailed example, see the [Notebook in the KotlinDataFrame SQL Examples GitHub repository](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb).

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

5. Ensure you have access to an SQL database, such as MariaDB or MySQL.


## Connect to database

You can connect to and interact with an SQL database using specific functions from the [DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html). 
You can use `DatabaseConfiguration` to establish a connection to your database and `getSchemaForAllSqlTables` to retrieve 
the schema of all tables within it.

Let's look at an example:

1. **Import libraries:** Import the DataFrame library, which is essential for data manipulation tasks, along with
the necessary Java libraries for SQL connectivity and utility functions: 

```kotlin
%use dataframe
import java.sql.DriverManager
import java.util.*
```

2. **Establish database connection:** Use `DatabaseConfiguration` to define your database's connection parameters, 
including the URL, username, and password:

```kotlin
val URL = "YOUR_URL"
val USER_NAME = "YOUR_USERNAME"
val PASSWORD = "YOUR_PASSWORD"

val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
```

3. **Retrieve table schemas:** Once connected, use the `getSchemaForAllSqlTables()` function to fetch and display the 
schema information for each table in the database:

```kotlin
val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)

dataschemas.forEach { 
    println("---Yet another table schema---")
    println(it)
    println()
}
```

For more information on connecting to SQL databases, see [Read from SQL databases in the DataFrame documentation](https://kotlin.github.io/dataframe/readsqldatabases.html).

## Retrieve and manipulate data

After [establishing a connection to an SQL database](#connect-to-database), you can retrieve and manipulate data in Kotlin Notebook, utilizing the DataFrame library. 
You can use `readSqlTable` to retrieve data. To manipulate data, you can use methods, such as [`.filter`](https://kotlin.github.io/dataframe/filter.html), [`.groupBy`](https://kotlin.github.io/dataframe/groupby.html), 
and [`.convert`](https://kotlin.github.io/dataframe/convert.html). 

Let's look at an example of connecting to an IMDB database and retrieving data about movies directed by Quentin Tarantino:

1. **Fetch data from a table:** Use the `readSqlTable` function to retrieve data from the "movies" table, setting `limit` 
to restrict the query to the first 100 records for efficiency:

```kotlin
val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
```

2. **Execute SQL query:**
Use an SQL query to retrieve a specific dataset related to movies directed by Quentin Tarantino. 
This query selects movie details and combines genres for each movie:

```kotlin
val props = Properties()
props.setProperty("user", USER_NAME)
props.setProperty("password", PASSWORD)

val TARANTINO_FILMS_SQL_QUERY = """
    SELECT name, year, rank, GROUP_CONCAT(genre) as "genres"
    FROM movies JOIN movies_directors ON movie_id = movies.id
    JOIN directors ON directors.id=director_id LEFT JOIN movies_genres ON movies.id = movies_genres.movie_id
    WHERE directors.first_name = "Quentin" AND directors.last_name = "Tarantino"
    GROUP BY name, year, rank
    ORDER BY year
    """

var dfTarantinoMovies: DataFrame<*>

DriverManager.getConnection(URL, props).use { connection ->
   connection.createStatement().use { st ->
      st.executeQuery(TARANTINO_FILMS_SQL_QUERY).use { rs ->
         val dfTarantinoFilmsSchema = DataFrame.getSchemaForResultSet(rs, connection)
         dfTarantinoFilmsSchema.print()

         dfTarantinoMovies = DataFrame.readResultSet(rs, connection)
         dfTarantinoMovies
      }
   }
}
```

3. **Manipulate and filter data:**
After fetching the Tarantino movies dataset, you can further manipulate and filter the data.

```kotlin
val df = dfTarantinoMovies
    .fillNA { year }.with { 0 }
    .convert { year }.toInt()
    .filter { year > 2000 }
```

The resulting output is a DataFrame where missing values in the year column are replaced with 0 using the 
[`.fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) method, the year column is converted to integer values 
with the [`.convert`](https://kotlin.github.io/dataframe/convert.html) method, and the data is filtered to include only 
rows from the year 2000 onwards using the [`.filter`](https://kotlin.github.io/dataframe/filter.html) method.

## Analyze data in Kotlin Notebook

After [establishing a connection to an SQL database](#connect-to-database), Kotlin Notebook enables in-depth data analysis 
utilizing the [DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html). This includes functions for 
grouping, sorting, and aggregating data, helping you to uncover and understand patterns within your data.

Let's dive into an example that involves analyzing actor data from a movie database, focusing on the most frequently 
occurring first names of actors:

1. **Retrieve data from a specific table:**
Extract data from the "actors" table using the [`readSqlTable`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) function:

```kotlin
val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
```

2. **Manipulate data:**
Process the retrieved data to identify the top 20 most common actor first names. This analysis involves several DataFrame methods:

```kotlin
val top20ActorNames = actorDf
   .groupBy { first_name } // Group the data by the first_name column to organize it based on actor first names.
   .count() // Count the occurrences of each unique first name, providing a frequency distribution.
   .sortByDesc("count") // Sort the results in descending order of count to identify the most common names.
   .take(20) // Select the top 20 most frequent names for analysis.
top20ActorNames
```

## What's next

* Visualize data using the Kandy library
* Check out the list of supported libraries