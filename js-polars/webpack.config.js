import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { default as CopyPlugin } from "copy-webpack-plugin"

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    entry: './pkg/js_polars.js', // input file of the JS bundle
    output: {
        filename: "index.js",
        library: { type: "module", },
        module: true,
        path: resolve(__dirname, 'dist'), // directory of where the bundle will be created at
    },
    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: "webassembly/async"
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "pkg/js_polars.d.ts", to: "index.d.ts" },
            ],
        }),
    ],
    experiments: {
        futureDefaults: true,
        outputModule: true
    },
}