import React from 'react';

import { CommunityBanner } from '../../blocks/community/community-banner/community-banner';
import { CommunityLayout } from '../../blocks/community/layout/community-layout';
import { KeepInTouch } from '../../blocks/community/keep-in-touch/keep-in-touch';
import { OverviewBottomLink } from '../../blocks/community/overview-bottom-links/overview-bottom-link';

import SlackIcon from '../../public/images/community/icons/keep-in-touch-slack-icon.svg';
import TwitterIcon from '../../public/images/community/icons/keep-in-touch-twitter-icon.svg';
import KotlinIcon from '../../public/images/community/icons/keep-in-touch-kotlin-icon.svg';
import RedditIcon from '../../public/images/community/icons/keep-in-touch-reddit-icon.svg';
import StackOverflowIcon from '../../public/images/community/icons/keep-in-touch-so-icon.svg';
import YoutubeIcon from '../../public/images/community/icons/keep-in-touch-youtube-icon.svg';
import TalkingKotlinIcon from '../../public/images/community/icons/keep-in-touch-talking-kotlin-icon.svg';
import LinkedInIcon from '../../public/images/community/icons/keep-in-touch-linkedin-icon.svg';
import YoutrackIcon from '../../public/images/community/icons/keep-in-touch-youtrack-icon.svg';
import { DesktopBreak } from '../../components/desktop-break/desktop-break';

function Index() {
    return (
        <CommunityLayout title={'Community'} ogImageName={'community.png'}>
            <CommunityBanner title="Get involved&nbsp;in<br/> the&nbsp;community">
                Find online resources and information about community activities. Can&rsquo;t find any? Organize your
                own &mdash; JetBrains is&nbsp;always here to&nbsp;support you!
            </CommunityBanner>

            <KeepInTouch
                links={[
                    {
                        icon: SlackIcon,
                        title: 'Slack',
                        description: 'Get answers to your questions.',
                        link: 'https://slack-chats.kotlinlang.org/',
                    },
                    {
                        icon: TwitterIcon,
                        title: 'X',
                        description: 'Quick tips and news, straight to your feed.',
                        link: 'https://twitter.com/kotlin',
                    },
                    {
                        icon: KotlinIcon,
                        title: 'Kotlin Blog',
                        description: 'Extra, extra! Get the details for new releases.',
                        link: 'https://blog.jetbrains.com/kotlin/',
                    },
                    {
                        icon: RedditIcon,
                        title: 'Reddit',
                        description: 'Community-curated Kotlin content.',
                        link: 'https://www.reddit.com/r/Kotlin/',
                    },
                    {
                        icon: StackOverflowIcon,
                        title: 'StackOverflow',
                        description: 'Got a question? Get your answer!',
                        link: 'https://stackoverflow.com/questions/tagged/kotlin',
                    },
                    {
                        icon: YoutubeIcon,
                        title: 'YouTube',
                        description: 'Video content for visual learners!',
                        link: 'https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw',
                    },
                    {
                        icon: TalkingKotlinIcon,
                        title: 'Talking Kotlin',
                        description: 'A podcast with Kotlin experts.',
                        link: 'http://talkingkotlin.com/',
                    },
                    {
                        icon: LinkedInIcon,
                        title: 'LinkedIn',
                        description: 'Join the professional community.',
                        link: 'https://www.linkedin.com/groups/7417237/profile',
                    },
                    {
                        icon: YoutrackIcon,
                        title: 'Issue Tracker',
                        description: 'Share feedback and report bugs.',
                        link: 'https://youtrack.jetbrains.com/issues/kt',
                    },
                ]}
            />

            <OverviewBottomLink buttonLink={'/community/user-groups/'} buttonTitle={'All KUGs →'}>
                Join a&nbsp;Kotlin User Group
                <DesktopBreak /> or&nbsp;start your own
            </OverviewBottomLink>
        </CommunityLayout>
    );
}

export default Index;
