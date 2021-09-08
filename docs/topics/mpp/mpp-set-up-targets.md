[//]: # (title: Set up targets manually)

You can add targets when [creating a project with the Project Wizard](mpp-create-lib.md). If you need to add a target 
later, you can do this manually using target presets for [supported platforms](mpp-supported-platforms.md).

Learn more about [additional settings for targets](mpp-dsl-reference.md#common-target-configuration).

```kotlin
kotlin {
    jvm() // Create a JVM target with the default name 'jvm'
        
    linuxX64() {
        /* Specify additional settings for the 'linux' target here */
    }
}
```

Each target can have one or more [compilations](mpp-configure-compilations.md). In addition to default compilations for
test and production purposes, you can [create custom compilations](mpp-configure-compilations.md#create-a-custom-compilation).

## Distinguish several targets for one platform

You can have several targets for one platform in a multiplatform library. For example, these targets can provide the same 
API but use different libraries during runtime, such as testing frameworks and logging solutions. Dependencies on such 
a multiplatform library may fail to resolve because it isn’t clear which target to choose.

To solve this, mark the targets on both the library author and consumer sides with a custom attribute, which Gradle uses 
during dependency resolution.
 
For example, consider a testing library that supports both JUnit and TestNG in the two targets. The library author needs 
to add an attribute to both targets as follows:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val testFrameworkAttribute = Attribute.of("com.example.testFramework", String::class.java)

kotlin {
    jvm("junit") {
        attributes.attribute(testFrameworkAttribute, "junit")
    }
    jvm("testng") {
        attributes.attribute(testFrameworkAttribute, "testng")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
def testFrameworkAttribute = Attribute.of('com.example.testFramework', String)

kotlin {
    jvm('junit') {
        attributes.attribute(testFrameworkAttribute, 'junit')
    }
    jvm('testng') {
        attributes.attribute(testFrameworkAttribute, 'testng')
    }
}
```

</tab>
</tabs>

The consumer has to add the attribute to a single target where the ambiguity arises.