use super::{series::*, JsPolarsError};
use js_sys::Array;
use js_sys::Error;
use js_sys::Object;
use polars_core::prelude::DataFrame as PDataFrame;
use polars_core::prelude::DistinctKeepStrategy;
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

    pub fn dtypes(&self) -> Box<[JsValue]> {
        self.df
            .dtypes()
            .into_iter()
            .map(|x| JsValue::from_str(&format!("{}", x)))
            .collect()
    }

    pub fn height(&self) -> usize {
        self.df.height()
    }

    pub fn width(&self) -> usize {
        self.df.width()
    }

    pub fn shape(&self) -> Box<[JsValue]> {
        let (first, second) = self.df.shape();
        Box::new([JsValue::from(first), JsValue::from(second)])
    }

    #[wasm_bindgen(getter)]
    pub fn columns(&self) -> Box<[JsValue]> {
        self.df
            .get_column_names()
            .into_iter()
            .map(|x| JsValue::from(x))
            .collect()
    }

    #[wasm_bindgen(setter)]
    pub fn set_columns(&mut self, names: Box<[JsValue]>) -> Result<(), Error> {
        let names = names
            .iter()
            .map(|x| x.as_string())
            .collect::<Option<Vec<String>>>()
            .ok_or(Error::new(
                "Error: Invalid names passed at argument to columns",
            ))?;
        self.df
            .set_column_names(&names)
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))
    }

    #[wasm_bindgen(js_name = getColumn)]
    pub fn get_column(&self, name: String) -> Result<Series, Error> {
        self.df
            .column(&name)
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))
            .map(|x| Series::from(x.clone()))
    }

    pub fn clone(&self) -> Self {
        Self::from(self.df.clone())
    }

    #[wasm_bindgen(js_name = frameEqual)]
    pub fn frame_equal(&self, other: DataFrame) -> bool {
        self.df.frame_equal(&other.df)
    }

    pub fn drop(&self, names: Box<[JsValue]>) -> Result<DataFrame, Error> {
        let mut clone = self.df.clone();
        let names = names
            .into_iter()
            .map(|y| y.as_string())
            .collect::<Option<Box<[String]>>>()
            .ok_or(Error::new("Error: Invalid column names to drop."))?;
        names
            .into_iter()
            .fold(Ok::<_, Error>(&mut clone), |acc, name| {
                let df = acc?;
                let _ = df
                    .drop_in_place(name)
                    .map_err(|x| js_sys::Error::new(&format!("{}", x)))?;
                Ok(df)
            })?;
        Ok(clone.into())
    }

    #[wasm_bindgen(js_name = dropDuplicates)]
    pub fn drop_duplicates(
        &self,
        options: Option<DropDuplicateOptions>,
    ) -> Result<DataFrame, Error> {
        let (subset, distinct_keep_strategy) = match options {
            Some(options) => {
                let subset = subset(&options).and_then(|x| {
                    x.into_iter()
                        .map(|y| y.as_string())
                        .collect::<Option<Box<[String]>>>()
                });
                let distinct_keep_strategy = maintainOrder(&options).map(|x| {
                    if x {
                        DistinctKeepStrategy::First
                    } else {
                        DistinctKeepStrategy::Last
                    }
                });

                (subset, distinct_keep_strategy)
            }
            None => (None, None),
        };

        self.df
            .distinct(
                subset.as_ref().map(|x| &**x),
                distinct_keep_strategy.unwrap_or(DistinctKeepStrategy::First),
            )
            .map(|x| x.into())
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))
    }
}

#[wasm_bindgen(typescript_custom_section)]
const ITEXT_STYLE: &'static str = r#"
interface DropDuplicateOptions {
    maintainOrder?: Boolean,
    subset?: String[]
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "DropDuplicateOptions")]
    pub type DropDuplicateOptions;
    #[wasm_bindgen(getter)]
    fn maintainOrder(this: &DropDuplicateOptions) -> Option<bool>;
    #[wasm_bindgen(getter)]
    fn subset(this: &DropDuplicateOptions) -> Option<Box<[JsValue]>>;
}
