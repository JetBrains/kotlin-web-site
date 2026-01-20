[//]: # (title: Get started with Kotlin)

<tldr>
<p>Latest Kotlin release:<b> <a href="%kotlinLatestWhatsnew%">%kotlinVersion%</a></b></p>
</tldr>

Kotlin is a modern but already mature programming language designed to make developers happier.
It's concise, safe, interoperable with Java and other languages, and provides many ways to reuse code between multiple platforms for productive programming.

To start, why not take our tour of Kotlin? This tour covers the fundamentals of the Kotlin programming language and can
be completed entirely within your browser.

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="Start the Kotlin tour" style="block"/></a>

## Install Kotlin

Kotlin is included in each [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) and [Android Studio](https://developer.android.com/studio) release.
Download and install one of these IDEs to start using Kotlin.

## Choose your Kotlin use case
 
<tabs>

<tab id="console" title="Console">

Here you'll learn how to develop a console application and create unit tests with Kotlin.

1. **[Create a basic JVM application with the IntelliJ IDEA project wizard](jvm-get-started.md).**

2. **[Write your first unit test](jvm-test-using-junit.md).**

</tab>

<tab id="backend" title="Backend">

Here you'll learn how to develop a backend application with Kotlin server-side.

* **Introduce Kotlin to your Java project:**

  * [Configure a Java project to work with Kotlin](mixing-java-kotlin-intellij.md)
  * [Add Kotlin tests to your Java Maven project](jvm-test-using-junit.md)

* **Create a backend app from scratch with Kotlin:**

  * [Create a RESTful web service with Spring Boot](jvm-get-started-spring-boot.md)
  * [Create HTTP APIs with Ktor](https://ktor.io/docs/creating-http-apis.html)

</tab>

<tab id="cross-platform-mobile" title="Cross-platform">

Here you'll learn how to develop a cross-platform application using [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html).

1. **[Set up your environment for cross-platform development](https://kotlinlang.org/docs/multiplatform/quickstart.html).**

2. **Create your first application for iOS and Android:**

   * Create a cross-platform application from scratch and:
     * [Share business logic while keeping the UI native](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)
     * [Share business logic and UI](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
   * [Make your existing Android application work on iOS](https://kotlinlang.org/docs/multiplatform/multiplatform-integrate-in-existing-app.html)
   * [Create a cross-platform application using Ktor and SQLdelight](https://kotlinlang.org/docs/multiplatform/multiplatform-ktor-sqldelight.html)

3. **Explore [sample projects](https://kotlinlang.org/docs/multiplatform/multiplatform-samples.html)**.

</tab>

<tab id="android" title="Android">

To start using Kotlin for Android development, read [Google's recommendation for getting started with Kotlin on Android](https://developer.android.com/kotlin/get-started).

</tab>

<tab id="data-analysis" title="Data analysis">

From building data pipelines to productionizing machine learning models, Kotlin is a great choice for working with data and getting the most out of it.

1. **Create and edit notebooks seamlessly within the IDE:**

   * [Get started with Kotlin Notebook](get-started-with-kotlin-notebooks.md)

2. **Explore and experiment with your data:**

   * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – a library for data analysis and manipulation.
   * [Kandy](https://kotlin.github.io/kandy/welcome.html) – a plotting tool for data visualization.

3. **Follow Kotlin for Data Analysis on Twitter:** [KotlinForData](http://twitter.com/KotlinForData).

</tab>

</tabs>

## Join the Kotlin community

Stay in the loop with the latest updates across the Kotlin ecosystem and share your experience.

* Join us on:
  * ![Slack](slack.svg){width=25}{type="joined"} Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
  * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: subscribe to the ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) tag.
* Follow Kotlin on ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin), ![Bluesky](bsky.svg){width=18}{type="joined"} [Bluesky](https://bsky.app/profile/kotlinlang.org), and ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/).
* Subscribe to [Kotlin news](https://info.jetbrains.com/kotlin-communication-center.html).

If you encounter any difficulties or problems, report an issue in our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

## Is anything missing?

If anything is missing or seems confusing on this page, please [share your feedback](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).
package com.siksat

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.*
import android.database.Cursor

class StatsActivity : AppCompatActivity() {

    lateinit var db: DatabaseHelper
    lateinit var listView: ListView
    lateinit var adapter: ArrayAdapter<String>
    var statsList = ArrayList<String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_stats)

        db = DatabaseHelper(this)
        listView = findViewById(R.id.listStats)

        loadStats()
    }

    fun loadStats() {
        statsList.clear()
        val cursor: Cursor = db.readableDatabase.rawQuery("SELECT * FROM players ORDER BY goals DESC", null)
        if (cursor.moveToFirst()) {
            do {
                val name = cursor.getString(1)
                val goals = cursor.getInt(4)
                val assists = cursor.getInt(5)
                val matches = cursor.getInt(6)
                statsList.add("$name ⚽$goals 🎯$assists 🏟️$matches")
            } while(cursor.moveToNext())
        }
        adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, statsList)
        listView.adapter = adapter
    }
}package com.siksat

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, "siksat.db", null, 1) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("CREATE TABLE players(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, position TEXT, number INTEGER, goals INTEGER DEFAULT 0, assists INTEGER DEFAULT 0, matches INTEGER DEFAULT 0, cleanSheets INTEGER DEFAULT 0)")
        db.execSQL("CREATE TABLE matches(id INTEGER PRIMARY KEY AUTOINCREMENT, opponent TEXT, date TEXT, teamGoals INTEGER, opponentGoals INTEGER)")
        db.execSQL("CREATE TABLE formation(id INTEGER PRIMARY KEY AUTOINCREMENT, matchId INTEGER, playerId INTEGER, position TEXT)")
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS players")
        db.execSQL("DROP TABLE IF EXISTS matches")
        db.execSQL("DROP TABLE IF EXISTS formation")
        onCreate(db)
    }
}<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:padding="16dp"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/btnAddPlayer"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="إضافة لاعب"/>

    <ListView
        android:id="@+id/listPlayers"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</LinearLayout>package com.siksat

import android.graphics.Color
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout

class FormationActivity : AppCompatActivity() {

    lateinit var db: DatabaseHelper
    lateinit var fieldLayout: ConstraintLayout
    val playerViews = ArrayList<TextView>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_formation)

        db = DatabaseHelper(this)
        fieldLayout = findViewById(R.id.fieldLayout)

        // إنشاء 7 لاعبين
        for (i in 1..7) {
            val player = TextView(this)
            player.text = "⚽$i"
            player.setBackgroundColor(Color.parseColor("#00FF00"))
            player.setTextColor(Color.BLACK)
            player.textAlignment = View.TEXT_ALIGNMENT_CENTER
            player.width = 150
            player.height = 150
            player.x = 50f * i
            player.y = 50f * i
            fieldLayout.addView(player)
            playerViews.add(player)

            player.setOnTouchListener(object : View.OnTouchListener {
                var dX = 0f
                var dY = 0f
                override fun onTouch(v: View, event: MotionEvent): Boolean {
                    when (event.action) {
                        MotionEvent.ACTION_DOWN -> {
                            dX = v.x - event.rawX
                            dY = v.y - event.rawY
                        }
                        MotionEvent.ACTION_MOVE -> {
                            v.animate()
                                .x(event.rawX + dX)
                                .y(event.rawY + dY)
                                .setDuration(0)
                                .start()
                        }
                    }
                    return true
                }
            })
        }

        val btnSave: Button = findViewById(R.id.btnSetFormation)
        btnSave.setOnClickListener {
            Toast.makeText(this, "تم حفظ التشكيلة", Toast.LENGTH_SHORT).show()
            // يمكن إضافة حفظ الإحداثيات في DB لاحقًا
        }
    }
}<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/fieldLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#006400">

    <Button
        android:id="@+id/btnSetFormation"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="حفظ التشكيلة"
        android:layout_alignParentBottom="true"
        android:layout_centerHorizontal="true"
        android:layout_marginBottom="16dp"/>

</RelativeLayout>package com.siksat

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<Button>(R.id.btnPlayers).setOnClickListener {
            startActivity(Intent(this, PlayersActivity::class.java))
        }
        findViewById<Button>(R.id.btnMatches).setOnClickListener {
            startActivity(Intent(this, MatchesActivity::class.java))
        }
        findViewById<Button>(R.id.btnFormation).setOnClickListener {
            startActivity(Intent(this, FormationActivity::class.java))
        }
        findViewById<Button>(R.id.btnStats).setOnClickListener {
            startActivity(Intent(this, StatsActivity::class.java))
        }
    }
}
