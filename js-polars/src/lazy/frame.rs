use std::ops::Deref;

use js_sys::Error;
use polars_lazy::prelude::LazyFrame as PLazyFrame;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

use crate::lazy::dsl::Expr;
use polars_lazy::prelude::Expr as PExpr;

#[wasm_bindgen]
pub struct LazyFrame(PLazyFrame);

impl Deref for LazyFrame {
    type Target = PLazyFrame;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl From<PLazyFrame> for LazyFrame {
    fn from(frame: PLazyFrame) -> Self {
        LazyFrame(frame)
    }
}

#[wasm_bindgen(typescript_custom_section)]
const IVEC_EXPR: &'static str = r#"
type VecExpr = Expr[]
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "VecExpr")]
    pub type VecExpr;
    #[wasm_bindgen(indexing_getter)]
    fn get(this: &VecExpr, prop: usize) -> Expr;
}

#[wasm_bindgen]
impl LazyFrame {
    #[wasm_bindgen(js_name = withColumns)]
    pub fn with_colummns(self, exprs: &VecExpr) -> Result<LazyFrame, Error> {
        let len = js_sys::Reflect::get(exprs, &JsValue::from("length"))?
            .as_f64()
            .ok_or(Error::new("Error: The input is not an Array."))? as usize;
        Ok(self
            .0
            .with_columns(
                &*(0..len)
                    .map(|i| get(exprs, i).into())
                    .collect::<Box<[PExpr]>>(),
            )
            .into())
    }
}
