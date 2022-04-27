import React from "react";

import {CommunityBanner} from '../../blocks/community/community-banner/community-banner';
import {CommunityLayout} from "../../blocks/community/layout/community-layout";
import {KeepInTouch} from "../../blocks/community/keep-in-touch/keep-in-touch";
import {OverviewBottomLink} from '../../blocks/community/overview-bottom-links/overview-bottom-link';

import SlackIcon from '../../public/images/community/icons/keep-in-touch-slack-icon.svg';
import TwitterIcon from '../../public/images/community/icons/keep-in-touch-twitter-icon.svg';
import KotlinIcon from '../../public/images/community/icons/keep-in-touch-kotlin-icon.svg';
import RedditIcon from '../../public/images/community/icons/keep-in-touch-reddit-icon.svg';
import StackOverflowIcon from '../../public/images/community/icons/keep-in-touch-so-icon.svg';
import YoutubeIcon from '../../public/images/community/icons/keep-in-touch-youtube-icon.svg';
import TalkingKotlinIcon from '../../public/images/community/icons/keep-in-touch-talking-kotlin-icon.svg';
import LinkedInIcon from '../../public/images/community/icons/keep-in-touch-linkedin-icon.svg';
import YoutrackIcon from '../../public/images/community/icons/keep-in-touch-youtrack-icon.svg';

function Index() {
    return (
        <CommunityLayout title={"Community"}>
            <CommunityBanner title="Get involved in the community!">
                The Kotlin community is becoming more active all the time,
                and we want to do whatever we can to foster this community and help it grow.
                Here you can find online resources and information about activities in your area.
                If you can't find any, we encourage you to organize one yourself!
                JetBrains is here to provide help and support.
            </CommunityBanner>

            <KeepInTouch links={[
                {
                    icon: SlackIcon,
                    title: 'Slack',
                    description: 'Let’s chat with us in real time',
                    link: 'https://kotlinlang.slack.com/'
                },
                {
                    icon: TwitterIcon,
                    title: 'Twitter',
                    description: 'Stay tuned with the latest news',
                    link: 'https://twitter.com/kotlin'
                },
                {
                    icon: KotlinIcon,
                    title: 'Kotlin Blog',
                    description: 'Official language blog',
                    link: 'https://blog.jetbrains.com/kotlin/'
                },
                {
                    icon: RedditIcon,
                    title: 'Reddit',
                    description: 'Join the online Kotlin community',
                    link: 'https://www.reddit.com/r/Kotlin/'
                },
                {
                    icon: StackOverflowIcon,
                    title: 'StackOverflow',
                    description: 'Find the best solutions',
                    link: 'https://stackoverflow.com/questions/tagged/kotlin'
                },
                {
                    icon: YoutubeIcon,
                    title: 'YouTube',
                    description: 'All latest videos',
                    link: 'https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw'
                },
                {
                    icon: TalkingKotlinIcon,
                    title: 'Talking Kotlin',
                    description: 'Let’s chat with us in real time',
                    link: 'http://talkingkotlin.com/'
                },
                {
                    icon: LinkedInIcon,
                    title: 'LinkedIn',
                    description: 'Mostly for job related post',
                    link: 'https://www.linkedin.com/groups/7417237/profile'
                },
                {
                    icon: YoutrackIcon,
                    title: 'Issue Tracker',
                    description: 'Find the issues',
                    link: 'https://youtrack.jetbrains.com/issues/'
                },
            ]}/>

            <OverviewBottomLink
                title={"Join a Kotlin User Group\nor start your own"}
                buttonLink={"/community/user-groups/"}
                buttonTitle={"All KUGs →"}
            />
            <OverviewBottomLink
                title={"Get inspired at a Kotlin event\nor host one yourself"}
                buttonLink={"/community/events"}
                buttonTitle={"Talks and Events →"}
            />
        </CommunityLayout>
    )
}

export default Index;
