---
type: tutorial
layout: tutorial
title:  "Kotlin Android Extensions"
description: "This tutorial describes how to use Kotlin Android Extensions to improve support for Android development."
authors: Yan Zhulanow
showAuthorInfo: true
source:
---
In this tutorial we'll walk through the steps required to use the Kotlin Android Extensions plugin, enhancing the development experience with Android.

## View Binding

### Background

Every Android developer knows well the `findViewById()` function. It is, without a doubt, a source of potential bugs and nasty code which is hard to read and support. While there are several libraries available that provide solutions to this problem, those libraries require annotating fields for each exposed `View`.

The Kotlin Android Extensions plugin allows us to obtain the same experience we have with some of these libraries, without having to add any extra code.

In essence, this allows for the following code:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
// Using R.layout.activity_main from the 'main' source set
import kotlinx.android.synthetic.main.activity_main.*

class MyActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Instead of findViewById<TextView>(R.id.textView)
        textView.setText("Hello, world!")
    }
}
```
</div>

`textView` is an extension property for `Activity`, and it has the same type as declared in `activity_main.xml` (so it is a `TextView`).


### Using Kotlin Android Extensions

#### Configuring the Dependency

{{ site.text_using_gradle }}

Android Extensions is a part of the Kotlin plugin for IntelliJ IDEA and Android Studio. You do not need to install additional plugins.

All you need is to enable the Android Extensions Gradle plugin in your module's `build.gradle` file:

<div class="sample" markdown="1" theme="idea" mode="groovy">
```groovy
apply plugin: 'kotlin-android-extensions'
```
</div>

#### Importing synthetic properties

It is convenient to import all widget properties for a specific layout in one go:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import kotlinx.android.synthetic.main.<layout>.*
```
</div>

Thus if the layout filename is `activity_main.xml`, we'd import `kotlinx.android.synthetic.main.activity_main.*`.

If we want to call the synthetic properties on `View`, we should also import `kotlinx.android.synthetic.main.activity_main.view.*`.

Once we do that, we can then invoke the corresponding extensions, which are properties named after the views in the XML file. For example, for this view:

<div class="sample" markdown="1" theme="idea" mode="xml">
```xml
<TextView
    android:id="@+id/hello"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"/>
```
</div>

There will be a property named `hello`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
activity.hello.text = "Hello World!"
```
</div>


### Experimental Mode

Android Extensions plugin includes several experimental features such as `LayoutContainer` support and a `Parcelable` implementation generator. These features are not considered production ready yet, so you need to turn on the experimental mode in `build.gradle` in order to use them:

<div class="sample" markdown="1" theme="idea" mode="groovy">
```groovy
androidExtensions {
    experimental = true
}
```
</div>


### `LayoutContainer` Support

Android Extensions plugin supports different kinds of containers. The most basic ones are [`Activity`](https://developer.android.com/reference/android/app/Activity.html), [`Fragment`](https://developer.android.com/reference/android/support/v4/app/Fragment.html) and [`View`](https://developer.android.com/reference/android/view/View.html), but you can turn (virtually) any class to an Android Extensions container by implementing the `LayoutContainer` interface, e.g.:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import kotlinx.android.extensions.LayoutContainer

class ViewHolder(override val containerView: View) : ViewHolder(containerView), LayoutContainer {
    fun setup(title: String) {
        itemTitle.text = "Hello World!"
    }
}
```
</div>

