import { CasePlatform, CaseTypeSwitch, Platforms } from './case-studies';
import { parseBoolean, parseEnum, parseStringArray } from '../../utils';

export function parseType(v: unknown): CaseTypeSwitch {
    return parseEnum(v, ['all', 'multiplatform', 'server-side'], 'all');
}

export function serializeType(v: CaseTypeSwitch): string | undefined {
    return v === 'all' ? undefined : v;
}

export function parsePlatforms(v: unknown): CasePlatform[] {
    return parseStringArray(v, [...Platforms], [...Platforms]);
}

export function serializePlatforms(v: CasePlatform[]): string | undefined {
    return v.length === Platforms.length ? undefined : v.join(',');
}

export function parseCompose(v: unknown): boolean {
    return parseBoolean(v, false);
}

export function serializeCompose(v: boolean): string | undefined {
    return v ? 'true' : undefined;
}