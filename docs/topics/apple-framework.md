[//]: # (title: Kotlin/Native as an Apple framework – tutorial)

Kotlin/Native provides bi-directional interoperability with Objective-C/Swift. 
Objective-C frameworks and libraries can be used in Kotlin code.
Kotlin modules can be used in Swift/Objective-C code too.
Besides that, Kotlin/Native has
[C Interop](native-c-interop.md).
There is also the [Kotlin/Native as a Dynamic Library](native-dynamic-libraries.md)
tutorial for more information.

In this tutorial, you will see how to use Kotlin/Native code from
Objective-C and Swift applications on macOS and iOS.

In this tutorial you'll: 
- [create a Kotlin Library](#create-a-kotlin-library) and compile it to a framework
- examine the generated [Objective-C and Swift API](#generated-framework-headers) code
- use the framework from [Objective-C](#use-the-code-from-objective-c) and [Swift](#use-the-code-from-swift)
- [Configure Xcode](#xcode-and-framework-dependencies) to use the framework for [macOS](#xcode-for-macos-target) and [iOS](#xcode-for-ios-targets)
   
## Create a Kotlin library

The Kotlin/Native compiler can produce a framework for macOS and iOS
out of the Kotlin code. The created framework contains all declarations
and binaries needed to use it with Objective-C and Swift.
The best way to understand the techniques is to try it for ourselves. 
Let's create a tiny Kotlin library first and use it from an Objective-C program.

Create the `hello.kt` file with the library contents:

```kotlin
package example

object Object {
  val field = "A"
}

interface Interface {
  fun iMember() {}
}

class Clazz : Interface {
  fun member(p: Int): ULong? = 42UL
}

fun forIntegers(b: Byte, s: UShort, i: Int, l: ULong?) { }
fun forFloats(f: Float, d: Double?) { }

fun strings(str: String?) : String {
  return "That is '$str' from C"
}

fun acceptFun(f: (String) -> String?) = f("Kotlin/Native rocks!")
fun supplyFun() : (String) -> String? = { "$it is cool!" }
```

While it is possible to use the command line, either directly or
by combining it with a script file (such as `.sh` or `.bat` file), this approach doesn't
scale well for big projects that have hundreds of files and libraries.
It is therefore better to use the Kotlin/Native compiler with a build system, as it
helps to download and cache the Kotlin/Native compiler binaries and libraries with
transitive dependencies and run the compiler and tests.
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin) plugin.

We covered the basics of setting up an IDE compatible project with Gradle in the
[A Basic Kotlin/Native Application](native-gradle.md)
tutorial. Please check it out if you are looking for detailed first steps
and instructions on how to start a new Kotlin/Native project and open it in IntelliJ IDEA.
In this tutorial, we'll look at the advanced C interop related usages of Kotlin/Native and [multiplatform](mpp-discover-project.md#multiplatform-plugin) builds with Gradle.

First, create a project folder. All the paths in this tutorial will be relative to this folder. Sometimes
the missing directories will have to be created before any new files can be added.

Use the following `build.gradle(.kts)` Gradle build file:

<tabs>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      framework {
        baseName = "Demo"
      }
    }
  }
}

wrapper {
  gradleVersion = "%gradleVersion%"
  distributionType = "ALL"
}
```

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      framework {
        baseName = "Demo"
      }
    }
  }
}

tasks.wrapper {
  gradleVersion = "%gradleVersion%"
  distributionType = Wrapper.DistributionType.ALL
}
```

</tabs>

Move the sources file into the `src/nativeMain/kotlin` folder under
the project. That is the default path, where sources are located, when
the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin)
plugin is used. Use the following block to configure the project
to generate a dynamic or shared library: 

```kotlin
binaries {
  framework {
    baseName = "Demo"
  }  
}
```

Along with `macOS X64`, Kotlin/Native supports iOS `arm32`, `arm64` and `X64`
targets. You may replace the `macosX64` with respective functions as shown
in the table:

| Target platform/device | Gradle function |
|------------------------|-----------------|
| macOS x86_64           | `macosX64()`    | 
| iOS ARM 32             | `iosArm32()`    | 
| iOS ARM 64             | `iosArm64()`    | 
| iOS Simulator (x86_64) | `iosX64()`      |

Run the `linkNative` Gradle task to build the library 
[in the IDE](native-get-started.md) 
or by calling the following console command:

