---
type: tutorial
layout: tutorial
title:  "Kotlin Android Extensions"
description: "This tutorial describes how to use Kotlin Android Extensions to improve support for Android development"
authors: Yan Zhulanow
showAuthorInfo: true
date: 2015-03-18
source:
---
In this tutorial we'll walk through the steps required to use the Kotlin Android Extensions plugin, enhancing the development experience with Android.

### Background

Every Android developer knows well the `findViewById()` function. It is, without a doubt, a source of potential bugs and nasty code which is hard to read and support.
While there are several libraries available that provide solutions to this problem, being libraries dependent on runtime, they require annotating fields for each `View`.

The Kotlin Android Extensions plugin allows us to obtain the same experience we have with some of these libraries, without having to add any extra code or shipping any additional runtime.

In essence, this would allow for the following code:

``` kotlin
// Using R.layout.main
import kotlinx.android.synthetic.main.*

public class MyActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main)
        textView.setText("Hello, world!") // Instead of findView(R.id.textView) as TextView
    }
}
```

`textView` is an extension property for `Activity`, and it has the same type as declared in `main.xml`.

### Using Kotlin Android Extensions

#### Configuring the dependency

{{ site.text_using_gradle }}

The IDE [plugin](https://plugins.jetbrains.com/plugin?pluginId=7717) is available for both IntelliJ IDEA (Ultimate and Community Editions) as well as Android Studio.

Also, we need to add a buildscript dependency called `kotlin-android-extensions` to the application build file (usually `app/build.gradle`):

``` groovy
buildscript {
    dependencies {
        classpath 'org.jetbrains.kotlin:kotlin-android-extensions:<version>'
    }
}
```

A plugin for Gradle is available on Maven Central.

#### Importing synthetic properties

It is convenient to import all widget properties for a specific layout in one go:

``` kotlin
import kotlinx.android.synthetic.<layout>.*
```

Thus if the layout filename is `main.xml`, we'd import `kotlinx.android.synthetic.main.*`.

If we want to call the synthetic properties on `View` (useful in adapter classes), we should also import `kotlinx.android.synthetic.main.view.*`.

Once we do that, we can then invoke the corresponding extensions, which are properties named after the views in the XML file. 
For example, for this view:

``` xml
    <TextView
            android:id="@+id/hello"
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:text="Hello World, MyActivity"
            />
```

There will be property named `hello`:

``` kotlin
activity.hello.setText("Hi!")
```



### Under the hood

Kotlin Android Extensions is a plugin for the Kotlin compiler, and it does two things:

1. Adds a hidden caching function and a field inside each Kotlin `Activity`. The method is pretty small so it doesn't increase the size of APK much.
2. Replaces each synthetic property call with a function call.

How this works is that when invoking a synthetic property, where the receiver is a Kotlin Activity/Fragment class that is in module sources, the caching function is invoked.
For instance, given

``` kotlin
class MyActivity: Activity()
fun MyActivity.a() { 
    this.textView.setText(“”) 
}
```

a hidden caching function is generated inside MyActivity, so we can use the caching mechanism.

However in the following case:

``` kotlin
fun Activity.b() { 
    this.textView.setText(“”)     
}
```

We wouldn't know if this function would be invoked on only Activities from our sources or on plain Java Activities also. As such, we don’t use caching there, even
if MyActivity instance from the previous example is the receiver.
