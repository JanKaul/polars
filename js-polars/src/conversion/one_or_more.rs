use std::convert::TryFrom;

use js_sys::TypeError;
use wasm_bindgen::{
    convert::{FromWasmAbi, RefFromWasmAbi},
    JsCast, JsValue,
};

use super::extern_struct::RefRustStruct;

pub enum OneOrMoreRef<
    'a,
    T: FromWasmAbi<Abi = u32> + RefFromWasmAbi<Abi = u32>,
    ExternT: JsCast + RefRustStruct<'a, T>,
    ArrayT: JsCast + IntoIterator<Item = T>,
> {
    One(&'a ExternT),
    More(&'a ArrayT),
}

impl<
        'a,
        T: FromWasmAbi<Abi = u32> + RefFromWasmAbi<Abi = u32>,
        ExternT: JsCast + RefRustStruct<'a, T>,
        ArrayT: JsCast + IntoIterator<Item = T>,
    > TryFrom<&'a JsValue> for OneOrMoreRef<'a, T, ExternT, ArrayT>
{
    type Error = js_sys::Error;
    fn try_from(value: &'a JsValue) -> Result<Self, Self::Error> {
        match value.dyn_ref::<ExternT>() {
            Some(obj) => Ok(OneOrMoreRef::One(obj)),
            None => match value.dyn_ref::<ArrayT>() {
                Some(arr) => Ok(OneOrMoreRef::More(arr)),
                None => Err(TypeError::new("TypeError: {value} is not of the right type.").into()),
            },
        }
    }
}
