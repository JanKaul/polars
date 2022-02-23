pub struct StructIterator<'a, T> {
    pub count: usize,
    pub len: usize,
    pub array: &'a T,
}

#[macro_export]
macro_rules! struct_iterator {
    ( $x:ident, $y:ty, $z:ty) => {
        paste! {
        use crate::conversion::extern_struct::IntoRustStruct;
        #[wasm_bindgen]
        extern "C" {
            #[wasm_bindgen(getter = length)]
            fn [<$x _length>](this: &$x) -> usize;
            #[wasm_bindgen(indexing_getter)]
            fn [<$x _get>](this: &$x, prop: usize) -> wasm_bindgen::JsValue;
        }

        impl<'a> Iterator for crate::conversion::extern_iterator::StructIterator<'a, $x> {
            type Item = $z;
            fn next(&mut self) -> Option<Self::Item> {
                if self.count < self.len {
                    self.count += 1;
                    Some($y::from([<$x _get>](self.array, self.count)).into_rust())
                } else {
                    None
                }
            }
        }

        impl<'a> IntoIterator for &'a $x {
            type Item = $z;
            type IntoIter = crate::conversion::extern_iterator::StructIterator<'a, $x>;
            fn into_iter(self) -> Self::IntoIter {
                crate::conversion::extern_iterator::StructIterator {
                    count: 0,
                    len: [<$x _length>](self),
                    array: self,
                }
            }
        }
        }
    };
}
