use std::ops::Deref;

use js_sys::Error;
use polars_lazy::prelude::LazyFrame as PLazyFrame;
use wasm_bindgen::prelude::wasm_bindgen;

use polars_lazy::prelude::Expr as PExpr;

use crate::lazy::dsl::ExprArray;

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
impl LazyFrame {
    #[wasm_bindgen(js_name = withColumns)]
    pub fn with_colummns(self, exprs: &ExprArray) -> Result<LazyFrame, Error> {
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
