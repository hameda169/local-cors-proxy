import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    { languageOptions: { globals: globals.node }, plugins: { prettier } },
    pluginJs.configs.all,
    prettierRecommended,
    {
        rules: {
            'prettier/prettier': 'error',
            'no-console': 'off',
            'sort-keys': 'off',
            'one-var': 'off',
            'no-undefined': 'off',
            'func-style': 'off',
            'no-ternary': 'off',
        },
    },
];
