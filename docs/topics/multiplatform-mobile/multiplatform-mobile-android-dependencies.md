[//]: # (title: Adding Android dependencies)

The workflow for adding Android-specific dependencies to a Kotlin Multiplatform module is the same as it is for pure
Android projects: declare the dependency in your Gradle file and import the project. After that, you can use this
dependency in your Kotlin code.

We recommend declaring Android dependencies in Kotlin Multiplatform projects by adding them to a specific Android source
set. For that, update your `build.gradle(.kts)` file in the `shared` directory of your project:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets["androidMain"].dependencies {
    implementation("com.example.android:app-magic:12.3")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    androidMain {
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</tab>
</tabs>

Moving what was a top-level dependency in an Android project to a specific source set in a multiplatform project
might be difficult if the top-level dependency had a non-trivial configuration name. For example, to move
a `debugImplementation` dependency from the top level of an Android project, you'll need to add an implementation
dependency to the source set named `androidDebug`. To minimize the effort you have to put in to deal with migration
problems like this, you can add a `dependencies` block inside the `android` block:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
android {
    //...
    dependencies {
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
android {
    //...
    dependencies {
        implementation 'com.example.android:app-magic:12.3'
    }
}
```

</tab>
</tabs>

Dependencies declared here will be treated exactly the same as dependencies from the top-level block, but declaring them
this way will also separate Android dependencies visually in your build script and make it less confusing.

Putting dependencies into a standalone `dependencies` block at the end of the script, in a way that is idiomatic to
Android projects, is also supported. However, we strongly recommend **against** doing this because configuring a build
script with Android dependencies in the top-level block and other target dependencies in each source set is likely to
cause confusion.

## What's next?

Check out other resources on adding dependencies in multiplatform projects and learn more about:

* [Adding dependencies in the official Android documentation](https://developer.android.com/studio/build/dependencies)
* [Adding dependencies on multiplatform libraries or other multiplatform projects](multiplatform-add-dependencies.md)
* [Adding iOS dependencies](multiplatform-mobile-ios-dependencies.md)