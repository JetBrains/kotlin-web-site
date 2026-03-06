---
id: "case-study-netvirta"
slug: "netvirta"
title: "Netvirta"
country: "United States"
size: "50-100"
usedProductTitle: "Kotlin\u00A0Multiplatform"
usedProductLink: "/multiplatform/"
industry: "Software Development, Mobile Development"
coverImg: /images/case-studies/content/netvirta-cover.png
---


<div class="rs-subtitle-2">
<a href="http://www.netvirta.com/" target="_blank" rel="noopener noreferrer">NetVirta ↗</a> offers an array of solutions, including full-body, foot, and head scanning apps that are used both in stores and within the customer's home.
</div>

### Could you say a few words about your company?

A leader in the 3D body-scanning industry, NetVirta is passionate about changing the future of fit. We offer an array of solutions, including full-body, foot, and head scanning apps used both in stores and within the customer's home. Our company's wide variety of scanning products, specific to different parts of the body, can be found across a wide range of industries.

### How is Kotlin Multiplatform used in your product (maybe with respect to its architecture scheme)?

We use Kotlin Multiplatform to share common code such as data classes and interfaces, as well as database, networking, and business logic. We use the Model View Presenter design pattern, where the Model and Presenter are shared in the common code, while the View is in Swift, and Kotlin implements the View interfaces which reside in the common code.

### Why did your team decide to use Kotlin Multiplatform, and what alternatives did you consider?

We are encouraged to try out different technologies to fit our requirements. We have used React Native, and we are trying out Flutter.

### What have been your most significant gains and pains?

+ Code reuse – We've saved a lot of time on many projects with a relatively small team.
+ Ease of using Platform dependent APIs using expect/actual.
- The tooling is still immature. Some Kotlin Multiplatform errors can only be caught during runtime, especially when dealing with threadings in Kotlin Native. Some coroutine features were lacking when we first tried it, and we've had to use many workarounds.
- Lack of choices for community libraries. For example, Ktor is the only Networking client.
- Threading in Kotlin Native, which is not friendly to beginners.
- Lack of SDK support – Version 1.3.70 just came out, but we still need to wait for community libraries to update to 1.3.70 before we jump aboard.

### Do you have any tips or advice you'd like to share with our readers?

- Remember not to use object classes in Kotlin Multiplatform.
- Don't mutate anything that you pass into the common code. That will result in runtime errors.
- Remember to de-initialize your objects.

<div class="rs-subtitle-2">
> Code reuse – We've saved a lot of time on many projects with a relatively small team.
>
> <small>Liew Jun Tung, Lead Software Developer at NetVirta</small>
</div>

## Contact

Liew Jun Tung, Lead Software Developer at NetVirta

<a href="mailto:juntung@netvirta.com">juntung@netvirta.com</a>
