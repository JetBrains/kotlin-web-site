import cn from 'classnames';
import { AndroidIcon, AppleIcon, ServerIcon, ComputerIcon, GlobusIcon } from '@rescui/icons';
import { CasePlatform } from '../case-studies';
import styles from './platform-icon.module.css';

export const PlatformIcon = ({ platform }: { platform: CasePlatform }) => {
    return (
        <span className={cn(styles.platform, styles[`platform_${platform}`])} title={platform}>
            {getPlatformIcon(platform)}
        </span>
    );
};

const getPlatformIcon = (p: CasePlatform) => {
    switch (p) {
        case 'android':
            return <AndroidIcon size="l" data-render-all-sizes={true} />;
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
