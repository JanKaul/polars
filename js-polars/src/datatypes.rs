use polars_core::datatypes::{AnyValue as PAnyValue, DataType, TimeUnit};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

use crate::series::Series;

#[wasm_bindgen(typescript_custom_section)]
const DATATYPES: &'static str = r#"
export import Int8 = DataType.Int8
export import Int16 = DataType.Int16
export import Int32 = DataType.Int32;
export import Int64 = DataType.Int64;
export import UInt8 = DataType.UInt8;
export import UInt16 = DataType.UInt16;
export import UInt32 = DataType.UInt32;
export import UInt64 = DataType.UInt64;
export import Float32 = DataType.Float32;
export import Float64 = DataType.Float64;
export import Bool = DataType.Bool;
export import Utf8 = DataType.Utf8;
export import List = DataType.List;
export import Date = DataType.Date;
export import Datetime = DataType.Datetime;
export import Time = DataType.Time;
export import Object = DataType.Object;
export import Categorical = DataType.Categorical;
"#;

#[wasm_bindgen(js_name = DataType)]
pub enum TsDataType {
    Int8,
    Int16,
    Int32,
    Int64,
    UInt8,
    UInt16,
    UInt32,
    UInt64,
    Float32,
    Float64,
    Bool,
    Utf8,
    List,
    Date,
    Datetime,
    Time,
    Object,
    Categorical,
}

impl From<usize> for TsDataType {
    fn from(n: usize) -> Self {
        match n {
            0 => TsDataType::Int8,
            1 => TsDataType::Int16,
            2 => TsDataType::Int32,
            3 => TsDataType::Int64,
            4 => TsDataType::UInt8,
            5 => TsDataType::UInt16,
            6 => TsDataType::UInt32,
            7 => TsDataType::UInt64,
            8 => TsDataType::Float32,
            9 => TsDataType::Float64,
            10 => TsDataType::Bool,
            11 => TsDataType::Utf8,
            12 => TsDataType::List,
            13 => TsDataType::Date,
            14 => TsDataType::Datetime,
            15 => TsDataType::Time,
            16 => TsDataType::Object,
            17 => TsDataType::Categorical,
            _ => todo!(),
        }
    }
}

impl From<TsDataType> for usize {
    fn from(dtype: TsDataType) -> Self {
        match dtype {
            TsDataType::Int8 => 0,
            TsDataType::Int16 => 1,
            TsDataType::Int32 => 2,
            TsDataType::Int64 => 3,
            TsDataType::UInt8 => 4,
            TsDataType::UInt16 => 5,
            TsDataType::UInt32 => 6,
            TsDataType::UInt64 => 7,
            TsDataType::Float32 => 8,
            TsDataType::Float64 => 9,
            TsDataType::Bool => 10,
            TsDataType::Utf8 => 11,
            TsDataType::List => 12,
            TsDataType::Date => 13,
            TsDataType::Datetime => 14,
            TsDataType::Time => 15,
            TsDataType::Object => 16,
            TsDataType::Categorical => 17,
        }
    }
}

impl From<TsDataType> for DataType {
    fn from(dtype: TsDataType) -> Self {
        match dtype {
            TsDataType::Int8 => DataType::Int8,
            TsDataType::Int16 => DataType::Int16,
            TsDataType::Int32 => DataType::Int32,
            TsDataType::Int64 => DataType::Int64,
            TsDataType::UInt8 => DataType::UInt8,
            TsDataType::UInt16 => DataType::UInt16,
            TsDataType::UInt32 => DataType::UInt32,
            TsDataType::UInt64 => DataType::UInt64,
            TsDataType::Float32 => DataType::Float32,
            TsDataType::Float64 => DataType::Float64,
            TsDataType::Bool => DataType::Boolean,
            TsDataType::Utf8 => DataType::Utf8,
            TsDataType::List => DataType::Unknown,
            TsDataType::Date => DataType::Date,
            TsDataType::Datetime => DataType::Datetime(TimeUnit::Milliseconds, None),
            TsDataType::Time => DataType::Time,
            TsDataType::Object => DataType::Unknown,
            TsDataType::Categorical => DataType::Categorical,
        }
    }
}

pub struct AnyValue<'a>(PAnyValue<'a>);

impl<'a> From<PAnyValue<'a>> for AnyValue<'a> {
    fn from(any: PAnyValue<'a>) -> Self {
        AnyValue(any)
    }
}

impl From<AnyValue<'_>> for JsValue {
    fn from(any: AnyValue) -> Self {
        match any.0 {
            PAnyValue::Null => JsValue::null(),
            PAnyValue::Boolean(bool) => JsValue::from_bool(bool),
            PAnyValue::Utf8(str) => JsValue::from_str(str),
            PAnyValue::UInt8(u8) => JsValue::from(u8),
            PAnyValue::UInt16(u16) => JsValue::from(u16),
            PAnyValue::UInt32(u32) => JsValue::from(u32),
            PAnyValue::UInt64(u64) => JsValue::from(u64),
            PAnyValue::Int8(i8) => JsValue::from(i8),
            PAnyValue::Int16(i16) => JsValue::from(i16),
            PAnyValue::Int32(i32) => JsValue::from(i32),
            PAnyValue::Int64(i64) => JsValue::from(i64),
            PAnyValue::Float32(f32) => JsValue::from(f32),
            PAnyValue::Float64(f64) => JsValue::from(f64),
            PAnyValue::List(series) => JsValue::from(Series::from(series)),
        }
    }
}
