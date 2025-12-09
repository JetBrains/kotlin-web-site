import caseStudiesDataRaw from '../../data/case-studies/case-studies.yml';
import { LogoItem } from './index';

type CaseStudyItem = typeof caseStudiesDataRaw[number];

const logos: LogoItem[] = caseStudiesDataRaw.items
    .map((item: CaseStudyItem) => {
        if (item.type === 'multiplatform' && item.carousel) {
            const link = item.carousel?.link || item.link || (
                (item.media?.type === 'youtube' && item.media?.videoId) ?
                    `https://youtu.be/${item.media?.videoId}` :
                    null
            );

            const logo = item.carousel?.logo || item.alternateLogo?.[0] || item.logo?.[0];

            if (link && logo) return { id: item.id, logo, link };
        }

        return null;
    })
    .filter(Boolean);

export default logos;
