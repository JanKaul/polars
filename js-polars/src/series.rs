use crate::{
    console_log,
    datatypes::{AnyValue, DataType},
    log,
};
use js_sys::Error;
use polars_core::{
    datatypes::{
        BooleanChunked, DataType as PDataType, Int16Chunked, Int8Chunked, UInt16Chunked,
        UInt8Chunked,
    },
    prelude::{
        ChunkCompare, FillNullStrategy, Float32Chunked, Float64Chunked, Int32Chunked, IntoSeries,
        NewChunkedArray, Series as PSeries, UInt32Chunked, Utf8Chunked,
    },
    series::ops::NullBehavior,
};
use std::ops::{BitAnd, BitOr, Deref};
use wasm_bindgen::{prelude::*, JsCast};

#[wasm_bindgen]
#[repr(transparent)]
pub struct Series {
    pub(crate) series: PSeries,
}

impl From<PSeries> for Series {
    fn from(series: PSeries) -> Self {
        Self { series }
    }
}

impl Deref for Series {
    type Target = PSeries;

    fn deref(&self) -> &Self::Target {
        &self.series
    }
}

impl Series {
    #[inline]
    fn new_array(name: &str, values: &js_sys::Array) -> Result<Series, Error> {
        let first = &values.get(0);
        if first.is_instance_of::<js_sys::Number>() {
            let series = Float64Chunked::from_iter_options(name, values.iter().map(|v| v.as_f64()))
                .into_series();
            Ok(Series { series })
        } else if first.is_instance_of::<js_sys::Boolean>() {
            let series =
                BooleanChunked::from_iter_options(name, values.iter().map(|v| v.as_bool()))
                    .into_series();
            Ok(Series { series })
        } else if first.is_instance_of::<js_sys::JsString>() {
            let series = Utf8Chunked::from_iter_options(name, values.iter().map(|v| v.as_string()))
                .into_series();
            Ok(Series { series })
        } else {
            Err(Error::new("Error: creation failed"))
        }
    }
}

