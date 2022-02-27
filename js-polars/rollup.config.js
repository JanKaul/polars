import rust from "@wasm-tool/rollup-plugin-rust";

export default {
    input: {
        index: "Cargo.toml",
    },
    output: {
        dir: 'dist/',
        format: 'es'
    },
    plugins: [rust({
        debug: true,
        topLevelAwait: true,
        serverPath: "dist/"
    })]
};
