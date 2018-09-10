---
type: tutorial
layout: tutorial
title:  "Kotlin/Native as an Apple Framework"
description: "Compiling Kotlin/Native code and use it from Objective-C and Swift"
authors: Eugene Petrenko
date: 2018-08-05
showAuthorInfo: false
issue: EVAN-5132
---

Kotlin/Native provides bi-directional interoperability with Objective-C/Swift. 
Objective-C frameworks and libraries can be used in Kotlin code.
Kotlin modules can be used in Swift/Objective-C code too.
Besides that, Kotlin/Native has
[C Interop](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md).
You may also want to take a look at the [Kotlin/Native as a Dynamic Library](dynamic-libraries.html)
tutorial.

In this tutorial, we will look at how to use Kotlin/Native code from
Objective-C and Swift applications on macOS and iOS.
We will build a framework from Kotlin code.

In this tutorial we'll: 
- [create a Kotlin Library](#creating-a-kotlin-library) and compile it to a framework
- examine the generated [Objective-C and Swift API](#generated-framework-headers) code
- use the framework from [Objective-C](#using-the-code-from-objective-c) and [Swift](#using-the-code-from-swift)
- [Configure XCode](#xcode-and-framework-dependencies) to use the framework for [macOS](#xcode-for-macos-target) and [iOS](#xcode-for-ios-targets)
   
## Creating a Kotlin Library

Kotlin/Native compiler can produce a framework for macOS and iOS
out of the Kotlin code. The created framework contains all declarations
and binaries needed to use it with Objective-C and Swift.
The best way to understand the techniques is to try it for ourselves. 
Let's create a tiny Kotlin library first and use it from an Objective-C program.

We create the `lib.kt` file with the library contents:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package demo

object Object {
  val field = "A"
}

interface Interface {
  fun iMember() {}
}

class Clazz : Interface {
  fun member(p: Int): Long? = 42
}

fun forIntegers(b: Byte, s: Short, i: Int, l: Long?) { }
fun forFloats(f: Float, d: Double?) { }

fun strings(str: String?) : String {
  return "That is '$str' from C"
}

fun acceptFun(f: (String) -> String?) = f("Kotlin/Native rocks!")
fun supplyFun() : (String) -> String? = { "$it is cool!" }
```
</div>

We need to have a Kotlin/Native compiler on our machines. 
You may want to take a look at the
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where the `kotlinc` command is available. 

Now let's call the following commands to compile the code into frameworks
for macOS, iOS, and an iOS emulator respectively:
```bash
kotlinc lib.kt -produce framework -target macos_x64 -output macOS/Demo
kotlinc lib.kt -produce framework -target ios_arm64 -output iOS/Demo
kotlinc lib.kt -produce framework -target ios_x64 -output iOS_emu/Demo
```

The `kotlinc` generates three frameworks for us, named `Demo.framework` under 
`macOS`, `iOS`, and `iOS_emu` folders respectively.

Let's see what is inside

## Generated Framework Headers

Each of the created frameworks contains the header file in `<Framework>/Headers/Demo.h`.
The headers do not depend on the target platform (at least with Kotlin/Native v.0.8.2).
It contains the definitions for our Kotlin code and a few Kotlin-wide declarations.

Note, the way Kotlin/Native exports symbols is subject to change without notice.

### Kotlin/Native Runtime Declarations

Let's
take a look at Kotlin runtime declarations first:

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only auto-indent="false">

```obj-c
@interface KotlinBase : NSObject
- (instancetype)init __attribute__((unavailable));
+ (instancetype)new __attribute__((unavailable));
+ (void)initialize __attribute__((objc_requires_super));
@end;

@interface KotlinBase (KotlinBaseCopying) <NSCopying>
@end;

__attribute__((objc_runtime_name("KotlinMutableSet")))
@interface DemoMutableSet<ObjectType> : NSMutableSet<ObjectType>
@end;

__attribute__((objc_runtime_name("KotlinMutableDictionary")))
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


### Classes and Objects from Kotlin

Let's see how `class` and `object` are mapped to Objective-C and Swift. 
The generated `<Framework>/Headers/Demo.h` file contains the exact definitions for 
`Class`, `Interface`, and `Object`:

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only="1" auto-indent="false">

```obj-c
NS_ASSUME_NONNULL_BEGIN

__attribute__((objc_subclassing_restricted))
@interface DemoObject : KotlinBase
+ (instancetype)alloc __attribute__((unavailable));
+ (instancetype)allocWithZone:(struct _NSZone *)zone __attribute__((unavailable));
+ (instancetype)object __attribute__((swift_name("init()")));
@property (readonly) NSString *field;
@end;

@protocol DemoInterface
@required
- (void)iMember __attribute__((swift_name("iMember()")));
@end;

__attribute__((objc_subclassing_restricted))
@interface DemoClazz : KotlinBase <DemoInterface>
- (instancetype)init __attribute__((swift_name("init()"))) __attribute__((objc_designated_initializer));
+ (instancetype)new __attribute__((availability(swift, unavailable, message="use object initializers instead")));
- (NSNumber * _Nullable)memberP:(int32_t)p __attribute__((swift_name("member(p:)")));
@end;
```
</div>

The code is full of Objective-C attributes, which are intended to help
the use of the framework from both Objective-C and Swift languages.
`DemoClazz`, `DemoInterface`, and `DemoObject` are created for `Clazz`, `Interface`, and `Object` 
respectively. The `Interface` is turned into `@protocol`, both a `class` and an `object` are represented as
`@interface`.
The `Demo` prefix comes from the `-output` parameter
of the `kotlinc` compiler and the framework name. 
You may have spotted that the nullable return type `Long?` was turned into `NSNumber*` in Objective-C.

### Global Declarations from Kotlin

All global functions from Kotlin
are turned into `Demo` class in Objective-C/Swift, where `Demo` is the framework name and set by
the `-output` parameter of `kotlinc`.

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only="1" auto-indent="false">

```obj-c
NS_ASSUME_NONNULL_BEGIN

__attribute__((objc_subclassing_restricted))
@interface Demo : KotlinBase
+ (void)forIntegersB:(int8_t)b s:(int16_t)s i:(int32_t)i l:(NSNumber * _Nullable)l __attribute__((swift_name("forIntegers(b:s:i:l:)")));
+ (void)forFloatsF:(float)f d:(NSNumber * _Nullable)d __attribute__((swift_name("forFloats(f:d:)")));
+ (NSString *)stringsStr:(NSString * _Nullable)str __attribute__((swift_name("strings(str:)")));
+ (NSString * _Nullable)acceptFunF:(NSString * _Nullable (^)(NSString *))f __attribute__((swift_name("acceptFun(f:)")));
+ (NSString * _Nullable (^)(NSString *))supplyFun __attribute__((swift_name("supplyFun()")));
@end;
```
</div>

You may have noticed, that Kotlin `String` and Objective-C `NSString*` are mapped transparently.
Similarly, `Unit` type from Kotlin is mapped to `void`. We see primitive types
are mapped directly. Non-nullable primitive types are mapped transparently.
Nullable primitive types are mapped into `NSNumber*`.
You may have seen that both higher order functions `acceptFunF` and `supplyFun` are included,
and accept Objective-C blocks.

You may want to look at the [Objective-C Interop](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md)
documentation article to learn about all other types mapping details in detail.

## Garbage Collection and Reference Counting

Objective-C and Swift use reference counting. Kotlin/Native has it's own garbage collection too.
Kotlin/Native garbage collection is integrated with Objective-C/Swift reference
counting. You do not need to use anything special to control the lifetime of Kotlin/Native instances
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
        
        [Demo forIntegersB:1 s:1 i:3 l:[NSNumber numberWithLongLong:4]];
        [Demo forFloatsF:2.71 d:nil];
        
        NSString* ret = [Demo acceptFunF:^NSString * _Nullable(NSString * it) {
            return [it stringByAppendingString:@" Kotlin is fun"];
        }];
        
        NSLog(@"%@", ret);
        return 0;
    }
}
```
</div>

We call Kotlin classes directly from Objective-C code. Kotlin `object` has the class method 
function `object`, which allows us to get the only instance of the object and to call 
`Object` methods on it. 
The widespread pattern is used to create an instance of the `Clazz` class. We call
the `[[ DemoClazz alloc] init]` on Objective-C. We may also use `[DemoClazz new]`
for constructors without parameters.
Global functions from the Kotlin sources are scoped under the `Demo` class on Objective-C.
All methods are turned into class methods of that class.
The `strings` function is turned into `Demo.stringsStr` function in Objective-C, we can
pass `NSString` directly to it. The return is visible as `NSString` too.

## Using the Code from Swift

The framework that we compiled with Kotlin/Native has helper attributes to make it
easier to use with Swift. Let's convert the previous Objective-C example
into Swift. As a result, we'll have the following code in `main.swift`:

<div class="sample" markdown="1" mode="swift" theme="idea" data-highlight-only="1" auto-indent="false">

```swift
import Foundation
import Demo

let kotlinObject = DemoObject()
assert(kotlinObject === DemoObject(), "Kotlin object has only one instance")

let field = DemoObject().field

let clazz = DemoClazz()
clazz.member(p: 42)

Demo.forIntegers(b: 1, s: 2, i: 3, l: 4)
Demo.forFloats(f: 2.71, d: nil)

let ret = Demo.acceptFun { "\($0) Kotlin is fun" }
if (ret != nil) {
  print(ret!)
}
``` 
</div>

The Kotlin code is turned into very similar looking
code in Swift. There are some small differences, though. In Kotlin any `object` has
the only one instance. Kotlin `object Object` now has a
constructor in Swift, and we use the `DemoObject()` syntax to access the only instance of it.
The instance is always the same in Swift, so that 
`DemoDemoObject() === DemoDemoObject()` is true. 
Methods and property names are translated as-is. Kotlin `String` is turned into Swift `String` too.
Swift hides `NSNumber*` boxing from us too. We pass Swift closure to Kotlin and call a Kotlin 
lambda function from Swift too. 

You may want to take a look at the [Objective-C Interop](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md)
documentation article to learn about all other types mapping details in detail.

# XCode and Framework Dependencies

We need to configure an XCode project to use our framework. The configuration depends on the
target platform. 

## XCode for MacOS Target

First, we need to include the framework in the `General` section of the *target*
configuration. There is the `Linked Frameworks and Libraries` section to include
our framework. That will make XCode look at our framework and resolve imports both
from Objective-C and Swift.

The second step is to configure the framework search path of the produced
binary. It is also known as `rpath` or [run-time search path](https://en.wikipedia.org/wiki/Rpath).
The binary uses the path to look for the required frameworks. We do not recommend
installing your frameworks to the OS if it is not needed. You should understand the layout
of your future application, for example, 
you may have the `Frameworks` folder under the application bundle with all the frameworks you use. 
The `@rpath` parameter can be configured in the XCode. You need to open
the *project* configuration and find the `Runpath Search Paths` section. There we specify
the relative path to the compiled framework.

You may also want to set XCode to create all project build files under the project
root. It is done via `File | Project Settings` menu. That will simplify the way you
pass the `rpath` to the executable. 

## XCode for iOS Targets

First, we need to include the compiled framework into the XCode project. For
that we add the framework to the `Embedded Binaries` block of the `General` section of
the *target* configuration page. 

The second step is to then include the framework path into the `Framework Search Paths` block
of the `Build Settings` section of the *target* configuration page. It is possible to use `$(PROJECT_DIR)`
macro so simplify the setup.
 
The iOS emulator requires a framework compiled for the `ios_arm64` target, the `iOS_emu` folder
in our case.
You may want to read up on iOS frameworks from
[the Stack Overflow thread](https://stackoverflow.com/questions/30963294/creating-ios-osx-frameworks-is-it-necessary-to-codesign-them-before-distributin).
[CocoaPods](https://cocoapods.org/) package manager may be helpful to automate the process too.

# Next Steps

Kotlin/Native has bidirectional interop with Objective-C and Swift languages. 
Kotlin objects integrate with Objective-C/Swift reference counting. Unused Kotlin
objects are automatically removed. You may want to take a look at the detailed documentation on 
the [Objective-C Interop](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md).
Of course, it is possible to import an existing framework and use it from Kotlin. Kotlin/Native
comes with a good set of pre-imported system frameworks.

Kotlin/Native supports C interop too. Check out the
[Kotlin/Native as a Dynamic Library](dynamic-libraries.html)
tutorial for that, or have a look at the
[C Interop](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md) documentation article

