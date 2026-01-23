import React from 'react';
import { Button } from '@rescui/button';
import { SERVER_SIDE_TITLE, SERVER_SIDE_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import { LandingLayout } from '../../../components/landing-layout/landing-layout';

import '../styles.css';

const TOP_MENU_ITEMS = [
    {
        url: '/case-studies/?type=server-side',
        title: 'Success stories'
    }
];

export default function ServerSideCaseStudy() {
    return (
        <LandingLayout
            title={'Kotlin for server-side Case Study'}
            ogImageName={'server-side.png'}
            description={''}
            currentTitle={SERVER_SIDE_TITLE}
            currentUrl={SERVER_SIDE_URL}
            topMenuTitle={SERVER_SIDE_TITLE}
            topMenuHomeUrl={SERVER_SIDE_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={'#get-started'}>Get started</Button>}
            canonical={'https://kotlinlang.org/server-side/case-studies/'}
            dataTestId={'server-side-case-study-page'}
        >
            {/* Content will be added here */}
        </LandingLayout>
    );
}
