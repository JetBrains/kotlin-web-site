---
id: "case-study-down-dog"
slug: "down-dog"
title: "Down Dog"
country: "USA"
size: "7"
industry: "Health & Fitness"
usedProductTitle: "Kotlin Multiplatform"
usedProductLink: "/multiplatform/"
coverImg: /images/case-studies/content/down-dog-cover.png
---

<a href="https://www.downdogapp.com/" class="wt-link" target="_blank" rel="noreferrer noopener">Down Dog ↗</a> is the innovative start up that brings a studio-like yoga experience to your mobile device. With Down Dog you get a brand new yoga routine every time you come to your mat.

Unlike following pre-recorded videos, Down Dog won’t make you do the same workout
over and over again. With over 60,000 different configurations, Down Dog gives
you the power to build a yoga practice you love!

This app brings yoga to over 500k subscribers on both Android and iOS, with
over 100k users completing a practice daily. The app has 200k reviews on iOS
and over 100k on Android, with an average rating of 4.9 on both platforms. And
what is this incredible app built with? [Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/mobile/)!

### The story behind Down Dog

In 2015, having worked at Google for three years, co-founder of Down Dog
Benjamin Simon started to feel frustrated with the size of Google and his
inability to drive progress forward as an individual programmer. He had recently
become obsessed with yoga and was in the middle of finishing a yoga teacher
training program. It suddenly dawned on him that the logic for yoga sequencing
they were learning could be put into code in order to generate semi-random
sequences much like an instructor does, which was the seed idea for Down Dog.
So, with an old college friend, he began to work on bringing the practice of
yoga to people’s mobile phones.

### The project

It has now been about six years since the first prototype. Certain parts have
remained unchanged; the same original set up of a Tomcat backend server still
runs on AWS that communicates with a PostgreSQL database. The first version was
a prototype that only existed as a web app (written in TypeScript). When they
then committed to Down Dog, that prototype was thrown out and they built the
first iOS app using Swift, which launched in August of 2015. In March of 2016
the Android app followed, which was written in Java. Around September of 2016,
the decision was made to switch to Kotlin for Android and the server, which
only took about a month (with the help of IntelliJ IDEA’s auto-converter). 6
months later, the web version of Down Dog was launched, which was built using
KotlinJS.

At this point, code was not being shared between any of the three clients,
but they were being written in parallel so that changes to the business logic
were essentially a copy-paste job (plus syntax changes when converting to Swift).
At the beginning of 2020, Down Dog switched to
[Kotlin Multiplatform](https://kotlinlang.org/lp/mobile/) and began
sharing code among all three clients for everything but layouts and other
platform code. The team has even moved the majority of their iOS platform code
from Swift to Kotlin, so that their entire project is now Kotlin with the
exception of around 5 Swift files.

### Down Dog under the hood

In terms of what is native, it is mostly just the view code. There’s also
network interaction, media playback, local storage, and third-party
integrations like Facebook login. The rest is Kotlin.

Under the hood, there's a module structure that looks roughly like this:

![Memeris picture 1](/images/case-studies/content/down-dog-1.png)

**Common**: multiplatform module containing code shared across the clients and
server (mostly various helpers that have been written).

**Base**: a kotlin-jvm module that depends on ‘common’ and contains non-client
code used by the server as well as in standalone tasks.

**Server**: a kotlin-jvm module that depends on ‘base’ and contains all of the
Servlets. This module uses the gretty plugin for running the server locally,
and the war plugin for deploying to AWS Tomcat servers.

**Tasks**: a kotlin-jvm module that depends on ‘base’ and contains various
standalone tasks that need to run (database cleanup, generating reports,
certain content-specific tasks).

**Client**: a multiplatform module that depends on ‘common’ and contains nearly
all of the code for all three clients. Most of this code is structured as
ViewController-View pairs, where the ViewController is platform-independent
and the View is an “expect” class implemented separately for each Android, iOS,
and JavaScript. This module also contains some “expect” objects which wrap
other platform interactions (e.g. a Network object to handle all
requests/responses), and it contains data classes representing the API
with the server, for which we use kotlinx.serialization to convert to and
from JSON.

**Android**: a kotlin-android module that depends on ‘client’ and contains the
Activity class, which calls code in ‘client’ to initialize the app.

**JavaScript**: a kotlin-js module that depends on ‘client’ and contains a main
function that calls code in ‘client’ to initialize the app.

Additionally there is an Xcode project similar to the Android and JavaScript
modules, containing primarily just the UIApplicationDelegate class, which
calls code in ‘client’ to initialize.

### Story of the mobile application

The **speed of development** for the app was probably the single biggest priority.
Launching features simultaneously on all platforms is an important component
of this and also helps prevent bugs. Even before we were actually sharing code,
we did parallel development and kept the three clients up-to-date with each
other. Performance is definitely an important consideration, which makes being
able to interact with the platforms directly very important (especially with
the media playback API’s).

Having used Java since starting coding in high school, Benjamin had long been
a fan of IntelliJ IDEA and had been aware of Kotlin for some time. Discussions
between the cofounders ultimately led to the adoption of Kotlin for the
project. Much of Java was considered overly verbose and otherwise frustrating,
and it was often pointed out that the problems they were finding in Java
seemed to have been addressed in Kotlin. That eventually led to the decision
to try Kotlin, especially because it was also much closer to Swift, which at
the time was the only option for iOS. In addition to being able to share code
across platforms, Kotlin's ability to create DSLs was very useful because it
is used heavily to write the logic for the workouts. There were never any
alternatives that were seriously considered. React Native was the other big
option at the time that was being pushed, but there were performance issues
(especially on Android), and JavaScript was also unappealing.

### Gains from using cross-platform

Now, the speed of development across the three client platforms is pretty
much unmatched. A single engineer is able to do all of the UI implementations,
now does all three clients and has re-skinned or otherwise changed the screens
in Down Dog in just a few months.

If you are putting off using Kotlin for whatever reason, Benjamin has just one
last suggestion for you: **“Just do it. You won’t look back.”**