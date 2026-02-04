---
id: "/case-study-cash-app"
slug: "cash-app"
title: "Cash App"
country: "USA"
size: "300+"
industry: "Finance"
usedProductTitle: "Kotlin Multiplatform"
usedProductLink: "/multiplatform/"
coverImg: /images/case-studies/content/cash-app-cover.png
---

<a href="https://cash.app/" class="wt-link" target="_blank" rel="noreferrer noopener">Cash App ↗</a> is the easiest way to send money, spend money, save money, and buy cryptocurrency. We believe in providing everyone with access to important financial services so they can fully participate in the economy.

The app launched in 2013 as a simple peer-to-peer payment app with 4 mobile engineers,
and it now has 50 mobile engineers (split across iOS and Android) and 30
million monthly active users.

The app has been built with the native Android/iOS toolchains throughout,
with a few small exceptions. We introduced a
[JavaScript runtime](https://developer.squareup.com/blog/shared-app-functionality-via-javascript/)
to power some shared server-driven logic for displaying sensitive payment information,
and that was our first exposure to shared code. We continued to experiment
with JavaScript as a tool for sharing code after 2016, but we concluded
that unless circumstances required it, the cost of working with JavaScript
outweighed the value of sharing code. We strive for a quick development
turnaround with Cash App, with small pull requests that are reviewed and
merged in a matter of hours, and working with JavaScript always slowed us
down, both in the writing and the reviewing of it. Over time our Android
and iOS teams grew closer, the platforms did the same with Swift and Kotlin,
and collaboration between the two teams strengthened. We started bouncing
ideas off each other and comparing code, and similar implementations started
emerging within the codebase.

The decision to test out Kotlin Multiplatform started in open source. A
library we maintain called SQLDelight was gearing up to generate Kotlin-only
APIs, and the decision was made to also use Kotlin Multiplatform Mobile to make those generated APIs
platform-agnostic. The fit seemed natural. Since SQLite is the most widely
used cross-platform technology around, this would serve as an opportunity to
test the technology, and it would open the doors for Cash App to use it
later, since the Android version of the app relied heavily on the library
at its core.

Within Cash App the value proposition of using Kotlin Multiplatform Mobile was twofold: we could
remove some of the shared JavaScript that was causing issues and enable the
Android and iOS engineers to take the next step in their collaboration and
maintain a single codebase. We loved the “shared business, native UI” idea
that Kotlin Multiplatform promoted, and it meant that our teams did not have
to give up using their preferred toolchains. We started testing the
technology within Cash App in 2018 with the [help of TouchLab](https://developer.squareup.com/blog/developing-on-ios-and-android/), slowly rolling
it out behind a feature flag to ensure we could roll back and upstream our
problems to JetBrains if we encountered any early-adopter issues.

In the last year, we’ve made major changes to how we use Kotlin Multiplatform
to help teams to adopt it. We had originally introduced the Gradle toolchain
to the iOS build by keeping the shared code in the same repository, but the
added cost of running Gradle and rebuilding the project did not make sense
in light of how often the dependency was being changed. Instead, we created
a shared repository for Android/iOS to be the home for our shared business
logic. Since then, our network, investing, and growth teams have all built
features with parts of their business logic in Kotlin Multiplatform Mobile. What has made me most
proud is that the contributions have come not only from Android and iOS team
members, but from the server team as well! Since we use Kotlin for our
server-side development, their team is now able to work in the repository,
and because the platform-agnostic Kotlin so closely resembles Swift that the
shift is manageable for our iOS team too.

In addition to using SQLDelight, we use [CrashKiOS](https://github.com/touchlab/CrashKiOS) from TouchLab to get better
stack traces in the wild, and we are in the process of adopting [Wire](https://github.com/square/wire) to work
with protocol buffers in the shared codebase. As for which parts of our
business logic we’ve encouraged Kotlin Multiplatform Mobile as a solution for, we’ve had the most
success so far with persistence and pure functions in the shared code, and
next we’re hoping to work more closely with our network APIs using Wire.

The vast majority of our code is written natively – developer happiness and
productivity is still the most important thing for us, and our focus right
now is making sure those who want to try Kotlin Multiplatform can do so
easily (and the number of people who do is growing!). The trend in the last
year of more projects exploring it as an option shows the strength of the
technology.  With JavaScript, we were quick to run away after giving it a
shot, but so far more and more folks on the team have been showing interest
in adopting Kotlin Multiplatform Mobile.

We love Kotlin Multiplatform because we didn’t have to give up any of the
things we love about our work. We’re at a place now where the developer
workflow is unchanged but there is an option to share code and get all of
those benefits without stepping out of our comfort zone. Our teams are
increasingly realizing the potential of Kotlin Multiplatform Mobile, giving it a shot, and seeing
how powerful it is.

[Alec Kazakova](https://twitter.com/strongolopolis), Mobile Developer
