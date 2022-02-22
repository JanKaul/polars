use std::ops::Deref;

use js_sys::Error;
use paste::paste;
use polars_lazy::prelude::LazyFrame as PLazyFrame;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{conversion::array::StructIterator, lazy::dsl::Expr, struct_iterator};
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

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Expr[]")]
    pub type ArrayExpr;
}

struct_iterator!(ArrayExpr, Expr);

#[wasm_bindgen]
impl LazyFrame {
    #[wasm_bindgen(js_name = withColumns)]
    pub fn with_colummns(self, exprs: &ArrayExpr) -> Result<LazyFrame, Error> {
        Ok(self
            .0
            .with_columns(
                exprs
                    .into_iter()
                    .map(|x| x.into())
                    .collect::<Box<[PExpr]>>(),
            )
            .into())
    }
}
