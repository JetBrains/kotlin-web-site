[//]: # (title: Kotlin DataFrame)

The [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) library lets you manipulate structured data in your Kotlin projects. Use it to load data from
files or databases, explore its structure, and clean and transform it for analysis or further processing.

A dataframe organizes data into rows and named columns, similar to a spreadsheet or SQL table. Each column has a type,
and columns can contain nested data. Kotlin DataFrame supports both flat tables and hierarchical structures.

Kotlin DataFrame can read data from:

<tabs>

<tab id="dataframe-files" title="Files">

* [JSON](https://kotlin.github.io/dataframe/json.html)
* [CSV / TSV](https://kotlin.github.io/dataframe/csv-tsv.html)
* [Excel](https://kotlin.github.io/dataframe/excel.html)
* [Apache Arrow](https://kotlin.github.io/dataframe/apachearrow.html)
* [Parquet](https://kotlin.github.io/dataframe/parquet.html)

</tab>
<tab id="dataframe-db" title="Databases">

* [DuckDB](https://kotlin.github.io/dataframe/duckdb.html)
* [H2](https://kotlin.github.io/dataframe/h2.html)
* [MariaDB](https://kotlin.github.io/dataframe/mariadb.html)
* [Microsoft SQL Server](https://kotlin.github.io/dataframe/microsoft-sql-server.html)
* [MySQL](https://kotlin.github.io/dataframe/mysql.html)
* [PostgreSQL](https://kotlin.github.io/dataframe/postgresql.html)
* [SQLite](https://kotlin.github.io/dataframe/sqlite.html)

</tab>
</tabs>

## Get started

You can use Kotlin DataFrame in Kotlin projects built with Gradle, Maven, or Kotlin Toolchain:

| Build tool       | Setup guide                                                                                  | Sample project                                                                                                                                |
|------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Gradle           | [Setup with Gradle](https://kotlin.github.io/dataframe/setupgradle.html)                     | [Gradle sample](https://github.com/Kotlin/dataframe/tree/master/examples/projects/kotlin-dataframe-plugin-gradle-example)                     |
| Maven            | [Setup with Maven](https://kotlin.github.io/dataframe/setupmaven.html)                       | [Maven sample](https://github.com/Kotlin/dataframe/tree/master/examples/projects/kotlin-dataframe-plugin-maven-example)                       |
| Kotlin Toolchain | [Set up with Kotlin Toolchain](https://kotlin.github.io/dataframe/setupkotlintoolchain.html) | [Kotlin Toolchain sample](https://github.com/Kotlin/dataframe/tree/master/examples/projects/kotlin-dataframe-plugin-kotlin-toolchain-example) |


## What's next
- Follow the [DataFrame Quickstart Guide](https://kotlin.github.io/dataframe/quickstart.html)
- Explore the [examples](https://github.com/Kotlin/dataframe/tree/master/examples) for common workflows