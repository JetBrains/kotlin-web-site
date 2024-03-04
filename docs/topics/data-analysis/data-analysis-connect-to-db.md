[//]: # (title: Connect and retrieve data from databases)

Kotlin Notebook offers capabilities for connecting to and retrieving data from various types of SQL databases. 
Utilizing the [DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html), Kotlin Notebook can establish 
connections to databases, execute SQL queries, and import the results for further operations.

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

## Get data from SQL database

To get data from an SQL database, you must first add the [right dependency](https://kotlin.github.io/dataframe/readsqldatabases.html#getting-started-with-reading-from-sql-database).
For example, for MariaDB, you must add: `implementation("org.mariadb.jdbc:mariadb-java-client:$version")`.

### Connect to database

To connect to a database:

```kotlin
val URL = "jdbc:mariadb://localhost:3307/imdb" // The URL of your database
val USER_NAME = "root" // Your database user name
val PASSWORD = "pass" // Your database password

val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)

val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)

dataschemas.forEach { 
    println("---Yet another table schema---")
    println(it)
    println()
}
```

### Retrieve and manipulate data

### Work with data in Kotlin Notebooks

## What's next

* Visualize data using the Kandy library
* Check out the list of supported libraries