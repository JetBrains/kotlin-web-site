[//]: # (title: Kotlin for server side)

Kotlin is a great fit for developing server-side applications. It allows you to write concise and expressive code while
maintaining full compatibility with existing Java-based technology stacks, all with a smooth learning curve:

* **Expressiveness**: Kotlin's innovative language features, such as its support for [type-safe builders](type-safe-builders.md)
  and [delegated properties](delegated-properties.md), help build powerful and easy-to-use abstractions.
* **Scalability**: Kotlin's support for [coroutines](coroutines-overview.md) helps build server-side applications
  that scale to massive numbers of clients with modest hardware requirements.
* **Interoperability**: Kotlin is fully compatible with all Java-based frameworks, so you can use your
  familiar technology stack while reaping the benefits of a more modern language.
* **Migration**: Kotlin supports gradual migration of large codebases from Java to Kotlin. You can start
  writing new code in Kotlin while keeping older parts of your system in Java.
* **Tooling**: In addition to great IDE support in general, Kotlin offers framework-specific tooling (for example,
  for Spring and Ktor) in the plugin for IntelliJ IDEA Ultimate.
* **Learning Curve**: For a Java developer, getting started with Kotlin is very easy. The automated Java-to-Kotlin converter
  included in the Kotlin plugin helps with your first steps. [Kotlin Koans](koans.md) guide you through key language features
  with a series of interactive exercises. Kotlin-specific frameworks like [Ktor](https://ktor.io/) offer
  a simple, straightforward approach without the hidden complexities of larger frameworks.

## Frameworks for server-side development with Kotlin

Here are some examples of the server-side frameworks for Kotlin:

* [Spring](https://spring.io) makes use of Kotlin's language features to offer [more concise APIs](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0),
  starting with version 5.0. The [online project generator](https://start.spring.io/#!language=kotlin) allows you to quickly generate a new project in Kotlin.

* [Ktor](https://github.com/kotlin/ktor) is a framework built by JetBrains for creating Web applications in Kotlin, making use of coroutines for high scalability and offering an easy-to-use and idiomatic API.

* [Quarkus](https://quarkus.io/guides/kotlin) provides first class support for using Kotlin. The framework is open source and maintained by Red Hat. Quarkus was built from the ground up for Kubernetes and provides a cohesive full-stack framework by leveraging a growing list of hundreds of best-of-breed libraries.

* [Vert.x](https://vertx.io), a framework for building reactive Web applications on the JVM, offers [dedicated support](https://github.com/vert-x3/vertx-lang-kotlin)
  for Kotlin, including [full documentation](https://vertx.io/docs/vertx-core/kotlin/).

* [kotlinx.html](https://github.com/kotlin/kotlinx.html) is a DSL that can be used to build HTML in Web applications.
  It serves as an alternative to traditional templating systems such as JSP and FreeMarker.

* [Micronaut](https://micronaut.io/) is a modern JVM-based full-stack framework for building modular, easily testable microservices and serverless applications. It comes with a lot of useful built-in features.

* [http4k](https://http4k.org/) is the functional toolkit with a tiny footprint for Kotlin HTTP applications, written in pure Kotlin. The library is based on the "Your Server as a Function" paper from Twitter and represents modeling both HTTP servers and clients as simple Kotlin functions that can be composed together.

* [Javalin](https://javalin.io) is a very lightweight web framework for Kotlin and Java which supports WebSockets, HTTP2, and async requests.

* The available options for persistence include direct JDBC access, JPA, and using NoSQL databases through their Java drivers.
  For JPA, the [kotlin-jpa compiler plugin](no-arg-plugin.md#jpa-support) adapts
  Kotlin-compiled classes to the requirements of the framework.
  
> You can find more frameworks at [https://kotlin.link/](https://kotlin.link/resources).
>
{style="note"}

## Deploying Kotlin server-side applications

Kotlin applications can be deployed into any host that supports Java Web applications, including Amazon Web Services,
Google Cloud Platform, and more.

To deploy Kotlin applications on [Heroku](https://www.heroku.com), you can follow the [official Heroku tutorial](https://devcenter.heroku.com/articles/getting-started-with-kotlin).

AWS Labs provides a [sample project](https://github.com/awslabs/serverless-photo-recognition) showing the use of Kotlin
for writing [AWS Lambda](https://aws.amazon.com/lambda/) functions.

Google Cloud Platform offers a series of tutorials for deploying Kotlin applications to GCP, both for [Ktor and App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) and [Spring and App engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8). In addition,
there is an [interactive code lab](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) for deploying a Kotlin Spring application.

## Products that use Kotlin on the server side

[Corda](https://www.corda.net/) is an open-source distributed ledger platform that is supported by major
banks and built entirely in Kotlin.

[JetBrains Account](https://account.jetbrains.com/), the system responsible for the entire license sales and validation
process at JetBrains, is written in 100% Kotlin and has been running in production since 2015 with no major issues.

[Chess.com](https://www.chess.com/) is a website dedicated to chess and the millions of players around the world 
who love the game. Chess.com uses Ktor for the seamless configuration of multiple HTTP clients.

Engineers at [Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) use Kotlin for server-side app development and Ktor for prototyping in the Adobe Experience 
Platform, which enables organizations to centralize and standardize customer data before applying data science and machine learning.


## Next steps

* For a more in-depth introduction to the language, check out the Kotlin documentation on this site and [Kotlin Koans](koans.md).
* Explore how to [build asynchronous server applications with Ktor](https://ktor.io/docs/server-create-a-new-project.html), a framework that uses Kotlin coroutines.
* Watch a webinar ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/) and 
  explore a detailed [guide](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html) 
  showing how you can use [Kotlin extension functions](extensions.md#extension-functions) in the Micronaut framework.
* http4k provides the [CLI](https://toolbox.http4k.org) to generate fully formed projects, and a [starter](https://start.http4k.org) repo to generate an entire CD pipeline using GitHub, Travis, and Heroku with a single bash command.
* Want to migrate from Java to Kotlin? Learn how to perform [typical tasks with strings in Java and Kotlin](java-to-kotlin-idioms-strings.md).



Uzbek language


**Dissecting the Text**



I'm currently breaking down the English Markdown, identifying key structural elements. I'm focusing on titles, headings, and bullet points to ensure a proper translation. This will help me to apply the correct Uzbek terminology. The goal is to preserve the original structure as closely as possible during translation.


**Decomposing the Structure**


I'm now analyzing the "Kotlin for server-side" text, chunking it into logical segments. I am focusing on key phrases for translation. I've started translating the key terms like "server-side applications" and "concise and expressive code." I'll also transliterate some technical terms, like "coroutines."


**Structuring the Content**


I'm now segmenting the provided text into logical blocks, including the title, introduction, and various sections like framework descriptions. I'm focusing on identifying the core ideas to facilitate accurate translation of each. I'm making sure to keep proper headings and bulleted lists for Uzbek formatting, ensuring the translated version's structure mirrors the original.


**Formulating Translations**

\n\n

I'm now concentrating on the specific English-to-Uzbek translations. I'm cross-referencing technical terms, like "coroutine" and "type-safe builders," ensuring consistency. I've also compiled a list of terms that benefit from transliteration, such as "Kotlin Koans," and I'm preparing for phrases such as "JVM-based full-stack framework." The goal is both precision and clarity.


**Mapping the Concepts**


I'm now creating a glossary of terms, readying myself to handle the translation of technical and idiomatic expressions. I am focusing on ensuring accuracy and consistency for phrases such as "server-side applications" and "concise and expressive code." My prep work focuses on both direct Uzbek equivalents, and transliteration choices, like "coroutines".


**Refining Translations**

\n\n

I'm now deep into the actual translation, systematically going through each phrase and term. I'm focusing on the more complex technical terms. I'm giving preference to existing Uzbek equivalents where appropriate. I'm also adding notes for transliteration. I'm finalizing the glossary, and preparing for the translation of the deployment section and next steps.


**Finalizing the Glossary**

\n\n

I'm now constructing the final version of the terminology glossary, cross-referencing to ensure consistency. The glossary includes the most crucial translations and transliterations, readying myself for the final translation. I'm also checking specific phrases for optimal word choice, readying the final deliverable.


**Formulating a Strategy**

\n\n

I'm establishing my process. I'll divide the source content into manageable sections. Key terms will be translated or transliterated as appropriate. I'm prioritizing structural preservation, including Markdown elements. I'll carefully review the final version for both accuracy and natural Uzbek phrasing, and ensure the original format is maintained.


[//]: # (title: Kotlin server-tomonda)

Kotlin server-tomon ilovalarini ishlab chiqish uchun juda mos keladi. Bu sizga mavjud Java-ga asoslangan texnologiyalar to'plami bilan to'liq moslikni saqlab, ixcham va ifodali kod yozish imkonini beradi, bularning barchasi oson o'rganish jarayoni bilan birga keladi:

* **Ifodalilik**: Kotlinning innovatsion til xususiyatlari, masalan, [turlarga xavfsiz builder'lar](type-safe-builders.md) va [delegatlangan xususiyatlar](delegated-properties.md)ni qo'llab-quvvatlashi, kuchli va ishlatish uchun qulay abstraksiyalarni yaratishga yordam beradi.
* **Masshtablashuvchanlik**: Kotlinning [korutinlar](coroutines-overview.md)ni qo'llab-quvvatlashi, kamtarona apparat talablari bilan juda ko'p sonli klientlarga xizmat ko'rsata oladigan masshtablanuvchan server-tomon ilovalarini yaratishga yordam beradi.
* **O'zaro muvofiqlik**: Kotlin barcha Java-ga asoslangan freymvorklar bilan to'liq mos keladi, shuning uchun siz zamonaviyroq tilning afzalliklaridan bahramand bo'lgan holda o'zingizga tanish bo'lgan texnologiyalar to'plamidan foydalanishingiz mumkin.
* **Migratsiya**: Kotlin katta kod bazalarini Java'dan Kotlin'ga bosqichma-bosqich o'tkazishni qo'llab-quvvatlaydi. Tizimingizning eski qismlarini Java'da saqlab, yangi kodni Kotlin'da yozishni boshlashingiz mumkin.
* **Instrumentlar**: Umuman olganda, ajoyib IDE qo'llab-quvvatlashidan tashqari, Kotlin IntelliJ IDEA Ultimate plagini orqali freymvorkka xos instrumentlarni (masalan, Spring va Ktor uchun) taklif etadi.
* **O'rganish jarayoni**: Java dasturchisi uchun Kotlin bilan ishlashni boshlash juda oson. Kotlin plaginiga kiritilgan avtomatlashtirilgan Java-dan-Kotlin-ga o'giruvchi konverter dastlabki qadamlaringizda yordam beradi. [Kotlin Koans](koans.md) interaktiv mashqlar seriyasi orqali sizni tilning asosiy xususiyatlari bilan tanishtiradi. [Ktor](https://ktor.io/) kabi Kotlin-maxsus freymvorklar yirik freymvorklarning yashirin murakkabliklarisiz sodda va tushunarli yondashuvni taklif etadi.

## Kotlin bilan server-tomon dasturlash uchun freymvorklar

Kotlin uchun server-tomon freymvorklarining ba'zi namunalari:

* [Spring](https://spring.io) 5.0 versiyasidan boshlab, Kotlinning til xususiyatlaridan foydalanib, [yanada ixcham API'lar](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)ni taklif qiladi. [Onlayn loyiha generatori](https://start.spring.io/#!language=kotlin) sizga Kotlin'da tezda yangi loyiha yaratish imkonini beradi.

* [Ktor](https://github.com/kotlin/ktor) JetBrains tomonidan Kotlin'da Web-ilovalar yaratish uchun ishlab chiqilgan freymvork bo'lib, yuqori masshtablashuvchanlik uchun korutinlardan foydalanadi va ishlatish uchun qulay hamda idiomatik API taklif etadi.

* [Quarkus](https://quarkus.io/guides/kotlin) Kotlin'dan foydalanish uchun birinchi darajali qo'llab-quvvatlashni ta'minlaydi. Freymvork ochiq manbali bo'lib, Red Hat tomonidan qo'llab-quvvatlanadi. Quarkus boshidan Kubernetes uchun yaratilgan va yuzlab eng yaxshi kutubxonalar ro'yxatidan foydalanib, yaxlit full-stack freymvorkni taqdim etadi.

* [Vert.x](https://vertx.io), JVM'da reaktiv Web-ilovalar yaratish uchun mo'ljallangan freymvork, Kotlin uchun [maxsus qo'llab-quvvatlash](https://github.com/vert-x3/vertx-lang-kotlin)ni, shu jumladan [to'liq hujjatlar](https://vertx.io/docs/vertx-core/kotlin/)ni taklif etadi.

* [kotlinx.html](https://github.com/kotlin/kotlinx.html) Web-ilovalarda HTML yaratish uchun ishlatilishi mumkin bo'lgan DSL'dir. U JSP va FreeMarker kabi an'anaviy shablon tizimlariga alternativa bo'lib xizmat qiladi.

* [Micronaut](https://micronaut.io/) modulli, oson sinovdan o'tkaziladigan mikroservislar va serversiz ilovalar yaratish uchun zamonaviy JVM-ga asoslangan full-stack freymvorkdir. U ko'plab foydali o'rnatilgan funksiyalar bilan birga keladi.

* [http4k](https://http4k.org/) sof Kotlin'da yozilgan Kotlin HTTP ilovalari uchun juda kichik hajmli funksional instrumentlar to'plamidir. Kutubxona Twitter'ning "Sizning serveringiz funksiya sifatida" ("Your Server as a Function") maqolasiga asoslangan bo'lib, HTTP serverlari va klientlarini bir-biriga birlashtirilishi mumkin bo'lgan oddiy Kotlin funksiyalari sifatida modellashtirishni ifodalaydi.

* [Javalin](https://javalin.io) Kotlin va Java uchun juda yengil web freymvork bo'lib, WebSocket, HTTP2 va asinxron so'rovlarni qo'llab-quvvatlaydi.

* Ma'lumotlarni saqlash uchun mavjud variantlar qatoriga to'g'ridan-to'g'ri JDBC ulanishi, JPA va NoSQL ma'lumotlar bazalaridan ularning Java drayverlari orqali foydalanish kiradi. JPA uchun [kotlin-jpa kompilyator plagini](no-arg-plugin.md#jpa-support) Kotlin'da kompilyatsiya qilingan klasslarni freymvork talablariga moslashtiradi.

> Siz ko'proq freymvorklarni [https://kotlin.link/](https://kotlin.link/resources) manzilidan topishingiz mumkin.
>
{style="note"}

## Kotlin server-tomon ilovalarini joylashtirish

Kotlin ilovalari Amazon Web Services, Google Cloud Platform va boshqalar kabi Java Web-ilovalarini qo'llab-quvvatlaydigan har qanday hostga joylashtirilishi mumkin.

Kotlin ilovalarini [Heroku](https://www.heroku.com) platformasiga joylashtirish uchun siz [Heroku'ning rasmiy qo'llanmasi](https://devcenter.heroku.com/articles/getting-started-with-kotlin)ga amal qilishingiz mumkin.

AWS Labs [AWS Lambda](https://aws.amazon.com/lambda/) funksiyalarini yozish uchun Kotlin'dan foydalanishni ko'rsatuvchi [namuna loyiha](https://github.com/awslabs/serverless-photo-recognition)ni taqdim etadi.

Google Cloud Platform Kotlin ilovalarini GCP'ga joylashtirish uchun bir qator qo'llanmalarni taklif etadi, ham [Ktor va App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) uchun, ham [Spring va App Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8) uchun. Bundan tashqari, Kotlin Spring ilovasini joylashtirish uchun [interaktiv kod laboratoriyasi](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) mavjud.

## Server-tomonda Kotlin'dan foydalanadigan mahsulotlar

[Corda](https://www.corda.net/) yirik banklar tomonidan qo'llab-quvvatlanadigan va to'liqligicha Kotlin'da yaratilgan ochiq manbali taqsimlangan reyestr platformasidir.

[JetBrains Account](https://account.jetbrains.com/), JetBrains'da butun litsenziya sotish va tasdiqlash jarayoni uchun mas'ul bo'lgan tizim, 100% Kotlin'da yozilgan va 2015 yildan beri hech qanday jiddiy muammosiz ishlab chiqarishda (production'da) ishlamoqda.

[Chess.com](https://www.chess.com/) shaxmatga va bu o'yinni sevuvchi dunyodagi millionlab o'yinchilarga bag'ishlangan veb-saytdir. Chess.com bir nechta HTTP klientlarini uzluksiz sozlash uchun Ktor'dan foydalanadi.

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) muhandislari server-tomon ilovalarini ishlab chiqishda Kotlin'dan va Adobe Experience Platform'da prototiplash uchun Ktor'dan foydalanadilar. Bu platforma tashkilotlarga ma'lumotlar fani (data science) va mashina o'rganish (machine learning)ni qo'llashdan oldin mijozlar ma'lumotlarini markazlashtirish va standartlashtirish imkonini beradi.

## Keyingi qadamlar

* Til bilan chuqurroq tanishish uchun ushbu saytdagi Kotlin hujjatlarini va [Kotlin Koans](koans.md)ni ko'rib chiqing.
* Kotlin korutinlaridan foydalanadigan freymvork – [Ktor yordamida asinxron server ilovalarini yaratishni](https://ktor.io/docs/server-create-a-new-project.html) o'rganing.
* ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/) vebinarini tomosha qiling va Micronaut freymvorkida [Kotlin kengaytma funksiyalari](extensions.md#extension-functions)ni qanday ishlatishingiz mumkinligini ko'rsatuvchi batafsil [qo'llanma](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)ni o'rganing.
* http4k to'liq shakllangan loyihalarni yaratish uchun [CLI](https://toolbox.http4k.org)ni va bitta bash buyrug'i bilan GitHub, Travis va Heroku'dan foydalanib butun bir CD konveyerini (pipeline) yaratish uchun [starter repo'zitariy](https://start.http4k.org)ni taqdim etadi.
* Java'dan Kotlin'ga o'tishni xohlaysizmi? [Java va Kotlin'da satrlar bilan ishlashdagi odatiy vazifalarni](java-to-kotlin-idioms-strings.md) qanday bajarishni o'rganing.
