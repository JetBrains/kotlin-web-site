---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin/Native"
---

# What is Kotlin/Native?

Kotlin/Native is a technology for compiling Kotlin code to native binaries, which run without any VM.
It is an [LLVM](https://llvm.org/) based backend for the Kotlin compiler and a native implementation of the Kotlin standard
library

# Why Kotlin/Native?

Kotlin/Native is primarily designed to allow compilation for platforms where *virtual machines* are not
desirable or possible, for example, embedded devices or iOS.
It solves a developer needs to produce a 
self-contained program that does not require an additional runtime or virtual machine.


# Interoperability

Kotlin/Native supports two-way interoperability with the Native world. 
On one hand the compiler creates
- an executable,
- a static library,
- a [dynamic library](/docs/tutorials/native/dynamic-libraries.html),
- an [Apple framework](/docs/tutorials/native/apple-framework.html) for Swift and Objective-C 

That makes it easy to include the compiled Kotlin code from Kotlin/Native into
existing projects written in C, C++, Swift, Objective-C, and other languages.

On the other hand, Kotlin/Native supports interoperability, and one may use their native library
directly from Kotlin/Native. It supports:
- [C Libraries](/docs/reference/native/c_interop.html), static or dynamic 
- [Swift and Objective-C](/docs/reference/native/objc_interop.html) two-way interop especially for macOS and iOS apps

That makes it easy to use an existing native code, libraries, frameworks, graphical engines, directly from Kotlin/Native.
Popular platform libraries are available with the compiler out of the box. 

# Target Platforms

Kotlin/Native supports the following platforms:
   * iOS (arm32, arm64, emulator x86_64)
   * MacOS (x86_64)
   * Android (arm32, arm64)
   * Windows (mingw x86_64)
   * Linux (x86_64, arm32, MIPS, MIPS little endian)
   * WebAssembly (wasm32)

# Libraries

There are libraries for Kotlin/Native. That is the way to easily share common
Kotlin/Native code between projects. A [klib](/docs/reference/native/platform_libs.html)
library includes metadata and binary part for selected platforms.
There are several popular Kotlin/Native libraries:
- Kotlin stdlib
- [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines/blob/master/native/README.md)
- http?
- serialization?
- kotlinx.io
- kotlinx.serialization
- ktor-http-client

The Kotlin/Native compiler comes with the set of pre-build Kotlin libraries for popular native
packages:

```
android_arm32, android_arm64
android  egl  gles  gles2  gles3  glesCommon  linux  media  omxal  posix  sles  zlib

linux_arm32, linux_mips:
iconv  linux  posix

linux_x64
iconv  linux  posix  zlib

windows mingw_x64:
gdiplus iconv opengl32 posix windows zlib

ios_arm32, ios_arm64, ios_x86_64:
ARKit                   CoreAudio               EAGL                    Intents                 NotificationCenter      SpriteKit
AVFoundation            CoreAudioKit            EventKit                IntentsUI               OpenAL                  StoreKit
AVKit                   CoreBluetooth           EventKitUI              LocalAuthentication     OpenGLES                SystemConfiguration
Accelerate              CoreData                ExternalAccessory       MapKit                  OpenGLES2               Twitter
Accounts                CoreFoundation          FileProvider            MediaAccessibility      OpenGLES3               UIKit
AdSupport               CoreGraphics            FileProviderUI          MediaPlayer             OpenGLESCommon          UserNotifications
AddressBook             CoreImage               Foundation              MediaToolbox            PDFKit                  UserNotificationsUI
AddressBookUI           CoreLocation            GLKit                   MessageUI               PassKit                 VideoSubscriberAccount
AssetsLibrary           CoreMIDI                GSS                     Messages                Photos                  VideoToolbox
AudioToolbox            CoreML                  GameController          Metal                   PhotosUI                Vision
AuthenticationServices  CoreMedia               GameKit                 MetalKit                PushKit                 WatchConnectivity
BusinessChat            CoreMotion              GameplayKit             MetalPerformanceShaders QuartzCore              WatchKit
CFNetwork               CoreNFC                 HealthKit               MobileCoreServices      QuickLook               WebKit
CallKit                 CoreServices            HealthKitUI             ModelIO                 ReplayKit               darwin
CarPlay                 CoreSpotlight           HomeKit                 MultipeerConnectivity   SafariServices          iAd
ClassKit                CoreTelephony           IOSurface               NaturalLanguage         SceneKit                iconv
CloudKit                CoreText                IdentityLookup          Network                 Security                objc
Contacts                CoreVideo               IdentityLookupUI        NetworkExtension        Social                  posix
ContactsUI              DeviceCheck             ImageIO                 NewsstandKit            Speech                  zlib

macos_x64:
Accelerate          CoreFoundation      CoreText            IOKit               OpenGL3             iconv               zlib
AppKit              CoreGraphics        CoreVideo           IOSurface           OpenGLCommon        libkern
ApplicationServices CoreImage           DiskArbitration     ImageIO             QuartzCore          objc
CFNetwork           CoreML              Foundation          Metal               Security            osx
CoreData            CoreServices        GLUT                OpenGL              darwin              posix
```
 

# Sharing Code with Other Platforms

Most of the projects targeting to a set of platforms: Android, iOS, server-side, JVM, client-side, JavaScript, CSS, native.
With Kotlin/Native and Kotlin multiplatform projects, you may easily re-use Kotlin code between all those platforms. 
See [__TODO___MULTIPLATFORM__LINK__](#) for more details to take a look at the [iOS and Android application tutorial].

# How to Start?

Check out [tutorials](/docs/tutorials/native/apple-framework.html) or [documentation](/docs/reference/native/multiplatform.html)
for Kotlin/Native.

Do you like to lean by example? There are example projects for you: 
 * The [Kotlin/Native GitHub repository](https://github.com/JetBrains/kotlin-native/tree/master/samples) contains a number of sample projects;
 * The [KotlinConf app](https://github.com/JetBrains/kotlinconf-app/tree/master/ios) is an iOS app
   with a UIKit-based UI, showcasing the Objective-C interop facilities of Kotlin/Native.
 * The [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner) is a simple cross-platform 
   mobile multiplayer game fully built in Kotlin/Native, consisting of the following components:
     - a backend, using SQLite for data storage and exposing a REST/JSON API;
     - mobile clients for iOS and Android, using OpenGL;
     - a WebAssembly-based browser frontend for viewing the game scores.

Still have questions? Check out the [Community](/community/) page for more info
