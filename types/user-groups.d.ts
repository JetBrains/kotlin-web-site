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
    position?: UserGroupPosition;
    isVirtual: boolean;
}

interface UserGroupPosition {
    lat: number;
    lng: number;
}
