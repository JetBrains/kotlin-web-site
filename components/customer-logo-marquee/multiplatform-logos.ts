import caseStudiesDataRaw from '../../data/case-studies/case-studies.yml';
import { LogoItem } from './index';

type CaseStudyItem = typeof caseStudiesDataRaw[number];

const logos: LogoItem[] = caseStudiesDataRaw.items
    .map((item: CaseStudyItem) => {
        const link = item.carousel?.link || item.link;
        const logo = item.carousel?.logo;

        if (item.type === 'multiplatform' && link && logo) return {
            id: item.id,
            logo,
            link
        };

        return null;
    })
    .filter(Boolean);

export default logos;
