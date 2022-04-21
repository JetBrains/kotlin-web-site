type UserGroupsData = UserGroupArea[];

interface UserGroupArea {
    section: string;
    anchorId: string;
    groups: (UserGroupVirtual | UserGroupLocal)[]
}

interface UserGroup {
    name: string;
    country: string;
    url: string;
}

interface UserGroupVirtual extends UserGroup {
    isVirtual: boolean;
}

interface UserGroupLocal extends UserGroup {
    position: UserGroupPosition
}

interface UserGroupPosition {
    lat: number;
    lng: number;
}
