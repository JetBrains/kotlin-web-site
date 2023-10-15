import React from 'react';
import { CommunityLayout } from '../../../blocks/community/layout/community-layout';
import { KugsBanner } from '../../../blocks/community/kugs-banner/kugs-banner';
import userGroupsDataRaw from '../../../data/user-groups.yml';
import { KugMap } from '../../../blocks/community/kug-map/kug-map';
import { KugsList } from '../../../blocks/community/kugs-list/kugs-list';

const userGroupsData = userGroupsDataRaw as UserGroupsData;

function UserGroups() {
    return (
        <CommunityLayout title={'Kotlin User Groups'} ogImageName={'community.png'}>
            <div className={'ktl-layout ktl-layout--center'}>
                <KugsBanner title={'Kotlin User Groups (KUGs)'}>
                    A Kotlin User Group (or “KUG”) is a community of people who come together to share their
                    experience involving Kotlin and its ecosystem.
                </KugsBanner>

                <KugMap userGroupData={userGroupsData} />

                <KugsList userGroupData={userGroupsData} />
            </div>
        </CommunityLayout>
    );
}

export default UserGroups;
