const WorkerPlugin = require('worker-plugin');

module.exports = {
    configureWebpack: {
        output: {
            globalObject: 'this'
        },
        plugins: [
            new WorkerPlugin()
        ]
    },
    chainWebpack: config => {
        config.module
            .rule('file-loader')
            .test(/\.wasm$/)
            .type('javascript/auto')
            .use('file-loader')
            .loader('file-loader')
            .end();
    },

    runtimeCompiler: true,
    productionSourceMap: false
};