Note that you need to turn on the [experimental flag](#experimental-mode) to use `LayoutContainer`.


### Flavor Support

Android Extensions plugin supports Android flavors. Suppose you have a flavor named `free` in your `build.gradle` file:

<div class="sample" markdown="1" theme="idea" mode="groovy">
```groovy
android {
    productFlavors {
        free {
            versionName "1.0-free"
        }
    }
}
```
</div>

So you can import all synthetic properties for the `free/res/layout/activity_free.xml` layout by adding this import:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import kotlinx.android.synthetic.free.activity_free.*
```
</div>

In the [experimental mode](#experimental-mode), you can specify any variant name (not only flavor), e.g. `freeDebug` or `freeRelease` will work as well.


### View Caching

Invoking `findViewById()` can be slow, especially in case of huge view hierarchies, so Android Extensions tries to minimize `findViewById()` calls by caching views in containers.

By default, Android Extensions adds a hidden cache function and a storage field to each container ([`Activity`](https://developer.android.com/reference/android/app/Activity.html), [`Fragment`](https://developer.android.com/reference/android/support/v4/app/Fragment.html), [`View`](https://developer.android.com/reference/android/view/View.html) or a `LayoutContainer` implementation) written in Kotlin. The method is pretty small so it does not increase the size of APK much.

In the following example, `findViewById()` is only invoked once:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
class MyActivity : Activity()

fun MyActivity.a() { 
    textView.text = "Hidden view"
    textView.visibility = View.INVISIBLE
}
```
</div>

However in the following case:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun Activity.b() { 
    textView.text = "Hidden view"
    textView.visibility = View.INVISIBLE
}
```
</div>

We wouldn't know if this function would be invoked on only activities from our sources or on plain Java activities also. Because of this, we don’t use caching there, even if `MyActivity` instance from the previous example is passed as a receiver.


### Changing View Caching Strategy

You can change the caching strategy globally or per container. This also requires switching on the [experimental mode](#experimental-mode).

Project-global caching strategy is set in the `build.gradle` file:

<div class="sample" markdown="1" theme="idea" mode="groovy">
```groovy
androidExtensions {
    defaultCacheImplementation = "HASH_MAP" // also SPARSE_ARRAY, NONE
}
```
</div>

By default, Android Extensions plugin uses `HashMap` as a backing storage, but you can switch to the `SparseArray` implementation, or just switch off caching. The latter is especially useful when you use only the [Parcelable](#parcelable) part of Android Extensions.

Also, you can annotate a container with `@ContainerOptions` to change its caching strategy:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
import kotlinx.android.extensions.ContainerOptions

@ContainerOptions(cache = CacheImplementation.NO_CACHE)
class MyActivity : Activity()

fun MyActivity.a() { 
    // findViewById() will be called twice
    textView.text = "Hidden view"
    textView.visibility = View.INVISIBLE
}
```
</div>

## Parcelable

Starting from Kotlin 1.1.4, Android Extensions plugin provides Parcelable implementation generator as an experimental feature.

### Enabling Parcelable support

Apply the `kotlin-android-extensions` Gradle plugin as described [above](#configuring-the-dependency) and [turn on](#experimental-mode) the experimental flag.

### How to use

Annotate the class with `@Parcelize`, and a `Parcelable` implementation will be generated automatically.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import kotlinx.android.parcel.Parcelize

@Parcelize
class User(val firstName: String, val lastName: String, val age: Int): Parcelable
```
</div>

`@Parcelize` requires all serialized properties to be declared in the primary constructor. Android Extensions will issue a warning on each property with a backing field declared in the class body. Also, `@Parcelize` can't be applied if some of the primary constructor parameters are not properties.

If your class requires more advanced serialization logic, you can write it inside a companion class:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@Parcelize
data class User(val firstName: String, val lastName: String, val age: Int) : Parcelable {
    private companion object : Parceler<User> {
        override fun User.write(parcel: Parcel, flags: Int) {
            // Custom write implementation
        }

        override fun create(parcel: Parcel): User {
            // Custom read implementation
        }
    }
}
```
</div>


### Supported Types

`@Parcelize` supports a wide range of types:

- Primitive types (and its boxed versions);
- Objects and enums;
- `String`, `CharSequence`;
- `Exception`;
- `Size`, `SizeF`, `Bundle`, `IBinder`, `IInterface`, `FileDescriptor`;
- `SparseArray`, `SparseIntArray`, `SparseLongArray`, `SparseBooleanArray`;
- All `Serializable` (yes, `Date` is supported too) and `Parcelable` implementations;
- Collections of all supported types: `List` (mapped to `ArrayList`), `Set` (mapped to `LinkedHashSet`), `Map` (mapped to `LinkedHashMap`);
    + Also a number of concrete implementations: `ArrayList`, `LinkedList`, `SortedSet`, `NavigableSet`, `HashSet`, `LinkedHashSet`, `TreeSet`, `SortedMap`, `NavigableMap`, `HashMap`, `LinkedHashMap`, `TreeMap`, `ConcurrentHashMap`;
- Arrays of all supported types;
- Nullable versions of all supported types.


### Custom `Parceler`s

Even if your type is not supported directly, you can write a `Parceler` mapping object for it.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class ExternalClass(val value: Int)

object ExternalClassParceler : Parceler<ExternalClass> {
    override fun create(parcel: Parcel) = ExternalClass(parcel.readInt())

    override fun ExternalClass.write(parcel: Parcel, flags: Int) {
        parcel.writeInt(value)
    }
}
```
</div>

External parcelers can be applied using `@TypeParceler` or `@WriteWith` annotations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
// Class-local parceler
@Parcelize
@TypeParceler<ExternalClass, ExternalClassParceler>()
class MyClass(val external: ExternalClass)

// Property-local parceler
@Parcelize
class MyClass(@TypeParceler<ExternalClass, ExternalClassParceler>() val external: ExternalClass)

// Type-local parceler
@Parcelize
class MyClass(val external: @WriteWith<ExternalClassParceler>() ExternalClass)
```
</div>
