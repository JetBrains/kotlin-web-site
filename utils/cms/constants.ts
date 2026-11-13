/**
 * URL prefix for every CMS page: each synced site is served at `/pages/<site slug>/`
 * and its subpages at `/pages/<site slug>/<page path>/`.
 * Must match the route: `pages/pages/[...slug].tsx`.
 */
export const CMS_BASE_PATH = '/pages';

/**
 * URL prefix of the downloaded Notion images: `/cms/<root id>/notion-assets/…`.
 * Must match the copy step in `scripts/generate-data.mjs`.
 */
export const CMS_ASSETS_PATH = '/cms';
