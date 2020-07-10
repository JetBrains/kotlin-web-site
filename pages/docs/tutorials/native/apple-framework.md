---
type: tutorial
layout: tutorial
title:  "Kotlin/Native as an Apple Framework"
description: "Compiling Kotlin/Native code and use it from Objective-C and Swift"
authors: Eugene Petrenko
date: 2019-04-15
showAuthorInfo: false
issue: EVAN-5132
---

Kotlin/Native provides bi-directional interoperability with Objective-C/Swift. 
Objective-C frameworks and libraries can be used in Kotlin code.
Kotlin modules can be used in Swift/Objective-C code too.
Besides that, Kotlin/Native has
[C Interop](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md).
There is also the [Kotlin/Native as a Dynamic Library](dynamic-libraries.html)
tutorial for more information.

In this tutorial, we will look at how to use Kotlin/Native code from
Objective-C and Swift applications on macOS and iOS.
We will build a framework from Kotlin code.

In this tutorial we'll: 
- [create a Kotlin Library](#creating-a-kotlin-library) and compile it to a framework
- examine the generated [Objective-C and Swift API](#generated-framework-headers) code
- use the framework from [Objective-C](#using-the-code-from-objective-c) and [Swift](#using-the-code-from-swift)
- [Configure Xcode](#xcode-and-framework-dependencies) to use the framework for [macOS](#xcode-for-macos-target) and [iOS](#xcode-for-ios-targets)
   
## Creating a Kotlin Library

Kotlin/Native compiler can produce a framework for macOS and iOS
out of the Kotlin code. The created framework contains all declarations
and binaries needed to use it with Objective-C and Swift.
The best way to understand the techniques is to try it for ourselves. 
Let's create a tiny Kotlin library first and use it from an Objective-C program.

We create the `hello.kt` file with the library contents:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>


[[include pages-includes/docs/tutorials/native/lets-create-gradle-build.md]]
[[include pages-includes/docs/tutorials/native/apple-framework-code.md]]

The prepared project sources can be directly downloaded from 
[[include pages-includes/docs/tutorials/native/apple-framework-link.md]]

Let's move the sources file into the `src/nativeMain/kotlin` folder under
the project. That is the default path, where sources are located, when
the [kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html)
plugin is used. We use the following block to instruct configure the project
to generate a dynamic or shared library for us: 

<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
binaries {
  framework {
    baseName = "Demo"
  }  
}
```
</div>

Along with `macOS X64`, Kotlin/Native supports iOS `arm32`, `arm64` and `X64`
targets. We may replace the `macosX64` with respective functions as shown
in the table:

| Target platform/device | Gradle function |
|------------------------|-----------------|
| macOS x86_64           | `macosX64()`    | 
| iOS ARM 32             | `iosArm32()`    | 
| iOS ARM 64             | `iosArm64()`    | 
| iOS Simulator (x86_64) | `iosX64()`      |
{:.zebra}
 
Let's run the `linkNative` Gradle task to build the library 
[in the IDE](using-intellij-idea.html) 
or by calling the following console command:
[[include pages-includes/docs/tutorials/native/linkNative.md]]

Depending on the variant, the build generates the framework
into the
`build/bin/native/debugFramework`
and
`build/bin/native/releaseFramework`
folders.
Let's see what is inside

## Generated Framework Headers

Each of the created frameworks contains the header file in `<Framework>/Headers/Demo.h`.
The headers do not depend on the target platform (at least with Kotlin/Native v.0.9.2).
It contains the definitions for our Kotlin code and a few Kotlin-wide declarations.

Note, the way Kotlin/Native exports symbols is subject to change without notice.

### Kotlin/Native Runtime Declarations

Let's
take a look at Kotlin runtime declarations first:

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only auto-indent="false">

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
</div>

Kotlin classes have a `KotlinBase` base class in Objective-C, the class extends
the `NSObject` class there. We also have wrappers for collections and exceptions. 
Most of the collection types are mapped to similar collection types from the other side:

|Kotlin|Swift|Objective-C|
-------|-----|-----------|
|List|Array|NSArray|
|MutableList|NSMutableArray|NSMutableArray|
|Set|Set|NSSet|
|Map|Dictionary|NSDictionary|
|MutableMap|NSMutableDictionary|NSMutableDictionary|
{:.wide.zebra}


### Kotlin Numbers and NSNumber

The next part of the `<Framework>/Headers/Demo.h` contains number type mappings
between Kotlin/Native and `NSNumber`. We have the base class called `DemoNumber` in Objective-C
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
{:.wide.zebra}

Every number type has a class method to create a new instance from the related simple type. Also, there is an instance method
to extract a simple value back. Schematically, declarations look like that:

<div clacss="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only auto-indent="false">

```obj-c
__attribute__((objc_runtime_name("Kotlin__TYPE__")))
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

</div>
Where `__TYPE__` is one of the simple type names and `__CTYPE__` is the related Objective-C type, e.g. `initWithChar(char)`.

These types are used to map boxed Kotlin number types into Objective-C and Swift.
In Swift, we may simply call the constructor to create an instance, e.g. `KotlinLong(value: 42)`.

### Classes and Objects from Kotlin

Let's see how `class` and `object` are mapped to Objective-C and Swift. 
The generated `<Framework>/Headers/Demo.h` file contains the exact definitions for 
`Class`, `Interface`, and `Object`:

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

The code is full of Objective-C attributes, which are intended to help
the use of the framework from both Objective-C and Swift languages.
`DemoClazz`, `DemoInterface`, and `DemoObject` are created for `Clazz`, `Interface`, and `Object` 
respectively. The `Interface` is turned into `@protocol`, both a `class` and an `object` are represented as
`@interface`.
The `Demo` prefix comes from the `-output` parameter
of the `kotlinc-native` compiler and the framework name. 
We see here that the nullable return type `ULong?` is turned into `DemoLong*` in Objective-C.

### Global Declarations from Kotlin

All global functions from Kotlin
are turned into `DemoLibKt` in Objective-C and into `LibKt` in Swift, where `Demo` is the framework name and set by
the `-output` parameter of `kotlinc-native`.

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

We see that Kotlin `String` and Objective-C `NSString*` are mapped transparently.
Similarly, `Unit` type from Kotlin is mapped to `void`. We see primitive types
are mapped directly. Non-nullable primitive types are mapped transparently.
Nullable primitive types are mapped into `Kotlin<TYPE>*` types, as shown in the table [above](#kotlin-numbers-and-nsnumber). 
Both higher order functions `acceptFunF` and `supplyFun` are included,
and accept Objective-C blocks.

More information about all other types mapping details can be found in the
[Objective-C Interop](/docs/reference/native/objc_interop.html)
documentation article

## Garbage Collection and Reference Counting

Objective-C and Swift use reference counting. Kotlin/Native has its own garbage collection too.
Kotlin/Native garbage collection is integrated with Objective-C/Swift reference
counting. We do not need to use anything special to control the lifetime of Kotlin/Native instances
from Swift or Objective-C.

## Using the Code from Objective-C

Let's call the framework from Objective-C. For that we create the `main.m` file with 
the following content:

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

We call Kotlin classes directly from Objective-C code. A Kotlin `object` has the class method 
function `object`, which allows us to get the only instance of the object and to call 
`Object` methods on it. 
The widespread pattern is used to create an instance of the `Clazz` class. We call
the `[[ DemoClazz alloc] init]` on Objective-C. We may also use `[DemoClazz new]`
for constructors without parameters.
Global declarations from the Kotlin sources are scoped under the `DemoLibKt` class in Objective-C.
All methods are turned into class methods of that class.
The `strings` function is turned into `DemoLibKt.stringsStr` function in Objective-C, we can
pass `NSString` directly to it. The return is visible as `NSString` too.

## Using the Code from Swift

The framework that we compiled with Kotlin/Native has helper attributes to make it
easier to use with Swift. Let's convert the previous Objective-C example
into Swift. As a result, we'll have the following code in `main.swift`:

<div class="sample" markdown="1" mode="swift" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

The Kotlin code is turned into very similar looking
code in Swift. There are some small differences, though. In Kotlin any `object` has 
only one instance. Kotlin `object Object` now has a
constructor in Swift, and we use the `Object()` syntax to access the only instance of it.
The instance is always the same in Swift, so that 
`Object() === Object()` is true. 
Methods and property names are translated as-is. Kotlin `String` is turned into Swift `String` too.
Swift hides `NSNumber*` boxing from us too. We pass Swift closure to Kotlin and call a Kotlin 
lambda function from Swift too. 

More documentation on the types mapping can be found in the 
[Objective-C Interop](/docs/reference/native/objc_interop.html)
article.

# Xcode and Framework Dependencies

We need to configure an Xcode project to use our framework. The configuration depends on the
target platform. 

## Xcode for MacOS Target

First, we need to include the framework in the `General` section of the *target*
configuration. There is the `Linked Frameworks and Libraries` section to include
our framework. This will make Xcode look at our framework and resolve imports both
from Objective-C and Swift.

The second step is to configure the framework search path of the produced
binary. It is also known as `rpath` or [run-time search path](https://en.wikipedia.org/wiki/Rpath).
The binary uses the path to look for the required frameworks. We do not recommend
installing additional frameworks to the OS if it is not needed. We should understand the layout
of our future application, for example, 
we may have the `Frameworks` folder under the application bundle with all the frameworks we use. 
The `@rpath` parameter can be configured in Xcode. We need to open
the *project* configuration and find the `Runpath Search Paths` section. Here we specify
the relative path to the compiled framework.

## Xcode for iOS Targets

First, we need to include the compiled framework into the Xcode project. For
this we add the framework to the `Embedded Binaries` block of the `General` section of
the *target* configuration page. 

The second step is to then include the framework path into the `Framework Search Paths` block
of the `Build Settings` section of the *target* configuration page. It is possible to use `$(PROJECT_DIR)`
macro to simplify the setup.
 
The iOS simulator requires a framework compiled for the `ios_x64` target, the `iOS_sim` folder
in our case.

[The Stack Overflow thread](https://stackoverflow.com/questions/30963294/creating-ios-osx-frameworks-is-it-necessary-to-codesign-them-before-distributin)
contains few more recommendations. Also, 
[CocoaPods](https://cocoapods.org/) package manager may be helpful to automate the process too.

# Next Steps

Kotlin/Native has bidirectional interop with Objective-C and Swift languages. 
Kotlin objects integrate with Objective-C/Swift reference counting. Unused Kotlin
objects are automatically removed. 
The [Objective-C Interop](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md)
article contains more information on the interop implementation details.
Of course, it is possible to import an existing framework and use it from Kotlin. Kotlin/Native
comes with a good set of pre-imported system frameworks.

Kotlin/Native supports C interop too. Check out the
[Kotlin/Native as a Dynamic Library](dynamic-libraries.html)
tutorial for that, or have a look at the
[C Interop](/docs/reference/native/c_interop.html) documentation article

