import React from "react";
import {CommunityLayout} from "../../components/layout/community-layout";
import {KugsBanner} from "../../components/kugs-banner/kugs-banner";

function UserGroups() {
    return (
        <CommunityLayout title={"Kotlin User Groups"}>
            <div className={"ktl-container"}>
                <KugsBanner title={"Kotlin User Groups (KUGs)"}>
                    A Kotlin User Group (or “KUG”) is a community of people who come together
                    to share their programming experience involving Kotlin and its ecosystem.
                </KugsBanner>
            </div>
        </CommunityLayout>
    );
}

export default UserGroups;