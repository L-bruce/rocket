module.exports = opts => {
    const isDevelopment = opts.env() == 'development'

    return {
        // sourceType: 'module',
        sourceType: 'unambiguous',
        presets: [
            [
                '@babel/preset-env',
                {
                    corejs: 3,
                    modules: false,
                    loose: true,
                    useBuiltIns: 'entry',
                    targets: {
                        browsers: ['last 2 versions', 'safari >= 7', 'ie>=9'],
                    },
                },
            ],
            ['@babel/preset-react'],
            ['@babel/preset-typescript'],
        ],
        plugins: [
            'babel-plugin-styled-components',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-syntax-dynamic-import',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-proposal-private-methods', { loose: true }],
            ['@babel/plugin-transform-runtime'],
            [
                'import',
                {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                },
                'antd',
            ],
        ],
        compact: false,
    }
}
