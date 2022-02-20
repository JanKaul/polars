use polars_core::datatypes::{AnyValue as PAnyValue, DataType as PDataType, TimeUnit};
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

#[wasm_bindgen]
pub enum DataType {
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

impl From<usize> for DataType {
    fn from(n: usize) -> Self {
        match n {
            0 => DataType::Int8,
            1 => DataType::Int16,
            2 => DataType::Int32,
            3 => DataType::Int64,
            4 => DataType::UInt8,
            5 => DataType::UInt16,
            6 => DataType::UInt32,
            7 => DataType::UInt64,
            8 => DataType::Float32,
            9 => DataType::Float64,
            10 => DataType::Bool,
            11 => DataType::Utf8,
            12 => DataType::List,
            13 => DataType::Date,
            14 => DataType::Datetime,
            15 => DataType::Time,
            16 => DataType::Object,
            17 => DataType::Categorical,
            _ => todo!(),
        }
    }
}

impl From<DataType> for usize {
    fn from(dtype: DataType) -> Self {
        match dtype {
            DataType::Int8 => 0,
            DataType::Int16 => 1,
            DataType::Int32 => 2,
            DataType::Int64 => 3,
            DataType::UInt8 => 4,
            DataType::UInt16 => 5,
            DataType::UInt32 => 6,
            DataType::UInt64 => 7,
            DataType::Float32 => 8,
            DataType::Float64 => 9,
            DataType::Bool => 10,
            DataType::Utf8 => 11,
            DataType::List => 12,
            DataType::Date => 13,
            DataType::Datetime => 14,
            DataType::Time => 15,
            DataType::Object => 16,
            DataType::Categorical => 17,
        }
    }
}

impl From<DataType> for PDataType {
    fn from(dtype: DataType) -> Self {
        match dtype {
            DataType::Int8 => PDataType::Int8,
            DataType::Int16 => PDataType::Int16,
            DataType::Int32 => PDataType::Int32,
            DataType::Int64 => PDataType::Int64,
            DataType::UInt8 => PDataType::UInt8,
            DataType::UInt16 => PDataType::UInt16,
            DataType::UInt32 => PDataType::UInt32,
            DataType::UInt64 => PDataType::UInt64,
            DataType::Float32 => PDataType::Float32,
            DataType::Float64 => PDataType::Float64,
            DataType::Bool => PDataType::Boolean,
            DataType::Utf8 => PDataType::Utf8,
            DataType::List => PDataType::Unknown,
            DataType::Date => PDataType::Date,
            DataType::Datetime => PDataType::Datetime(TimeUnit::Milliseconds, None),
            DataType::Time => PDataType::Time,
            DataType::Object => PDataType::Unknown,
            DataType::Categorical => PDataType::Categorical,
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
