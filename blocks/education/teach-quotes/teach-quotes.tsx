import React, { FC } from 'react';
import QuotesSlider from '@jetbrains/kotlin-web-site-ui/out/components/quotes-slider';

const quotes = [
    {
        title: 'David Vaughn, University of Missouri-St. Louis',
        text: "Kotlin is faster to develop and comprehend what is happening; near 100% backwards compatibility makes it easy to show in Java and translate into Kotlin while still utilizing every available library from Java; Students seem to understand it fairly quickly."
    },
    {
        title: 'Sergey Bratus, Dartmouth College',
        text: "I used Kotlin's features such as nullable types and smart casts as an excuse to discuss broader topics of programming languages design and security. Without Kotlin, the class would have been a lot less interesting for me :)"
    },
    {
        title: 'Luka Pavlic, University of Maribor',
        text: 'Kotlin offers cleaner code, less violations of object-orientation, some patterns are idioms (object, extension functions, observers...).'
    }
];

export const TeachQuotes: FC = () => {
    return <QuotesSlider quotes={quotes} large />;
};