```bash
./gradlew linkNative
```

Depending on the variant, the build generates the framework
into the
`build/bin/native/debugFramework`
and
`build/bin/native/releaseFramework`
folders.
Let's see what is inside.

## Generated framework headers

Each of the created frameworks contains the header file in `<Framework>/Headers/Demo.h`.
The headers do not depend on the target platform (at least with Kotlin/Native v.0.9.2).
It contains the definitions for our Kotlin code and a few Kotlin-wide declarations.

>The way Kotlin/Native exports symbols is subject to change without notice.

{type="note"}

### Kotlin/Native runtime declarations

Take a look at Kotlin runtime declarations:

```obj-c
NS_ASSUME_NONNULL_BEGIN

@interface KotlinBase : NSObject
- (instancetype)init __attribute__((unavailable));
+ (instancetype)new __attribute__((unavailable));
+ (void)initialize __attribute__((objc_requires_super));
@end;

@interface KotlinBase (KotlinBaseCopying) <NSCopying>
@end;

__attribute__((objc_runtime_name("KotlinMutableSet")))
__attribute__((swift_name("KotlinMutableSet")))
@interface DemoMutableSet<ObjectType> : NSMutableSet<ObjectType>
@end;

__attribute__((objc_runtime_name("KotlinMutableDictionary")))
__attribute__((swift_name("KotlinMutableDictionary")))
@interface DemoMutableDictionary<KeyType, ObjectType> : NSMutableDictionary<KeyType, ObjectType>
@end;

@interface NSError (NSErrorKotlinException)
@property (readonly) id _Nullable kotlinException;
@end;
```

Kotlin classes have a `KotlinBase` base class in Objective-C, the class extends
the `NSObject` class there. There are also have wrappers for collections and exceptions. 
Most of the collection types are mapped to similar collection types from the other side:

|Kotlin|Swift|Objective-C|
-------|-----|-----------|
|List|Array|NSArray|
|MutableList|NSMutableArray|NSMutableArray|
|Set|Set|NSSet|
|Map|Dictionary|NSDictionary|
|MutableMap|NSMutableDictionary|NSMutableDictionary|

### Kotlin numbers and NSNumber

The next part of the `<Framework>/Headers/Demo.h` contains number type mappings
between Kotlin/Native and `NSNumber`. There is the base class called `DemoNumber` in Objective-C
and `KotlinNumber` in Swift. It extends `NSNumber`.
There are also child classes per Kotlin number type:

|Kotlin|Swift|Objective-C| Simple type |
-------|-----|-----------|
|`-`      |`KotlinNumber` |`<Package>Number` | `-` |
|`Byte`   |`KotlinByte`   |`<Package>Byte`   | `char` |
|`UByte`  |`KotlinUByte`  |`<Package>UByte`  | `unsigned char` |
|`Short`  |`KotlinShort`  |`<Package>Short`  | `short` |
|`UShort` |`KotlinUShort` |`<Package>UShort` | `unsigned short` |
|`Int`    |`KotlinInt`    |`<Package>Int`    | `int` |
|`UInt`   |`KotlinUInt`   |`<Package>UInt`   | `unsigned int` |
|`Long`   |`KotlinLong`   |`<Package>Long`   | `long long` |
|`ULong`  |`KotlinULong`  |`<Package>ULong`  | `unsigned long long` |
|`Float`  |`KotlinFloat`  |`<Package>Float`  | `float` |
|`Double` |`KotlinDouble` |`<Package>Double` | `double` |
|`Boolean`|`KotlinBoolean`|`<Package>Boolean`| `BOOL/Bool` |

Every number type has a class method to create a new instance from the related simple type. Also, there is an instance method
to extract a simple value back. Schematically, declarations look like that:

```obj-c
__attribute__((objc_runtime_name("Kotlin__TYPE__")))
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

Where `__TYPE__` is one of the simple type names and `__CTYPE__` is the related Objective-C type, for example, `initWithChar(char)`.

These types are used to map boxed Kotlin number types into Objective-C and Swift.
In Swift, you may simply call the constructor to create an instance, for example, `KotlinLong(value: 42)`.

### Classes and objects from Kotlin

Let's see how `class` and `object` are mapped to Objective-C and Swift. 
The generated `<Framework>/Headers/Demo.h` file contains the exact definitions for 
`Class`, `Interface`, and `Object`:

```obj-c
NS_ASSUME_NONNULL_BEGIN

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Object")))
@interface DemoObject : KotlinBase
+ (instancetype)alloc __attribute__((unavailable));
+ (instancetype)allocWithZone:(struct _NSZone *)zone __attribute__((unavailable));
+ (instancetype)object __attribute__((swift_name("init()")));
@property (readonly) NSString *field;
@end;

