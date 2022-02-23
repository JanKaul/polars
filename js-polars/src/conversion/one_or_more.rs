use wasm_bindgen::JsCast;

pub enum OneOrMoreRef<'a, T: JsCast, A: IntoIterator<Item = T>> {
    One(&'a T),
    More(&'a A),
}

impl<'a, T: JsCast, A: JsCast + IntoIterator<Item = T>, H: JsCast> From<&'a H>
    for OneOrMoreRef<'a, T, A>
{
    fn from(value: &'a H) -> Self {
        match value.dyn_ref::<T>() {
            Some(obj) => OneOrMoreRef::One(obj),
            None => match value.dyn_ref::<A>() {
                Some(arr) => OneOrMoreRef::More(arr),
                None => panic!(),
            },
        }
    }
}
