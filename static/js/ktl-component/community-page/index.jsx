import React from "react";

import {CommunityTopMenu} from "./components/community-top-menu";
import {CommunityKeepInTouchCard} from "./components/community-keep-in-touch-card";

import '@jetbrains/kotlin-web-site-ui/dist/typography.css';
import '@jetbrains/kotlin-web-site-ui/dist/grid.css';
import './style.scss'

import SlackIcon from './icons/keep-in-touch-slack-icon.svg';
import TwitterIcon from './icons/keep-in-touch-twitter-icon.svg';
import KotlinIcon from './icons/keep-in-touch-kotlin-icon.svg';
import RedditIcon from './icons/keep-in-touch-reddit-icon.svg';
import StackOverflowIcon from './icons/keep-in-touch-so-icon.svg';
import YoutubeIcon from './icons/keep-in-touch-youtube-icon.svg';
import TalkingKotlinIcon from './icons/keep-in-touch-talking-kotlin-icon.svg';
import LinkedInIcon from './icons/keep-in-touch-linkedin-icon.svg';
import YoutrackIcon from './icons/keep-in-touch-youtrack-icon.svg';

const CommunityPage = (props) => {

  const {path} = props;

  return (
    <div className="community-page-wrapper">
      <CommunityTopMenu path={path}/>

      <div className="community-keep-in-touch-wrapper">
        <section className="ktl-container">
          <h2 className="ktl-h1">Keep in Touch</h2>

          <div className="community-keep-in-touch-grid ktl-offset-top-l">
            <CommunityKeepInTouchCard icon={SlackIcon} title="Slack" description="Let’s chat with us in real time" link="https://kotlinlang.slack.com/"/>
            <CommunityKeepInTouchCard icon={TwitterIcon} title="Twitter" description="Stay tuned with the latest news" link="https://twitter.com/kotlin"/>
            <CommunityKeepInTouchCard icon={KotlinIcon} title="Kotlin Blog" description="Official language blog" link="https://blog.jetbrains.com/kotlin/"/>
            <CommunityKeepInTouchCard icon={RedditIcon} title="Reddit" description="Join the online Kotlin community" link="https://www.reddit.com/r/Kotlin/"/>
            <CommunityKeepInTouchCard icon={StackOverflowIcon} title="StackOverflow" description="Find the best solutions" link="https://stackoverflow.com/questions/tagged/kotlin"/>
            <CommunityKeepInTouchCard icon={YoutubeIcon} title="YouTube" description="All latest videos" link="https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw"/>
            <CommunityKeepInTouchCard icon={TalkingKotlinIcon} title="Talking Kotlin" description="Let’s chat with us in real time" link="http://talkingkotlin.com/?_gl=1*e9nbis*_ga*MjAxODgxMzAwNi4xNjQ4MzA1Nzg2*_ga_J6T75801PF*MTY0ODgxOTM3MS44LjEuMTY0ODgxOTM4Ny4w"/>
            <CommunityKeepInTouchCard icon={LinkedInIcon} title="LinkedIn" description="Mostly for job related post" link="https://www.linkedin.com/groups/7417237/profile"/>
            <CommunityKeepInTouchCard icon={YoutrackIcon} title="Issue Tracker" description="Find the issues" link="https://youtrack.jetbrains.com/issues/KT?_gl=1*e9nbis*_ga*MjAxODgxMzAwNi4xNjQ4MzA1Nzg2*_ga_J6T75801PF*MTY0ODgxOTM3MS44LjEuMTY0ODgxOTM4Ny4w"/>
          </div>

          <div className="community-keep-in-touch-other-resources ktl-offset-top-l">
            <h3 className="ktl-h3">Other resources:</h3>
            <a href="https://kotlin.link/" target="_blank" rel="noreferrer noopener" className="ktl-text-1 rs-link rs-link_external">Awesome Kotlin</a>
          </div>

        </section>
      </div>


    </div>
  )
}

export default CommunityPage;