__attribute__((swift_name("Interface")))
@protocol DemoInterface
@required
- (void)iMember __attribute__((swift_name("iMember()")));
@end;

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Clazz")))
@interface DemoClazz : KotlinBase <DemoInterface>
- (instancetype)init __attribute__((swift_name("init()"))) __attribute__((objc_designated_initializer));
+ (instancetype)new __attribute__((availability(swift, unavailable, message="use object initializers instead")));
- (DemoLong * _Nullable)memberP:(int32_t)p __attribute__((swift_name("member(p:)")));
@end;
```

The code is full of Objective-C attributes, which are intended to help
the use of the framework from both Objective-C and Swift languages.
`DemoClazz`, `DemoInterface`, and `DemoObject` are created for `Clazz`, `Interface`, and `Object` 
respectively. The `Interface` is turned into `@protocol`, both a `class` and an `object` are represented as
`@interface`.
The `Demo` prefix comes from the `-output` parameter
of the `kotlinc-native` compiler and the framework name. 
You can see here that the nullable return type `ULong?` is turned into `DemoLong*` in Objective-C.

### Global declarations from Kotlin

All global functions from Kotlin
are turned into `DemoLibKt` in Objective-C and into `LibKt` in Swift, where `Demo` is the framework name and set by
the `-output` parameter of `kotlinc-native`.

```obj-c
NS_ASSUME_NONNULL_BEGIN

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("LibKt")))
@interface DemoLibKt : KotlinBase
+ (void)forIntegersB:(int8_t)b s:(int16_t)s i:(int32_t)i l:(DemoLong * _Nullable)l __attribute__((swift_name("forIntegers(b:s:i:l:)")));
+ (void)forFloatsF:(float)f d:(DemoDouble * _Nullable)d __attribute__((swift_name("forFloats(f:d:)")));
+ (NSString *)stringsStr:(NSString * _Nullable)str __attribute__((swift_name("strings(str:)")));
+ (NSString * _Nullable)acceptFunF:(NSString * _Nullable (^)(NSString *))f __attribute__((swift_name("acceptFun(f:)")));
+ (NSString * _Nullable (^)(NSString *))supplyFun __attribute__((swift_name("supplyFun()")));
@end;
```

You see that Kotlin `String` and Objective-C `NSString*` are mapped transparently.
Similarly, `Unit` type from Kotlin is mapped to `void`. We see primitive types
are mapped directly. Non-nullable primitive types are mapped transparently.
Nullable primitive types are mapped into `Kotlin<TYPE>*` types, as shown in the table [above](#kotlin-numbers-and-nsnumber). 
Both higher order functions `acceptFunF` and `supplyFun` are included,
and accept Objective-C blocks.

More information about all other types mapping details can be found in the
[Objective-C Interop](native-objc-interop.md)
documentation article

## Garbage collection and reference counting

Objective-C and Swift use reference counting. Kotlin/Native has its own garbage collection too.
Kotlin/Native garbage collection is integrated with Objective-C/Swift reference
counting. You do not need to use anything special to control the lifetime of Kotlin/Native instances
from Swift or Objective-C.

## Use the code from Objective-C

Let's call the framework from Objective-C. For that, create the `main.m` file with 
the following content:

```obj-c 
#import <Foundation/Foundation.h>
#import <Demo/Demo.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        [[DemoObject object] field];
        
        DemoClazz* clazz = [[ DemoClazz alloc] init];
        [clazz memberP:42];
        
        [DemoLibKt forIntegersB:1 s:1 i:3 l:[DemoULong numberWithUnsignedLongLong:4]];
        [DemoLibKt forIntegersB:1 s:1 i:3 l:nil];
        
        [DemoLibKt forFloatsF:2.71 d:[DemoDouble numberWithDouble:2.71]];
        [DemoLibKt forFloatsF:2.71 d:nil];
        
        NSString* ret = [DemoLibKt acceptFunF:^NSString * _Nullable(NSString * it) {
            return [it stringByAppendingString:@" Kotlin is fun"];
        }];
        
        NSLog(@"%@", ret);
        return 0;
    }
}
```

Here you call Kotlin classes directly from Objective-C code. A Kotlin `object` has the class method 
function `object`, which allows us to get the only instance of the object and to call 
`Object` methods on it. 
The widespread pattern is used to create an instance of the `Clazz` class. You call
the `[[ DemoClazz alloc] init]` on Objective-C. You may also use `[DemoClazz new]`
for constructors without parameters.
Global declarations from the Kotlin sources are scoped under the `DemoLibKt` class in Objective-C.
All methods are turned into class methods of that class.
The `strings` function is turned into `DemoLibKt.stringsStr` function in Objective-C, you can
pass `NSString` directly to it. The return is visible as `NSString` too.

## Use the code from Swift

The framework that you compiled with Kotlin/Native has helper attributes to make it
easier to use with Swift. Convert the previous Objective-C example
into Swift. As a result, you'll have the following code in `main.swift`:

```swift
import Foundation
import Demo

