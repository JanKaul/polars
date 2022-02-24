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
    E: JsCast + RefRustStruct<'a, T>,
    A: JsCast + IntoIterator<Item = T>,
> {
    One(&'a E),
    More(&'a A),
}

impl<
        'a,
        T: FromWasmAbi<Abi = u32> + RefFromWasmAbi<Abi = u32>,
        E: JsCast + RefRustStruct<'a, T>,
        A: JsCast + IntoIterator<Item = T>,
    > TryFrom<&'a JsValue> for OneOrMoreRef<'a, T, E, A>
{
    type Error = js_sys::Error;
    fn try_from(value: &'a JsValue) -> Result<Self, Self::Error> {
        match value.dyn_ref::<E>() {
            Some(obj) => Ok(OneOrMoreRef::One(obj)),
            None => match value.dyn_ref::<A>() {
                Some(arr) => Ok(OneOrMoreRef::More(arr)),
                None => Err(TypeError::new("TypeError: {value} is not of the right type.").into()),
            },
        }
    }
}
