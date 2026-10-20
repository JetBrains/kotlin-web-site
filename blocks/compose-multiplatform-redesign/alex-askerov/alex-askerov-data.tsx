import React, { ReactNode } from 'react';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    photo: string;
    paragraphs: ReactNode[];
}

// Copy verbatim from the mock. The mock draws one slide of four ("1/4"); the other three
// repeat it as placeholders until the designer supplies the real testimonials (R12).
const ALEX_ASKEROV: Omit<Testimonial, 'id'> = {
    name: 'Alex Askerov',
    role: 'Mobile Development Unit Lead at Wrike',
    photo: '/images/compose-multiplatform-redesign/alex-askerov.png',
    paragraphs: [
        'Building on our success with Kotlin Multiplatform integration, we’ve decided to go ahead with Compose Multiplatform for building Calendar View. In less than three months, it was live on the App Store and Google Play.',
        'Most of the client logic was implemented by a single Android developer. From the iOS side, only integration was required. Compose Multiplatform was even smoother [than KMP] to integrate, requiring minimal work from iOS developers.',
    ],
};

export const TESTIMONIALS: Testimonial[] = [1, 2, 3, 4].map((n) => ({ ...ALEX_ASKEROV, id: `alex-askerov-${n}` }));
