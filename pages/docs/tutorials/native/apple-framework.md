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

In the tutorial, we see how to use Kotlin/Native code from
Objective-C and Swift applications or an iOS application.
We will build an Apple Framework out of the Kotlin/Native
code.

In the tutorial we'll: 
- [Create a Kotlin Library](#creating-a-kotlin-library) and compile it to Apple Framework
- Examine generated [Objective-C and Swift API](#generated-framework-headers)
- Use the Framework from [Objective-C](#using-the-code-from-objective-c) and [Swift](#using-the-code-from-swift)

   
## Creating a Kotlin Library

Kotlin/Native compiler is able to produce a Framework for macOS and iOS
out of the Kotlin code. The produced framework contains all declarations
and binaries to use it with Objective-C and Swift

The best way to understand the techniques is to try those techniques. 
Let's create a tiny Kotlin library first and use it from an Objective-C program.

We create a `lib.kt` file with the library contents:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
package demo

object DemoObject {
  val field = "A"
}

class DemoClass {
  fun foo() : Long = 42
}

fun ints(b: Byte, s: Short, i: Int, l:Long) { }
fun floats(f: Float, d: Double) { }

fun strings(str: String) : String {
  return "That is '$str' from C"
}

val globalString = "A global String"
```
</div>

We need to have a Kotlin/Native compiler on our machines. 
You may have a look at the
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where `kotlinc` command is available. 

Now we call the following commands to compile the code into Frameworks
for macOS, iOS and iOS emulator respectively:
```bash
kotlinc lib.kt -produce dynamic -output macOS/Demo
kotlinc lib.kt -produce framework -target ios_arm64 -output iOS/Demo
kotlinc lib.kt -produce framework -target ios_x64 -output iOS_emu/Demo
```

The `kotlinc` generates three frameworks for us, named `demo.framework` under 
`macOS`, `iOS` and `iOS_emu` folders respectively.

Let's see what is inside

## Generated Framework Headers

Each of created frameworks contains a header file under `<Framework>/Headers/Demo.h`.
The file does not depend on the target platform (at least with Kotlin/Native v.0.8.1).
It contains the definitions for our library. Also, there are some Kotlin-wide declarations.

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


The second part of the code contains the exact definitions for our Kotlin declarations.
The code is full of Objective-C attributes, which are intended to help
using the Framework from both Objective-C and Swift languages. 

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only="1" auto-indent="false">

```obj-c
@class DemoDemoObject, DemoDemoClazz;

NS_ASSUME_NONNULL_BEGIN

__attribute__((objc_subclassing_restricted))
@interface DemoDemoObject : KotlinBase

+ (instancetype)alloc 
      __attribute__((unavailable));
      
+ (instancetype)allocWithZone:
     (struct _NSZone *)zone 
     __attribute__((unavailable));
     
+ (instancetype)demoObject 
     __attribute__((swift_name("init()")));
     
@property (readonly) NSString *field;
@end;

__attribute__((objc_subclassing_restricted))
@interface DemoDemoClazz : KotlinBase

- (instancetype)init 
     __attribute__((swift_name("init()"))) 
     __attribute__((objc_designated_initializer));
     
+ (instancetype)new 
     __attribute__((availability(swift, unavailable, message="use object initializers instead")));
     
- (int64_t)memberFunctionP:(int32_t)p 
     __attribute__((swift_name("memberFunction(p:)")));
@end;

__attribute__((objc_subclassing_restricted))
@interface Demo : KotlinBase

+ (void)forIntegersB:(int8_t)b s:(int16_t)s i:(int32_t)i l:(int64_t)l 
     __attribute__((swift_name("forIntegers(b:s:i:l:)")));
     
+ (void)forFloatsF:(float)f d:(double)d 
     __attribute__((swift_name("forFloats(f:d:)")));
     
+ (NSString *)stringsStr:(NSString *)str 
     __attribute__((swift_name("strings(str:)")));
     
@property (class, readonly) NSString *globalString;
@end;

NS_ASSUME_NONNULL_END
```
</div>

The name `DemoDemoClazz` and `DemoDemoObject` are created for `DemoClazz` and `DemoObject` 
classes from the `demo` package of our library. The `Demo` prefix comes from the `-output` parameter
of the `kotlinc` compiler. All global functions from Kotlin are turned into `Demo` class in Objective-C.
You may notice, that Kotlin `String` and Objective-C `NSString` are mapped transparently.

## Using the Code from Objective-C

The usage is as follows:

<div class="sample" markdown="1" mode="obj-c" theme="idea" data-highlight-only="1" auto-indent="false">

```obj-c 

#import <Foundation/Foundation.h>
#import <Demo/Demo.h>

int main(int argc, const char * argv[]) {
    
    [[DemoDemoObject demoObject] field];
    
    DemoDemoClazz* clazz = [[ DemoDemoClazz alloc] init];
    [clazz memberFunctionP:42];
    
    [Demo forIntegersB:1 s:1 i:3 l:4];
   
    NSString* ret = [Demo stringsStr:(@"That is string")];
    return 0;
}
```
</div>

We call Kotlin classes directly from Objective-C code. Kotlin `object` has the class method 
function `demoObject`, which allows us to get the only instance of the object and to call 
`DemoObject` methods on it. 

The standard pattern is used to create an instance of the `DemoClazz` class. We call
the `[[ DemoDemoClazz alloc] init]` on Objective-C.

Global functions from the Kotlin sources are scoped under the `Demo` class on Objective-C.
All methods are turned into class methods of that class.

The `strings` function is turned into `Demo.stringsStr` function in Objective-C, we are
able to pass `NSString` directly to it. 

## Using the Code from Swift

The Framework, that we compiled with Kotlin/Native, has helper attributes to make it
easier to with it from Swift too. Let's convert the previous Objective-C example
into Swift. As the result we'll have the following code:

<div class="sample" markdown="1" mode="swift" theme="idea" data-highlight-only="1" auto-indent="false">

```swift
let field = DemoDemoObject().field

let clazz = DemoDemoClazz()
clazz.memberFunction(p: 42)

Demo.forIntegers(b: 1, s: 2, i: 3, l: 4)

let ret = Demo.strings(str: "That is string")
``` 
</div>

We see from the example, that the Kotlin code is turned into nearly the similar looking
code in Swift. There are some small differences, so far. We create the `object` from Kotlin
to access it's methods. We may see from the attributes that it is the way to access the object. 
It is good to notice, the method and property names are translated as-is. 

# XCode and Framework Dependencies

It may turn out tricky to configure the Objective-C or Swift project in XCode or
JetBrains AppCode. You need to include the Framework to the project, 
for that you should include the Framework into the *General* tab of Target settings. 
Also, you may need to fix `@rpath` to list the folder where the framework is, for that
just search for *Runpath Search Paths* in the *Build Settings* section. 
It is convenient to add `@xecutable_path/frameworks` or something similar.  


# Next Steps

Kotlin/Native integrates with Objective-C and Swift reference counting. Unused Kotlin
objects are automatically removed. You may want to see the detailed documentation on 
that in the [OBJC_INTEROP.md](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md).


You may also import Frameworks to use them from Kotlin. find more information on Kotlin/Native and Objective-C Interop
in the [documentation](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md).

You may also want to compile your Kotlin code into a dynamic library? For that, 
please check the [Kotlin/Native as a Dynamic Library](dynamic-libraries.html)
tutorial too.

