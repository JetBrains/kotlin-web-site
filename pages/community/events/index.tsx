import React from 'react';
import Button from '@rescui/button';
import { EventList } from '../../../blocks/community/event-list/event-list';
import { CommunityLayout } from '../../../blocks/community/layout/community-layout';

function UserGroups() {
    return (
        <CommunityLayout title={'Community Events'} ogImageName={'community.png'}>
            <EventList />

            <div className={'ktl-layout ktl-layout--center ktl-offset-bottom-xxl'}>
                <div className={'ktl-row'}>
                    <div className="ktl-col-12 ktl-col-md-6 ktl-col-lg-5">
                        <h3 className={'ktl-h2 ktl-offset-top-xxl'}>Support for Kotlin speakers</h3>

                        <p className={'ktl-text-1 ktl-offset-top-s ktl-offset-bottom-m'}>
                            If you are planning to give a presentation about Kotlin at an event, please let us know
                            about your upcoming talk by filling out this form. We'll be glad to ship a t-shirt for you,
                            along with some stickers and swag for the participants of the event you’ll be speaking at.
                        </p>

                        <Button
                            href={'https://surveys.jetbrains.com/s3/Submit-a-Kotlin-Talk'}
                            target="_blank"
                            mode={'outline'}
                            size={'l'}
                        >
                            I am a Speaker →
                        </Button>
                    </div>

                    <div className="ktl-col-12 ktl-col-md-6 ktl-col-lg-5 ktl-col-lg-offset-1">
                        <h3 className={'ktl-h2 ktl-offset-top-xxl'}>Organize a Kotlin Night</h3>

                        <p className={'ktl-text-1 ktl-offset-top-s ktl-offset-bottom-m'}>
                            A Kotlin Night is a meetup that includes 3-4 talks on Kotlin or related technologies, and
                            you can get support from JetBrains to organize one.
                        </p>

                        <Button
                            href={'https://kotlinlang.org/docs/kotlin-night-guidelines.html'}
                            mode={'outline'}
                            size={'l'}
                        >
                            Organize a Kotlin Night →
                        </Button>
                    </div>
                </div>
            </div>
        </CommunityLayout>
    );
}

export default UserGroups;
