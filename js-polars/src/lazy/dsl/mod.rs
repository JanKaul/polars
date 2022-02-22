use std::ops::Deref;

use polars_lazy::prelude::Expr as PExpr;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::datatypes::DataType;

pub mod functions;

#[wasm_bindgen]
pub struct Expr(PExpr);

impl Deref for Expr {
    type Target = PExpr;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl From<PExpr> for Expr {
    fn from(expr: PExpr) -> Self {
        Expr(expr)
    }
}

impl From<Expr> for PExpr {
    fn from(expr: Expr) -> Self {
        expr.0
    }
}

#[wasm_bindgen]
impl Expr {
    pub fn cast(self, dtype: usize) -> Self {
        let dtype = DataType::from(dtype).into();
        self.0.cast(dtype).into()
    }
    pub fn alias(self, name: &str) -> Self {
        self.0.alias(name).into()
    }
}
