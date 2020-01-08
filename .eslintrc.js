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
        parser: 'babel-eslint'
    }
};
