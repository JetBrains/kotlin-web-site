import cn from 'classnames';
import {
    AndroidIcon,
    AppleIcon,
    ServerIcon,
    ComputerIcon,
    GlobusIcon,
    SpringIcon,
    KtorIcon,
    ExposedIcon
} from '@rescui/icons';
import { CasePlatform, CaseFramework } from '../case-studies';
import styles from './technology-icon.module.css';

type TechnologyIconProps = {
    type: 'platform';
    value: CasePlatform;
} | {
    type: 'framework';
    value: CaseFramework;
};

export const TechnologyIcon = ({ type, value }: TechnologyIconProps) => {
    return (
        <span
            className={cn(styles.technology, styles[`technology_${value}`])}
            title={value}
        >
            {type === 'platform' ? getPlatformIcon(value) : getFrameworkIcon(value)}
        </span>
    );
};

const getPlatformIcon = (p: CasePlatform) => {
    switch (p) {
        case 'android':
            return <AndroidIcon size="l" />;
        case 'ios':
            return <AppleIcon size="l" />;
        case 'desktop':
            return <ComputerIcon size="l" />;
        case 'frontend':
            return <GlobusIcon size="l" />;
        case 'backend':
            return <ServerIcon size="l" />;
        case 'compose-multiplatform':
            return <img
                src="/images/case-studies/compose-multiplatform.svg" alt="" />;
        default:
            return null;
    }
};

const getFrameworkIcon = (f: CaseFramework) => {
    switch (f) {
        case 'spring':
            return <SpringIcon size="l" />;
        case 'ktor':
            return <KtorIcon size="l" />;
        case 'exposed':
            return <ExposedIcon size="l" />;
        default:
            return null;
    }
};
