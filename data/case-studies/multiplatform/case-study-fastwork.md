---
id: "case-study-fastwork"
slug: "fastwork"
title: "Fastwork"
country: "Thailand, Indonesia"
size: "50-60"
usedProductTitle: "Kotlin\u00A0Multiplatform"
usedProductLink: "/multiplatform/"
industry: "Online Marketplace for Freelance Services"
coverImg: /images/case-studies/content/fastwork-cover.png
---


<div class="rs-subtitle-2">
Founded in 2015 by a group of engineers and entrepreneurs from Silicon Valley and New York, <a href="https://fastwork.co/" target="_blank" rel="noopener noreferrer">Fastwork&nbsp;↗</a> is one of the largest professional freelancing platforms in Southeast Asia by number of users and projects completed.

More than 300,000 businesses across Southeast Asia use Fastwork for its 22,000 services including graphic design, online & influencer marketing, data entry, and web & app development.

Fastwork also helps freelancers collect payments, promote their services, manage their orders, exchange files, and communicate with their clients anywhere, anytime.
</div>

### Hi Verachad! Could you add a few words about your company?

Fastwork is an online marketplace where businesses and entrepreneurs can hire the best freelancers for their needs. Our freelancers offer more than 70 different services, such as logo design, web development, translation, and many more.

### How is Kotlin Multiplatform used in your product (maybe with respect to its architecture scheme)?

Our application is divided into different layers based on the Clean Architecture concept, which is divided into 3 parts (Data, Domain, UI). Kotlin Multiplatform came into play for the domain and data layers to help us share our business logic and API service between platforms. We also created a new design pattern to help organize the code and manage the flow of data inside our application called Simplified-Redux (Sedux). You can find out more about it from <a href="https://youtu.be/RqPrepkJuOo" target="_blank" rel="noopener noreferrer">this talk</a> by one of our senior developers.

### Why did your team decide to use Kotlin Multiplatform, and what alternatives did you consider?

When we started the new project for a mobile application, we only had three people  two Android developers and one iOS developer. We had about 4 months to complete the new version of Fastwork that was more stable and scalable for both iOS and Android.

Since we didn't have any expertise in React Native, we totally discarded it and looked for alternatives, and at the time we came up with 2 options besides Kotlin Multiplatform, which were Flutter or a platform language like Kotlin or Swift.

Flutter was the first option that we considered since one member of our team had already created a production application with Flutter before joining us. However, we found some blockers, like rendering problems with Thai characters in iOS. Also, the learning curve for a new language and tools needed to be taken into account, since we were limited on both manpower and time. So, we decided not to go forward with Flutter for that reason.

The platform language option looked quite promising. We have developers with good platform knowledge, but we did not have the manpower for the task. We didn't think it was possible to have full-feature versions for both the Android and the iOS applications in 4 months, especially since we'd need to implement most of the logic separately.

That's where the Kotlin Multiplatform option came in. The other two Android developers and I had known about Kotlin Multiplatform for quite some time. Our strong knowledge of Kotlin and the ability to share code between platforms were the reasons why we chose Kotlin Multiplatform for this platform.

### What have been your most significant gains and pains?

The ability to share our business logic and API client was a huge boost for our productivity. We were able to finish tasks in a couple of days instead of them taking the whole week. Also, it encouraged team members to challenge themselves and start learning new things during development. For example, Android developers began to learn how to create UI storyboards and iOS developers were trying to write business logic in Kotlin. These aspects helped our team grow their knowledge significantly in the field of mobile development.

The pain that we had with Kotlin Multiplatform was the lack of setup documentation and reference material when we started the projects. It took us quite a long time to properly set up the project structure and the Gradle script.

<div class="info-block">
Take a look at the "<a href="/docs/multiplatform/get-started.html">Docs</a>" section. You will find a lot of content there that is especially useful to get started quickly, including "<a href="/docs/multiplatform/multiplatform-create-first-app.html">Creating your first Kotlin Multiplatform application</a>" tutorial and the "<a href="/docs/multiplatform/multiplatform-discover-project.html">Discover Kotlin Multiplatform Project</a>" guide.
</div>

### Do you have any life hacks or advice you'd like to share?

Some powerful features like the data classes and sealed classes in Kotlin Multiplatform are great, but be mindful that things might get ugly if Swift users try to use it.

Knowing how to manage the memory and threads for both platforms is a must if you are working on Kotlin Multiplatform.

Join the official Kotlin Slack. We could always get the answer to our problems there, and it's also a good place to get updates.

> Kotlin Multiplatform came into play for the domain and data layer to help with sharing the business logic and API service between platforms.
>
> <small>Verachad Wongsawangtham, Lead Mobile Engineer, Fastwork</small> 

## Statistics – number of users, downloads

### Information from January 27, 2020:

#### # of downloads

- Android - 140k
- iOS - 71k

#### MAU

- Android - 26k
- iOS - 16k

## Contact

Verachad Wongsawangtham, Lead Mobile Engineer

<a href="mailto:verachad@fastwork.co">verachad@fastwork.co</a>
