import cn from 'classnames';
import {
    AndroidIcon,
    AppleIcon,
    ServerIcon,
    ComputerIcon,
    GlobusIcon,
    SpringIcon,
    KtorIcon,
    ExposedIcon,
} from '@rescui/icons';
import { CasePlatform, CaseFramework } from '../case-studies';
import styles from './technology-icon.module.css';

type PlatformIconProps = {
    value: CasePlatform;
};

type FrameworkIconProps = {
    value: CaseFramework;
};

export const PlatformIcon = ({ value }: PlatformIconProps) => {
    return (
        <span className={cn(styles.icon)} title={value}>
            {getPlatformIcon(value)}
        </span>
    );
};

export const FrameworkIcon = ({ value }: FrameworkIconProps) => {
    return (
        <span className={cn(styles.icon)} title={value}>
            {getFrameworkIcon(value)}
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
            return <img src="/images/case-studies/compose-multiplatform.svg" alt="" />;
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
