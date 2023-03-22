module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    'rules': {
        'no-else-return': 'error',
        'no-multi-spaces': 'error',
        'no-whitespace-before-property': 'error',
        'camelcase': 'error',
        'new-cap': 'error',
        'no-console': 'off',
        'comma-dangle': 'error',
        'no-var': 'error',
        'prefer-const': 'off',
        'quote-props': 'off',
        'vue/multi-word-component-names': 'off',
        'no-case-declarations': 'off',
        'prefer-regex-literals': 'off',
        'vue/no-mutating-props': 'off',
        'dot-notation': 'off',
        'vue/no-reserved-component-names': 'off',
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'import/no-webpack-loader-syntax': 'off'
    },
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        ecmaVersion: 8
    }
};
