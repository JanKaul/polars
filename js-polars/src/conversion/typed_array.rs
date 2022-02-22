#[macro_export]
macro_rules! typed_array_to_series {
    ($values:expr,$name:expr,$x:ty,$y: ident) => {
        $values
            .dyn_ref::<$x>()
            .map(|x| Ok($y::from_slice($name, &x.to_vec()).into_series().into()))
    };
}

#[macro_export]
macro_rules! series_to_typed_array {
    ($series:expr,$x:ident,js_sys::$y: ident) => {
        $series
            .$x()
            .and_then(|x| {
                x.cont_slice().map(|x| {
                    let arr = js_sys::$y::new_with_length(x.len() as u32);
                    arr.copy_from(x);
                    arr.into()
                })
            })
            .map_err(|x| js_sys::Error::new(&format!("{}", x)))
    };
}