#[wasm_bindgen]
impl Series {
    #[wasm_bindgen(constructor)]
    pub fn new(
        arg1: &JsValue,
        arg2: &JsValue,
        arg3: Option<usize>,
        arg4: Option<bool>,
    ) -> Result<Series, Error> {
        let (name, values, _dtype, _strict) = if arg2.is_undefined() {
            ("".to_string(), arg1, None, None)
        } else if arg3.is_none() {
            (arg1.as_string().unwrap_or("".to_string()), arg2, None, None)
        } else if arg4.is_none() {
            (
                arg1.as_string().unwrap_or("".to_string()),
                arg2,
                arg3.map(|x| polars_core::datatypes::DataType::from(DataType::from(x))),
                None,
            )
        } else {
            (
                arg1.as_string().unwrap_or("".to_string()),
                arg2,
                arg3.map(|x| polars_core::datatypes::DataType::from(DataType::from(x))),
                arg4,
            )
        };
        match values
            .dyn_ref::<js_sys::Array>()
            .map(|x| Self::new_array(&name, x))
            .or_else(|| {
                values.dyn_ref::<js_sys::Int8Array>().map(|x| {
                    Ok(Series {
                        series: Int8Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            })
            .or_else(|| {
                values.dyn_ref::<js_sys::Int16Array>().map(|x| {
                    Ok(Series {
                        series: Int16Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            })
            .or_else(|| {
                values.dyn_ref::<js_sys::Int32Array>().map(|x| {
                    Ok(Series {
                        series: Int32Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            })
            .or_else(|| {
                values.dyn_ref::<js_sys::Float32Array>().map(|x| {
                    Ok(Series {
                        series: Float32Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            })
            .or_else(|| {
                values.dyn_ref::<js_sys::Float64Array>().map(|x| {
                    Ok(Series {
                        series: Float64Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            })
            .or_else(|| {
                values.dyn_ref::<js_sys::Uint8Array>().map(|x| {
                    Ok(Series {
                        series: UInt8Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            })
            .or_else(|| {
                values.dyn_ref::<js_sys::Uint8ClampedArray>().map(|x| {
                    Ok(Series {
                        series: UInt8Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            })
            .or_else(|| {
                values.dyn_ref::<js_sys::Uint16Array>().map(|x| {
                    Ok(Series {
                        series: UInt16Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            })
            .or_else(|| {
                values.dyn_ref::<js_sys::Uint32Array>().map(|x| {
                    Ok(Series {
                        series: UInt32Chunked::from_slice(&name, &x.to_vec()).into_series(),
                    })
                })
            }) {
            Some(res) => res,
            None => Err(js_sys::Error::new("Error: Wrong input for constructor.")),
        }
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("{}", self.series)
    }

    #[wasm_bindgen(js_name = toJSON)]
    pub fn to_json(&self) -> String {
        let mut series_fmt = String::with_capacity(10);
        series_fmt.push('[');
        let n = std::cmp::min(self.series.len(), 5);
        for i in 0..n {
            let val = self.series.get(i);
            if i < n - 1 {
                series_fmt.push_str(&format!("{}, ", val))
            } else {
                series_fmt.push_str(&format!("{}", val))
            }
        }
        series_fmt.push(']');

        format!(r#"{{ {}: {} }}"#, self.series.name(), series_fmt)
    }

    #[wasm_bindgen(getter)]
    pub fn length(&self) -> usize {
        self.series.len()
    }

    #[wasm_bindgen(getter)]
    pub fn dtype(&self) -> String {
        format!("{}", self.series.dtype())
    }

    pub fn log(&self) {
        console_log!("{}", self.series)
    }

    pub fn rechunk(&mut self, in_place: bool) -> Option<Series> {
        let series = self.series.rechunk();
        if in_place {
            self.series = series;
            None
        } else {
            Some(series.into())
        }
    }

    pub fn bitand(&self, other: &Series) -> Self {
        let s = self
            .series
            .bool()
            .expect("boolean")
            .bitand(other.series.bool().expect("boolean"))
            .into_series();
        s.into()
    }

    pub fn bitor(&self, other: &Series) -> Self {
        let s = self
            .series
            .bool()
            .expect("boolean")
            .bitor(other.series.bool().expect("boolean"))
            .into_series();
        s.into()
    }

    #[wasm_bindgen(js_name = cumSum)]
    pub fn cumsum(&self, reverse: Option<bool>) -> Self {
        self.series.cumsum(reverse.unwrap_or(false)).into()
    }

    #[wasm_bindgen(js_name = cumProd)]
    pub fn cumprod(&self, reverse: Option<bool>) -> Self {
        self.series.cumprod(reverse.unwrap_or(false)).into()
    }

    #[wasm_bindgen(js_name = cumMax)]
    pub fn cummax(&self, reverse: Option<bool>) -> Self {
        self.series.cummax(reverse.unwrap_or(false)).into()
    }

    #[wasm_bindgen(js_name = cumMin)]
    pub fn cummin(&self, reverse: Option<bool>) -> Self {
        self.series.cummin(reverse.unwrap_or(false)).into()
    }

    #[wasm_bindgen(js_name = chunkLengths)]
    pub fn chunk_lengths(&self) -> Vec<usize> {
        self.series.chunk_lengths().collect::<Vec<usize>>().clone()
    }

    pub fn name(&self) -> String {
        self.series.name().into()
    }

    pub fn rename(&mut self, name: &str) {
        self.series.rename(name);
    }

    pub fn mean(&self) -> Option<f64> {
        self.series.mean()
    }

    #[wasm_bindgen(js_name = nChunks)]
    pub fn n_chunks(&self) -> usize {
        self.series.n_chunks()
    }

    pub fn limit(&self, num_elements: usize) -> Self {
        let series = self.series.limit(num_elements);
        series.into()
    }

    pub fn slice(&self, offset: i64, length: usize) -> Self {
        let series = self.series.slice(offset, length);
        series.into()
    }

    pub fn append(&mut self, other: &Series) -> Result<(), JsValue> {
        let res = self.series.append(&other.series);
        if let Err(e) = res {
            Err(format!("{:?}", e).into())
        } else {
            Ok(())
        }
    }

    pub fn filter(&self, filter: &Series) -> Result<Series, JsValue> {
        let filter_series = &filter.series;
        if let Ok(ca) = filter_series.bool() {
            let series = self.series.filter(ca).unwrap();
            Ok(series.into())
        } else {
            Err("Expected a boolean mask".into())
        }
    }

    pub fn add(&self, other: &Series) -> Self {
        (&self.series + &other.series).into()
    }

    pub fn sub(&self, other: &Series) -> Self {
        (&self.series - &other.series).into()
    }

    pub fn mul(&self, other: &Series) -> Self {
        (&self.series * &other.series).into()
    }

    pub fn div(&self, other: &Series) -> Self {
        (&self.series / &other.series).into()
    }

    pub fn head(&self, length: Option<usize>) -> Self {
        (self.series.head(length)).into()
    }

    pub fn tail(&self, length: Option<usize>) -> Self {
        (self.series.tail(length)).into()
    }

    pub fn sort(&mut self, reverse: Option<bool>) -> Self {
        (self.series.sort(reverse.unwrap_or(false))).into()
    }

    #[wasm_bindgen(js_name = argSort)]
    pub fn argsort(&self, reverse: Option<bool>) -> Self {
        self.series
            .argsort(reverse.unwrap_or(false))
            .into_series()
            .into()
    }

    #[wasm_bindgen(js_name = eq)]
    pub fn equal(&self, other: &Series) -> Self {
        self.series.equal(&other.series).into_series().into()
    }

    pub fn abs(&self) -> Result<Series, Error> {
        Ok(self
            .series
            .abs()
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))?
            .into_series()
            .into())
    }

    #[wasm_bindgen(js_name = "argMax")]
    pub fn arg_max(&self) -> Option<usize> {
        self.series.arg_max()
    }

    #[wasm_bindgen(js_name = "argMin")]
    pub fn arg_min(&self) -> Option<usize> {
        self.series.arg_min()
    }

    #[wasm_bindgen(js_name = argTrue)]
    pub fn arg_true(&self) -> Result<Series, Error> {
        Ok(self
            .series
            .arg_true()
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))?
            .into_series()
            .into())
    }

    #[wasm_bindgen(js_name = argUnique)]
    pub fn arg_unique(&self) -> Result<Series, Error> {
        Ok(self
            .series
            .arg_unique()
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))?
            .into_series()
            .into())
    }

    pub fn cast(&self, dtype: usize) -> Result<Series, Error> {
        Ok(self
            .series
            .cast(&PDataType::from(DataType::from(dtype)))
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))?
            .into_series()
            .into())
    }

    pub fn clone(&self) -> Self {
        self.series.clone().into()
    }

    pub fn diff(&self, n: usize, null_behavior: String) -> Self {
        let null_behavior = if null_behavior.eq("drop") {
            NullBehavior::Drop
        } else {
            NullBehavior::Ignore
        };
        self.series.diff(n, null_behavior).into()
    }

    #[wasm_bindgen(js_name = dropNulls)]
    pub fn drop_nulls(&self) -> Self {
        self.series.drop_nulls().into()
    }

    #[wasm_bindgen(js_name = fillNull)]
    pub fn fill_null(&self, fill_null_strategy: String) -> Result<Series, Error> {
        let fill_null_strategy = if fill_null_strategy.eq("backward") {
            FillNullStrategy::Backward
        } else if fill_null_strategy.eq("forward") {
            FillNullStrategy::Forward
        } else if fill_null_strategy.eq("mean") {
            FillNullStrategy::Mean
        } else if fill_null_strategy.eq("max") {
            FillNullStrategy::Max
        } else if fill_null_strategy.eq("min") {
            FillNullStrategy::Min
        } else if fill_null_strategy.eq("zero") {
            FillNullStrategy::Zero
        } else if fill_null_strategy.eq("one") {
            FillNullStrategy::One
        } else if fill_null_strategy.eq("maxbound") {
            FillNullStrategy::MaxBound
        } else {
            FillNullStrategy::MinBound
        };
        Ok(self
            .series
            .fill_null(fill_null_strategy)
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))?
            .into())
    }

    pub fn floor(&self) -> Result<Series, Error> {
        Ok(self
            .series
            .floor()
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))?
            .into_series()
            .into())
    }

    pub fn get(&self, index: usize) -> JsValue {
        AnyValue::from(self.series.get(index)).into()
    }

    #[wasm_bindgen(js_name = toArray)]
    pub fn to_array(&self) -> Result<js_sys::Object, Error> {
        match self.series._dtype() {
            PDataType::Int8 => self
                .series
                .i8()
                .and_then(|x| {
                    x.cont_slice().map(|x| {
                        let arr = js_sys::Int8Array::new_with_length(x.len() as u32);
                        arr.copy_from(x);
                        arr.into()
                    })
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            PDataType::Int16 => self
                .series
                .i16()
                .and_then(|x| {
                    x.cont_slice().map(|x| {
                        let arr = js_sys::Int16Array::new_with_length(x.len() as u32);
                        arr.copy_from(x);
                        arr.into()
                    })
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            PDataType::Int32 => self
                .series
                .i32()
                .and_then(|x| {
                    x.cont_slice().map(|x| {
                        let arr = js_sys::Int32Array::new_with_length(x.len() as u32);
                        arr.copy_from(x);
                        arr.into()
                    })
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            PDataType::UInt8 => self
                .series
                .u8()
                .and_then(|x| {
                    x.cont_slice().map(|x| {
                        let arr = js_sys::Uint8Array::new_with_length(x.len() as u32);
                        arr.copy_from(x);
                        arr.into()
                    })
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            PDataType::UInt16 => self
                .series
                .u16()
                .and_then(|x| {
                    x.cont_slice().map(|x| {
                        let arr = js_sys::Uint16Array::new_with_length(x.len() as u32);
                        arr.copy_from(x);
                        arr.into()
                    })
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            PDataType::UInt32 => self
                .series
                .u32()
                .and_then(|x| {
                    x.cont_slice().map(|x| {
                        let arr = js_sys::Uint32Array::new_with_length(x.len() as u32);
                        arr.copy_from(x);
                        arr.into()
                    })
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            PDataType::Float32 => self
                .series
                .f32()
                .and_then(|x| {
                    x.cont_slice().map(|x| {
                        let arr = js_sys::Float32Array::new_with_length(x.len() as u32);
                        arr.copy_from(x);
                        arr.into()
                    })
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            PDataType::Float64 => self
                .series
                .f64()
                .and_then(|x| {
                    x.cont_slice().map(|x| {
                        let arr = js_sys::Float64Array::new_with_length(x.len() as u32);
                        arr.copy_from(x);
                        arr.into()
                    })
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            PDataType::Utf8 => self
                .series
                .utf8()
                .map(|x| {
                    x.into_iter()
                        .map(|y| y.map(|z| JsValue::from_str(z)).unwrap_or(JsValue::null()))
                        .collect::<js_sys::Array>()
                        .into()
                })
                .map_err(|x| js_sys::Error::new(&format!("{}", x))),
            _ => todo!(),
        }
    }
}
