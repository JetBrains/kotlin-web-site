import React from "react";

import {CommunityBanner} from '../../components/community-banner/community-banner';
import {CommunityLayout} from "../../components/layout/community-layout";

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
        </CommunityLayout>
    )
}

export default Index;