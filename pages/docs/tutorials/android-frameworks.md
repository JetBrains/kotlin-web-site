---
type: tutorial
layout: tutorial
title:  "Android Frameworks Using Annotation Processing"
description: "This tutorial describes how to use in Kotlin popular Android frameworks and libraries that rely on annotation processing."
authors: Svetlana Isakova
showAuthorInfo: false
source:
---

The Android world has many popular frameworks simplifying development.
You can use the same frameworks if you develop in Kotlin, often as easily as you'd do that in Java. 
This tutorial provides examples and highlights the differences in settings.

We'll look at [Dagger](android-frameworks.html#dagger), [Butterknife](android-frameworks.html#butterknife), [Data Binding](android-frameworks.html#data-binding), [Auto-parcel](android-frameworks.html#auto-parcel) and [DBFlow](android-frameworks.html#dbflow) (other frameworks can be set up similarly).
All these frameworks work through annotation processing: you annotate the code to have the boiler-plate code generated for you.
Annotations allow to hide all the verbosity and keep your code simple, and if you need to understand what actually happens at runtime, you can look at the generated code.
Note that all these frameworks generate source code in Java, not Kotlin.

In Kotlin you specify the dependencies in a similar to Java way using [Kotlin Annotation processing tool](/docs/reference/kapt.html) (`kapt`) instead of `annotationProcessor`.


### Dagger

