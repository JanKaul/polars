pub struct StructIterator<'a, T> {
    pub count: usize,
    pub len: usize,
    pub array: &'a T,
}

#[macro_export]
macro_rules! struct_iterator {
    ( $x:ident, $y:ty) => {
        paste! {
        #[wasm_bindgen]
        extern "C" {
            #[wasm_bindgen(getter = length)]
            fn [<$x _length>](this: &$x) -> usize;
            #[wasm_bindgen(indexing_getter)]
            fn [<$x _get>](this: &$x, prop: usize) -> $y;
        }

        impl<'a> Iterator for StructIterator<'a, $x> {
            type Item = Expr;
            fn next(&mut self) -> Option<Self::Item> {
                if self.count < self.len {
                    self.count += 1;
                    Some([<$x _get>](self.array, self.count))
                } else {
                    None
                }
            }
        }

        impl<'a> IntoIterator for &'a $x {
            type Item = $y;
            type IntoIter = StructIterator<'a, $x>;
            fn into_iter(self) -> Self::IntoIter {
                StructIterator {
                    count: 0,
                    len: [<$x _length>](self),
                    array: self,
                }
            }
        }
        }
    };
}
