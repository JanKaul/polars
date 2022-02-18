use crate::{console_log, log};
use js_sys::Error;
use polars_core::{
    datatypes::{DataType, Int16Chunked, Int8Chunked, UInt16Chunked, UInt8Chunked},
    prelude::{
        Float32Chunked, Float64Chunked, Int32Chunked, IntoSeries, NewChunkedArray,
        Series as PSeries, UInt32Chunked, Utf8Chunked,
    },
};
use std::ops::{BitAnd, BitOr};
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

impl Series {
    #[inline]
    fn new_array(name: &str, values: &js_sys::Array) -> Result<Series, Error> {
        let first = &values.get(0);
        if first.as_f64().is_some() {
            let series = Float64Chunked::from_iter_options(name, values.iter().map(|v| v.as_f64()))
                .into_series();
            Ok(Series { series })
        } else if first.as_string().is_some() {
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
        arg3: Option<String>,
        arg4: Option<bool>,
    ) -> Result<Series, Error> {
        let (name, values, _dtype, _strict) = if arg2.is_undefined() {
            ("".to_string(), arg1, None, None)
        } else if arg3.is_none() {
            (arg1.as_string().unwrap_or("".to_string()), arg2, None, None)
        } else if arg4.is_none() {
            (arg1.as_string().unwrap_or("".to_string()), arg2, arg3, None)
        } else {
            (arg1.as_string().unwrap_or("".to_string()), arg2, arg3, arg4)
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

    pub fn log(&self) {
        console_log!("{}", self.series)
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
    pub fn cumsum(&self, reverse: bool) -> Self {
        self.series.cumsum(reverse).into()
    }

    #[wasm_bindgen(js_name = cumMax)]
    pub fn cummax(&self, reverse: bool) -> Self {
        self.series.cummax(reverse).into()
    }

    #[wasm_bindgen(js_name = cumMin)]
    pub fn cummin(&self, reverse: bool) -> Self {
        self.series.cummin(reverse).into()
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

    pub fn sort(&mut self, reverse: bool) -> Self {
        (self.series.sort(reverse)).into()
    }

    #[wasm_bindgen(js_name = argSort)]
    pub fn argsort(&self, reverse: bool) -> Self {
        self.series.argsort(reverse).into_series().into()
    }

    #[wasm_bindgen(js_name = toArray)]
    pub fn to_array(&self) -> Result<js_sys::Object, Error> {
        match self.series._dtype() {
            DataType::Int8 => self
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
            DataType::Int16 => self
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
            DataType::Int32 => self
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
            DataType::UInt8 => self
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
            DataType::UInt16 => self
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
            DataType::UInt32 => self
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
            DataType::Float32 => self
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
            DataType::Float64 => self
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
            DataType::Utf8 => self
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
