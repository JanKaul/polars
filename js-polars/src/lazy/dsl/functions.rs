use polars_lazy::functions;
use wasm_bindgen::prelude::wasm_bindgen;

use super::Expr;

#[wasm_bindgen]
pub fn col(name: &str) -> Expr {
    functions::col(name).into()
}
