---
id: "case-study-chalk"
slug: "chalk"
title: "Chalk"
country: "Canada"
size: "13"
usedProductTitle: "Kotlin\u00A0Multiplatform"
usedProductLink: "/multiplatform/"
industry: "Education, Mobile Development"
coverImg: /images/case-studies/content/chalk-cover.png
---


### Could you say a few words about your company – name, industry, organization size, country?

Our company is called <a href="http://www.chalk.com" target="_blank" rel="noopener noreferrer">Chalk ↗</a> and we are in the education industry - we build apps to empower teachers and help them save time. We're based out of Canada and currently have 13 employees.

### Are there any statistics you'd like to share, for example, numbers of users and downloads?

Chalk has over 500k users overall. A majority of our users today use our web app, but we also have native mobile apps that are quite popular. We have 2 mobile apps that use Kotlin Multiplatform right now, and we plan to expand it to be used in all of our apps going forward. Planboard is our most popular one, and it has over 100k downloads across both iOS and Android.

### What does your product do?

Chalk is an integrated suite of productivity tools for teachers and school administrators. Planboard is a lesson-planning tool that lets teachers easily plan lessons, align them to curriculum standards, and share and collaborate with other teachers. Markboard is a gradebook that helps keep track of student progress as well as build a student learning portfolio with photo, video, and text observations.

### How is Kotlin Multiplatform used in your product (maybe with respect to its architecture scheme)?

In both of our mobile apps, Kotlin Multiplatform is used for networking, offline caching, and business logic layers. The UI for each of the apps is native to the platform, but other than that, almost everything else for our apps can be shared with Kotlin Multiplatform.

### Why did your team decide to use Kotlin Multiplatform, and what alternatives did you consider?

Our apps are very similar between iOS and Android, with the biggest difference being the native UI for each platform. When exploring solutions to share code between them, we primarily considered React Native as an alternative. However not only would that have required us to rewrite most of our app from scratch, but it would also be in an entirely different programming language than we were currently using, and we had heard of some issues from other companies who had tried it. We were already familiar and happy with using Kotlin on Android, and Kotlin Multiplatform allowed us to incrementally build it into our apps, so it seemed like the natural way to go.

### What have been your most significant gains and pains?

The biggest benefit we've received is increased productivity when developing new features for our apps while maintaining a platform-specific, native, and performant UI that our users expect. Building a new feature with Kotlin is now much faster, as the business logic can be written once and used for both platforms, and then only the UI has to be done separately for each platform. This also simplifies testing significantly, as the shared business logic only needs to be tested once instead of being tested on both platforms.

For pain points, getting set up was the hardest part – getting the shared framework to integrate correctly with our iOS project was harder than we were expecting. This has now been made much easier with the CocoaPods plugin, however. Otherwise, concurrency in Kotlin native, using coroutines from iOS, and debugging Kotlin native remain challenging at times.

### Do you have any life hacks or advice you'd like to share?

The best part about Kotlin Multiplatform is that you can adopt it incrementally and start using it for just a small part of your app – it's not an all-or-nothing solution. This lets you test it out with something small at first to better understand how it works and determine whether it's right for your project. The Kotlin Slack group has also been very helpful for debugging issues, following new developments, and learning about useful libraries and tools other users of Kotlin Multiplatform are using.

<div class="rs-subtitle-2">
> The biggest benefit we've received is increased productivity when developing new features for our apps while maintaining a platform-specific, native, and performant UI that our users expect.
>
> <small>Daniel Rampelt, Software Engineer, Chalk</small>
</div>

## Contact

Daniel Rampelt (<a href="mailto:daniel@chalk.com">daniel@chalk.com</a>)

Aleem Dhanji (<a href="mailto:aleem@chalk.com">aleem@chalk.com</a>)

Planboard (<a href="https://apps.apple.com/ca/app/planboard/id704514651" target="_blank" rel="noreferrer noopener">iOS</a>, <a href="https://play.google.com/store/apps/details?id=com.chalk.planboard" target="_blank" rel="noreferrer noopener">Android</a>)

Markboard (<a href="https://apps.apple.com/ca/app/markboard/id1175126574" target="_blank" rel="noreferrer noopener">iOS</a>, <a href="https://play.google.com/store/apps/details?id=com.chalk.markboard" target="_blank" rel="noreferrer noopener">Android</a>)
