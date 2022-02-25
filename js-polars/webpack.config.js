import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { default as WasmPackPlugin } from "@wasm-tool/wasm-pack-plugin"
import { default as DtsBundleWebpack } from "dts-bundle-webpack"

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    entry: './pkg/index.js', // input file of the JS bundle
    target: "es2017",
    output: {
        filename: "index.js",
        library: { type: "module", },
        chunkFormat: "module",
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
        new WasmPackPlugin({
            crateDirectory: ".", // Define where the root of the rust code is located (where the cargo.toml file is located)
        }),
        new DtsBundleWebpack({
            name: "js-polars",
            baseDir: ".",
            main: "pkg/index.d.ts",
            out: "dist/index.d.ts"
        })
    ],
    experiments: {
        asyncWebAssembly: true,
        outputModule: true
    }
}