[Dagger](https://google.github.io/dagger//) is a dependency injection framework.
If you're not familiar with it yet, you can read its [user's guide](https://google.github.io/dagger//users-guide.html).
We've converted [the coffee example](https://github.com/google/dagger/tree/master/examples/simple) 
described in this guide into Kotlin, and you can find the result [here](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/kotlin-dagger). 
The Kotlin code looks pretty much the same; you can browse the whole example in one [file](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/kotlin-dagger/src/main/kotlin/Coffee.kt).

As in Java, you use `@Inject` to annotate the constructor used by Dagger to create instances of a class.
Kotlin has a short syntax for declaring a property and a constructor parameter at the same time.
To annotate the constructor, use the `constructor` keyword explicitly and put the `@Inject` annotation before it:

```kotlin
class Thermosiphon 
@Inject constructor(
        private val heater: Heater
) : Pump {
    // ...
}    
```

Annotating methods looks absolutely the same. 
In the example below `@Binds` determines that a `Thermosiphon` object is used whenever a `Pump` is required, `@Provides` specifies the way to build a `Heater`, and `@Singleton` says that the same `Heater` should be used all over the place:

```kotlin
@Module
abstract class PumpModule {
    @Binds
    abstract fun providePump(pump: Thermosiphon): Pump
}

@Module(includes = arrayOf(PumpModule::class))
class DripCoffeeModule {
    @Provides @Singleton
    fun provideHeater(): Heater = ElectricHeater()
}
```

`@Module`-annotated classes define how to provide different objects.
Note that when you pass an annotation argument as a vararg argument, you have to explicitly wrap it into `arrayOf`, like in `@Module(includes = arrayOf(PumpModule::class))` above.

To have a dependency-injected implementation generated for the type, annotate it with `@Component`.
The generated class will have the name of this type prepended with Dagger, like `DaggerCoffeeShop` below:

```kotlin
@Singleton
@Component(modules = arrayOf(DripCoffeeModule::class))
interface CoffeeShop {
    fun maker(): CoffeeMaker
}

fun main(args: Array<String>) {
    val coffee = DaggerCoffeeShop.builder().build()
    coffee.maker().brew()
}
``` 

Dagger generates an implementation of `CoffeeShop` that allows you to get a fully-injected `CoffeeMaker`.
You can navigate and see the implementation of `DaggerCoffeeShop` if you open the project in IDE.

We observed that annotating your code almost hasn't changed when you switched to Kotlin.
Now let's see what changes should be made to the build script.

In Java you specify `Dagger` as `annotationProcessor` (or `apt`) dependency:

``` groovy
dependencies {
  ...
  annotationProcessor "com.google.dagger:dagger-compiler:$dagger-version"
}
```

In Kotlin you have to add the `kotlin-kapt` plugin to enable `kapt`, and then replace `annotationProcessor` with `kapt`:

``` groovy
apply plugin: 'kotlin-kapt'
dependencies {
    ...
    kapt "com.google.dagger:dagger-compiler:$dagger-version"
}
```

That's all!
Note that `kapt` takes care of your Java files as well, so you don't need to keep the `annotationProcessor` dependency.

The full build script for the sample project can be found [here](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/kotlin-dagger/build.gradle).
You can also look at the converted code for [the Android sample](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-dagger).


### ButterKnife

[ButterKnife](http://jakewharton.github.io/butterknife/) allows to bind views to fields directly instead of calling `findViewById`. 

Note that [Kotlin Android Extensions](https://kotlinlang.org/docs/tutorials/android-plugin.html) plugin (automatically bundled into the Kotlin plugin in Android Studio) solves the same issue: replacing `findViewById` with a concise and straightforward code.
Consider using it unless you're already using ButterKnife and don't want to migrate.
 
You use `ButterKnife` with Kotlin in the same way as you use it with Java.
Let's see first the changes in the Gradle build script, and then highlight some of the differences in the code.
 
In the Gradle dependencies you use add the `kotlin-kapt` plugin and replace `annotationProcessor` with `kapt`:

``` groovy
apply plugin: 'kotlin-kapt'

dependencies {
    ...
    compile "com.jakewharton:butterknife:$butterknife-version"
    kapt "com.jakewharton:butterknife-compiler:$butterknife-version"
}
```

We've converted the ButterKnife [sample](https://github.com/JakeWharton/butterknife/tree/master/sample/app/src/main/java/com/example) to Kotlin.
The resulting code can be found [here](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-butterknife).

Let's look over it to spot what has changed.
In Java you annotated the field, binding it with the corresponding view:
 
``` java 
@BindView(R2.id.title) TextView title;
```

In Kotlin you can't work with fields directly, you work with [properties](/docs/reference/properties.html). 
You annotate the property:

``` kotlin
@BindView(R2.id.title)
lateinit var title: TextView
```
The `@BindView` annotation is defined to be applied to the fields only, but the Kotlin compiler understands that and annotates the corresponding field under the hood when you apply the annotation to the whole property.

Note how [the lateinit modifier](/docs/reference/properties.html#late-initialized-properties-and-variables) allows to declare a non-null type initialized after the object is created (after the constructor call).
Without `lateinit` you'd have to declare a [nullable type](/docs/reference/null-safety.html) and add additional nullability checks.
 
You can also configure methods as listeners, using ButterKnife annotations:

``` java
@OnClick(R2.id.hello)
internal fun sayHello() {
    Toast.makeText(this, "Hello, views!", LENGTH_SHORT).show()
}
```

This code specifies an action to be performed on the "hello" button click.
Note that with lambdas this code looks rather concise written directly in Kotlin:

``` kotlin
hello.setOnClickListener {
    toast("Hello, views!")
}
```

The `toast` function is defined in the [Anko](https://github.com/Kotlin/anko) library.

### Data Binding

The [Data Binding Library](https://developer.android.com/topic/libraries/data-binding/index.html) allows you to bind your application data to the layouts in a concise way.

You enable the library using the same configuration as in Java:

``` groovy
android {
    ...
    dataBinding {
        enabled = true
    }
}
```

To make it work with Kotlin classes add the `kapt` dependency: 

``` groovy
apply plugin: 'kotlin-kapt'
dependencies {
    kapt "com.android.databinding:compiler:$android_plugin_version"
}  
```

When you switch to Kotlin, your xml layout files don't change at all.
For instance, you use `variable` within `data` to describe a variable that may be used within the layout.
You can declare a variable of a Kotlin type:
 
```xml
<data>
    <variable name="data" type="org.example.kotlin.databinding.WeatherData"/>
</data>
``` 

You use the `@{}` syntax for writing expressions, which can now refer Kotlin [properties](/docs/reference/properties.html): 

```xml
<ImageView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@{data.imageUrl}"
    android:contentDescription="@string/image" />
```

Note that the databinding expression language uses the same syntax for referring to properties as Kotlin: `data.imageUrl`.
In Kotlin you can write `v.prop` instead of `v.getProp()` even if `getProp()` is a Java method.
Similarly, instead of calling a setter directly, you may use an assignment:
  
```kotlin
class MainActivity : AppCompatActivity() {
    // ...
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding: ActivityMainBinding =
                DataBindingUtil.setContentView(this, R.layout.activity_main)

        binding.data = weather
        // the same as
        // binding.setData(weather)
    }
}
```

You can bind a listener to run an action when a specific event happens:

```xml
<Button
    android:text="@string/next"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:onClick="startOtherActivity" />
```

Here `startOtherActivity` is a method defined in our `MainActivity`:

```kotlin
class MainActivity : AppCompatActivity() {
    // ...
    fun startOtherActivity(view: View) = startActivity<OtherActivity>()
}
```

This example uses the utility function `startActivity` creating an intent with no data and starting a new activity, which comes from the [Anko](https://github.com/Kotlin/anko) library.
To pass some data, you can say `startActivity<OtherActivity>("KEY" to "VALUE")`.

Note that instead of declaring lambdas in xml like in the following example, you can can bind actions directly in the code: 

```xml
<Button 
    android:layout_width="wrap_content" 
    android:layout_height="wrap_content"
    android:onClick="@{() -> presenter.onSaveClick(task)}" />
```          

``` kotlin
// the same logic written in Kotlin code
button.setOnClickListener { presenter.onSaveClick(task) }
```

In the last line `button` is referenced by `id` using the [Kotlin Android Extensions](https://kotlinlang.org/docs/tutorials/android-plugin.html) plugin. 
Consider using this plugin as an alternative which allows you to keep binding logic in code and have the concise syntax at the same time.    

You can find an example project [here](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-databinding).

### DBFlow

[DBFlow](https://github.com/Raizlabs/DBFlow) is a SQLite library that simplifies interaction with databases.
It heavily relies on annotation processing.

To use it with Kotlin configure annotation processing dependency using `kapt`:

``` kotlin
apply plugin: 'kotlin-kapt'

dependencies {
    kapt "com.github.raizlabs.dbflow:dbflow-processor:$dbflow_version"
    compile "com.github.raizlabs.dbflow:dbflow-core:$dbflow_version"
    compile "com.github.raizlabs.dbflow:dbflow:$dbflow_version"
}
```

[Here](https://agrosner.gitbooks.io/dbflow/content/including-in-project.html) is a detailed guide how to configure DBFlow.

If your application already uses DBFlow, you can safely introduce Kotlin into your project. 
You can gradually convert existing code to Kotlin (ensuring that everything compiles along the way).
The converted code doesn't differ much from Java. 
For instance, declaring a table looks similar to Java with the small difference that default values for properties must be specified explicitly:
 
``` kotlin 
@Table(name="users", database = AppDatabase::class)
class User : BaseModel() {

    @PrimaryKey(autoincrement = true)
    @Column(name = "id")
    var id: Long = 0

    @Column
    var name: String? = null
}
``` 

Besides converting existing functionality to Kotlin, you can also enjoy the Kotlin specific support.
For instance, you can declare tables as [data classes](/docs/reference/data-classes.html):

``` kotlin
@Table(database = KotlinDatabase::class)
data class User(@PrimaryKey var id: Long = 0, @Column var name: String? = null)
```

DBFlow defines a bunch of extensions to make its usage in Kotlin more idiomatic, which you can include in your dependencies:

``` kotlin
dependencies {
    compile "com.github.raizlabs.dbflow:dbflow-kotlinextensions:$dbflow_version"
}
```

That gives you a way to express queries via C#-like LINQ syntax, use lambdas to write much simpler code for asynchronous computations, and more.
Read all the details [here](https://agrosner.gitbooks.io/dbflow/content/KotlinSupport.html).

You can browse the converted [sample application](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-dbflow).


### Auto-Parcel

[Auto-Parcel](https://github.com/frankiesardo/auto-parcel) allows to generate `Parcelable` values for classes annotated with `@AutoValue`.

When you specify the dependency you again use `kapt` as annotation processor to take care of Kotlin files: 
 
``` groovy
apply plugin: 'kotlin-kapt'

dependencies {
    ...
    kapt "frankiesardo:auto-parcel:$latest-version"
}
```

The converted [sample](https://github.com/frankiesardo/auto-parcel/tree/master/sample) can be found [here](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-auto-parcel).

You can annotate Kotlin classes with `@AutoValue`.
Let's look at the converted [`Address`](https://github.com/frankiesardo/auto-parcel/blob/master/sample/src/main/java/model2/Address.java) class for which the `Parcelable` implementation will be generated:

``` kotlin
@AutoValue
abstract class Address : Parcelable {
    abstract fun coordinates(): DoubleArray
    abstract fun cityName(): String

    companion object {
        fun create(coordinates: DoubleArray, cityName: String): Address {
            return builder().coordinates(coordinates).cityName(cityName).build()
        }
        
        fun builder(): Builder = `$AutoValue_Address`.Builder()
    }
    
    @AutoValue.Builder
    interface Builder {
        fun coordinates(x: DoubleArray): Builder
        fun cityName(x: String): Builder
        fun build(): Address
    }
}
```

Kotlin doesn't have `static` methods, so they should be place inside a [`companion object`](/docs/reference/object-declarations.html#companion-objects).
If you still want to use them from Java code, annotate them with [`@JvmStatic`](/docs/reference/java-to-kotlin-interop.html#static-methods).

If you need to access a Java class or method with a name that is not a valid identifier in Kotlin, you can [escape the name](/docs/reference/java-interop.html#escaping-for-java-identifiers-that-are-keywords-in-kotlin) with the  backtick (\`) character, like in accessing the generated class \``$AutoValue_Address`\`.
  
Overall the converted code looks very similar to the original Java code.