let kotlinObject = Object()
assert(kotlinObject === Object(), "Kotlin object has only one instance")

let field = Object().field

let clazz = Clazz()
clazz.member(p: 42)

LibKt.forIntegers(b: 1, s: 2, i: 3, l: 4)
LibKt.forFloats(f: 2.71, d: nil)

let ret = LibKt.acceptFun { "\($0) Kotlin is fun" }
if (ret != nil) {
  print(ret!)
}
``` 

The Kotlin code is turned into very similar looking
code in Swift. There are some small differences, though. In Kotlin any `object` has 
only one instance. Kotlin `object Object` now has a
constructor in Swift, and we use the `Object()` syntax to access the only instance of it.
The instance is always the same in Swift, so that 
`Object() === Object()` is true. 
Methods and property names are translated as-is. Kotlin `String` is turned into Swift `String` too.
Swift hides `NSNumber*` boxing from us too. We can pass a Swift closure to Kotlin and call a Kotlin 
lambda function from Swift too. 

More documentation on the types mapping can be found in the 
[Objective-C Interop](native-objc-interop.md)
article.

## Xcode and framework dependencies

You need to configure an Xcode project to use our framework. The configuration depends on the
target platform. 

### Xcode for macOS target

First, in the **General** tab of the **target** configuration, under the 
**Linked Frameworks and Libraries** section, you need to include our framework. This will 
make Xcode look at our framework and resolve imports both
from Objective-C and Swift.

The second step is to configure the framework search path of the produced
binary. It is also known as `rpath` or [run-time search path](https://en.wikipedia.org/wiki/Rpath).
The binary uses the path to look for the required frameworks. We do not recommend
installing additional frameworks to the OS if it is not needed. You should understand the layout
of your future application, for example, 
you may have the `Frameworks` folder under the application bundle with all the frameworks you use. 
The `@rpath` parameter can be configured in Xcode. You need to open
the **project** configuration and find the **Runpath Search Paths** section. Here you specify
the relative path to the compiled framework.

### Xcode for iOS targets

First, you need to include the compiled framework in the Xcode project. To do
this, add the framework to the **Frameworks, Libraries, and Embedded Content** section of the **General** 
tab of the **target** configuration page. 

The second step is to then include the framework path into the **Framework Search Paths** section
of the **Build Settings** tab of the **target** configuration page. It is possible to use the `$(PROJECT_DIR)`
macro to simplify the setup.
 
The iOS simulator requires a framework compiled for the `ios_x64` target, the `iOS_sim` folder
in our case.

[This Stackoverflow thread](https://stackoverflow.com/questions/30963294/creating-ios-osx-frameworks-is-it-necessary-to-codesign-them-before-distributin)
contains a few more recommendations. Also, the
[CocoaPods](https://cocoapods.org/) package manager may be helpful to automate the process too.

# Next steps

Kotlin/Native has bidirectional interop with Objective-C and Swift languages. 
Kotlin objects integrate with Objective-C/Swift reference counting. Unused Kotlin
objects are automatically removed. 
The [Objective-C Interop](native-objc-interop.md)
article contains more information on the interop implementation details.
Of course, it is possible to import an existing framework and use it from Kotlin. Kotlin/Native
comes with a good set of pre-imported system frameworks.

Kotlin/Native supports C interop too. Check out the
[Kotlin/Native as a Dynamic Library](native-dynamic-libraries.md)
tutorial for that.
