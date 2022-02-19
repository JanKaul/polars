use super::{series::*, JsPolarsError};
use js_sys::Array;
use js_sys::Error;
use js_sys::Object;
use polars_core::prelude::DataFrame as PDataFrame;
use polars_core::prelude::Series as PSeries;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen]
pub struct DataFrame {
    df: PDataFrame,
}

impl From<PDataFrame> for DataFrame {
    fn from(df: PDataFrame) -> Self {
        Self { df }
    }
}

#[wasm_bindgen]
impl DataFrame {
    #[wasm_bindgen(constructor)]
    pub fn new(input: &JsValue) -> Result<DataFrame, Error> {
        let series = input
            .dyn_ref::<Object>()
            .map(|obj| {
                Object::entries(obj)
                    .iter()
                    .into_iter()
                    .map(|x| {
                        let arr = Array::from(&x);
                        let (data, name) = (arr.pop(), arr.pop());
                        Series::new(&name, &data, None, None).map(|y| y.series)
                    })
                    .collect::<Result<Vec<_>, _>>()
            })
            .or(input.dyn_ref::<Array>().map(|arr| {
                arr.iter()
                    .into_iter()
                    .map(|x| Series::new(&JsValue::from_str(""), &x, None, None).map(|y| y.series))
                    .collect::<Result<Vec<_>, _>>()
            }))
            .ok_or(Error::new(
                "Error: Input data is neither an object nor an Array.",
            ))??;

        Ok(PDataFrame::new(series)
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))?
            .into())
    }

    pub fn assign(&self, series: Series) -> Result<DataFrame, JsValue> {
        let mut df = self.df.clone();
        df.with_column(series.series).map_err(JsPolarsError::from)?;
        Ok(df.into())
    }
}
