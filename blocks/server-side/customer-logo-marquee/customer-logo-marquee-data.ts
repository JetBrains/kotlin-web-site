import netflixLogo from './logos/logo-netflix.svg';

interface LogoItem {
    id: ImgSrc;
    link: string;
}

const logos: LogoItem[] = [
    {
        id: netflixLogo,
        link: 'https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/',
    },
    {
        id: netflixLogo,
        link: 'https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23',
    },
    {
        id: netflixLogo,
        link: 'https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc',
    },
    {
        id: netflixLogo,
        link: 'https://www.youtube.com/watch?v=hZPL8QqiLi8',
    },
    {
        id: netflixLogo,
        link: 'https://kotlinlang.org/lp/multiplatform/case-studies/baidu/',
    },
    {
        id: netflixLogo,
        link: 'https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0',
    },
    {
        id: netflixLogo,
        link: 'https://kotlinlang.org/lp/multiplatform/case-studies/cash-app',
    },
    {
        id: netflixLogo,
        link: 'https://quizlet.com/blog/shared-code-kotlin-multiplatform',
    },
    {
        id: netflixLogo,
        link: 'https://www.youtube.com/watch?v=Qu3jZX8RyFk',
    },
];

export default logos;
