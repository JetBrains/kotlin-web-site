import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = [
    ...nextCoreWebVitals,
    prettier,
    {
        rules: {
            'react/no-unescaped-entities': 'off',
            '@next/next/no-page-custom-font': 'off',
            '@next/next/no-img-element': 'off',
        },
    },
];

export default eslintConfig;
