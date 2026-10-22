export type FaqItem = {
    question: string;
    answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
    {
        question: 'What is Compose Multiplatform?',
        answer: 'Compose Multiplatform is an open-source, declarative UI framework developed by JetBrains for building shared UIs across Android, iOS, desktop, and web with Kotlin. It’s powered by Kotlin Multiplatform and Jetpack Compose, so it uses APIs Android developers already know.',
    },
    {
        question: 'How is Compose Multiplatform different from Jetpack Compose?',
        answer: 'Jetpack Compose is Google’s UI framework for Android. Compose Multiplatform is JetBrains\' declarative UI framework that extends it to iOS, desktop, and web, sharing most of the same API. On Android, Compose Multiplatform runs on Jetpack Compose directly, so your existing Compose skills and most of your existing code carry over to the other targets.',
    },
    {
        question: 'Is Compose Multiplatform production-ready?',
        answer: 'Yes. Android, iOS, and desktop are Stable and ready for production. Companies including Sony, Booking.com, and Perk use Compose Multiplatform for projects ranging from customer-facing apps to internal tools. Web support is in Beta – ready to try and build with, but still evolving.',
    },
    {
        question: 'Do I need Kotlin Multiplatform to use Compose Multiplatform?',
        answer: 'Yes, Kotlin Multiplatform shares your business logic across platforms, and Compose Multiplatform shares your UI on top of it. You can also use Kotlin Multiplatform alone – many teams run it with a fully native UI on each platform, then adopt Compose Multiplatform when it makes sense.',
    },
    {
        question: 'Who is Compose Multiplatform for?',
        answer: 'Teams that write Kotlin and want a single UI codebase across Android, iOS, desktop, and web. It fits best when your app is mostly custom UI over shared business logic – dashboards, feeds, forms, commerce, internal tools – and when the same team owns more than one platform.',
    },
    {
        question: 'Can I use Compose Multiplatform in an existing app?',
        answer: 'Yes, and you don\'t have to commit to all of it at once. A Compose screen embeds into UIKit, SwiftUI, Android Views, or Swing, so you can share a single component, one screen, or the whole UI while the rest of your app stays as it is.',
    },
];
