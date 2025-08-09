import doordash from './logos/doordash-dark.svg'
import kingfisher from './logos/kingfisher-dark.svg'
import ing from './logos/ING.svg'
import n26 from './logos/N26.svg'
import adobe from './logos/adobe-logo.svg'
import allegro from './logos/allegro.svg'
import atlassian from './logos/atlassian.svg'
import aws from './logos/aws.svg'
import corda from './logos/c-rda.svg'
import expediaGroup from './logos/expedia grour.svg'
import faire from './logos/faire-dark.svg'
import flux from './logos/flux.svg'
import intuit from './logos/intuit.svg'
import ktor from './logos/ktor.svg'
import memobank from './logos/memobank.svg'
import mercedes from './logos/mercedes-io-dark.svg'
import novatec from './logos/novatec-dark.svg'
import olx from './logos/olx.svg'
import shazam from './logos/shazam.svg'
import spring from './logos/spring.svg'

interface LogoItem {
    id: ImgSrc;
    link: string;
}

const logos: LogoItem[] = [
    {
        id: doordash,
        link: 'https://www.doordash.com/',
    },
    {
        id: kingfisher,
        link: 'https://www.kingfisher.com/',
    },
    {
        id: ing,
        link: 'https://www.ing.com/',
    },
    {
        id: n26,
        link: 'https://n26.com/',
    },
    {
        id: adobe,
        link: 'https://www.adobe.com/',
    },
    {
        id: allegro,
        link: 'https://allegro.tech/',
    },
    {
        id: atlassian,
        link: 'https://www.atlassian.com/',
    },
    {
        id: aws,
        link: 'https://aws.amazon.com/',
    },
    {
        id: corda,
        link: 'https://r3.com/get-corda/',
    },
    {
        id: expediaGroup,
        link: 'https://www.expediagroup.com/',
    },
    {
        id: faire,
        link: 'https://www.faire.com/',
    },
    {
        id: flux,
        link: 'https://www.flux.io/',
    },
    {
        id: intuit,
        link: 'https://www.intuit.com/',
    },
    {
        id: ktor,
        link: 'https://ktor.io/',
    },
    {
        id: memobank,
        link: 'https://memo.bank/',
    },
    {
        id: mercedes,
        link: 'https://www.mercedes-benz.io/',
    },
    {
        id: novatec,
        link: 'https://www.novatec-gmbh.de/',
    },
    {
        id: olx,
        link: 'https://www.olx.com/',
    },
    {
        id: shazam,
        link: 'https://www.shazam.com/',
    },
    {
        id: spring,
        link: 'https://spring.io/',
    },
];

export default logos;
