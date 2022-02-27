import rust from "@wasm-tool/rollup-plugin-rust";
import dts from "rollup-plugin-dts";

export default commandLineArgs => [{
    input: {
        index: "Cargo.toml",
    },
    output: {
        dir: 'dist/',
        format: 'es'
    },
    plugins: [rust({
        debug: commandLineArgs.dev,
        topLevelAwait: true,
        serverPath: "dist/"
    })]
}, {
    input: "target/wasm-pack/js-polars/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
}];
