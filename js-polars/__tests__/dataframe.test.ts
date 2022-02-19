/* eslint-disable newline-per-chained-call */
import * as pl from "@polars";
import { Stream } from "stream";
import fs from "fs";

describe("dataframe", () => {
  const df = new pl.DataFrame([
    new pl.Series("foo", [1, 2, 9], pl.Int16),
    new pl.Series("bar", [6, 2, 8], pl.Int16),
  ]);

  test("dtypes", () => {
    const expected = ["Float64", "Utf8"];
    const actual = new pl.DataFrame({ "a": [1, 2, 3], "b": ["a", "b", "c"] }).dtypes;
    expect(actual).toEqual(expected);
  });
  test("height", () => {
    const expected = 3;
    const actual = new pl.DataFrame({ "a": [1, 2, 3], "b": ["a", "b", "c"] }).height;
    expect(actual).toEqual(expected);
  });
  test("width", () => {
    const expected = 2;
    const actual = new pl.DataFrame({ "a": [1, 2, 3], "b": ["a", "b", "c"] }).width;
    expect(actual).toEqual(expected);
  });
  test("shape", () => {
    const expected = { height: 3, width: 2 };
    const actual = new pl.DataFrame({ "a": [1, 2, 3], "b": ["a", "b", "c"] }).shape;
    expect(actual).toEqual(expected);
  });
  test("get columns", () => {
    const expected = ["a", "b"];
    const actual = new pl.DataFrame({ "a": [1, 2, 3], "b": ["a", "b", "c"] }).columns;
    expect(actual).toEqual(expected);
  });
  test("set columns", () => {
    const expected = ["d", "e"];
    const df = new pl.DataFrame({ "a": [1, 2, 3], "b": ["a", "b", "c"] });
    df.columns = expected;

    expect(df.columns).toEqual(expected);
  });
  test("clone", () => {
    const expected = new pl.DataFrame({ "a": [1, 2, 3], "b": ["a", "b", "c"] });
    const actual = expected.clone();
    expect(actual).toFrameEqual(expected);
  });
  test("describe", () => {
    const actual = new pl.DataFrame({
      "a": [1, 2, 3],
      "b": ["a", "b", "c"],
      "c": [true, true, false]
    }).describe();

    const expected = new pl.DataFrame({
      "describe": ["mean", "std", "min", "max", "median"],
      "a": [2, 1, 1, 3, 2],
      "b": [null, null, null, null, null],
      "c": [null, null, 0, 1, null]
    });

    expect(actual).toFrameEqual(expected);
  });
  test("drop", () => {
    const df = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
      "ham": ["a", "b", "c"],
      "apple": ["a", "b", "c"]
    });
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
      "ham": ["a", "b", "c"],
    });
    const actual = df.drop("apple");
    expect(actual).toFrameEqual(expected);
  });
  test("drop: array", () => {
    const df = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
      "ham": ["a", "b", "c"],
      "apple": ["a", "b", "c"]
    });
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
    });
    const actual = df.drop(["apple", "ham"]);
    expect(actual).toFrameEqual(expected);
  });
  test("drop: ...rest", () => {
    const df = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
      "ham": ["a", "b", "c"],
      "apple": ["a", "b", "c"]
    });
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
    });
    const actual = df.drop("apple", "ham");
    expect(actual).toFrameEqual(expected);
  });
  test("dropDuplicates", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 2, 3],
      "bar": [1, 2, 2, 4],
      "ham": ["a", "d", "d", "c"],
    }).dropDuplicates();
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [1, 2, 4],
      "ham": ["a", "d", "c"],
    });
    expect(actual).toFrameEqualIgnoringOrder(expected);
  });
  test("dropDuplicates:subset", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 2, 2],
      "bar": [1, 2, 2, 2],
      "ham": ["a", "b", "c", "c"],
    }).dropDuplicates({ subset: ["foo", "ham"] });
    const expected = new pl.DataFrame({
      "foo": [1, 2, 2],
      "bar": [1, 2, 2],
      "ham": ["a", "b", "c"],
    });
    expect(actual).toFrameEqualIgnoringOrder(expected);
  });
  // run this test 100 times to make sure it is deterministic.
  test("dropDuplicates:maintainOrder", () => {
    Array.from({ length: 100 }).forEach(() => {
      const actual = new pl.DataFrame({
        "foo": [0, 1, 2, 2, 2],
        "bar": [0, 1, 2, 2, 2],
        "ham": ["0", "a", "b", "b", "b"],
      }).dropDuplicates({ maintainOrder: true });

      const expected = new pl.DataFrame({
        "foo": [0, 1, 2],
        "bar": [0, 1, 2],
        "ham": ["0", "a", "b"],
      });
      expect(actual).toFrameEqual(expected);
    });
  });
  // run this test 100 times to make sure it is deterministic.
  test("dropDuplicates:maintainOrder:single subset", () => {
    Array.from({ length: 100 }).forEach(() => {
      const actual = new pl.DataFrame({
        "foo": [0, 1, 2, 2, 2],
        "bar": [0, 1, 2, 2, 2],
        "ham": ["0", "a", "b", "c", "d"],
      }).dropDuplicates({ maintainOrder: true, subset: "foo" });

      const expected = new pl.DataFrame({
        "foo": [0, 1, 2],
        "bar": [0, 1, 2],
        "ham": ["0", "a", "b"],
      });
      expect(actual).toFrameEqual(expected);
    });
  });
  // run this test 100 times to make sure it is deterministic.
  test("dropDuplicates:maintainOrder:multi subset", () => {
    Array.from({ length: 100 }).forEach(() => {
      const actual = new pl.DataFrame({
        "foo": [0, 1, 2, 2, 2],
        "bar": [0, 1, 2, 2, 2],
        "ham": ["0", "a", "b", "c", "c"],
      }).dropDuplicates({ maintainOrder: true, subset: ["foo", "ham"] });

      const expected = new pl.DataFrame({
        "foo": [0, 1, 2, 2],
        "bar": [0, 1, 2, 2],
        "ham": ["0", "a", "b", "c"],
      });
      expect(actual).toFrameEqual(expected);
    });
  });
  test("dropNulls", () => {
    const actual = new pl.DataFrame({
      "foo": [1, null, 2, 3],
      "bar": [6.0, .5, 7.0, 8.0],
      "ham": ["a", "d", "b", "c"],
    }).dropNulls();
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
      "ham": ["a", "b", "c"],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("dropNulls subset", () => {
    const actual = new pl.DataFrame({
      "foo": [1, null, 2, 3],
      "bar": [6.0, .5, 7.0, 8.0],
      "ham": ["a", "d", "b", "c"],
    }).dropNulls("foo");
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
      "ham": ["a", "b", "c"],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("explode", () => {
    const actual = new pl.DataFrame({
      "letters": ["c", "a"],
      "nrs": [[1, 2], [1, 3]]
    }).explode("nrs");

    const expected = new pl.DataFrame({
      "letters": ["c", "c", "a", "a"],
      "nrs": [1, 2, 1, 3]
    });

    expect(actual).toFrameEqual(expected);
  });
  test("fillNull:zero", () => {
    const actual = new pl.DataFrame({
      "foo": [1, null, 2, 3],
      "bar": [6.0, .5, 7.0, 8.0],
      "ham": ["a", "d", "b", "c"],
    }).fillNull("zero");
    const expected = new pl.DataFrame({
      "foo": [1, 0, 2, 3],
      "bar": [6.0, .5, 7.0, 8.0],
      "ham": ["a", "d", "b", "c"],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("fillNull:one", () => {
    const actual = new pl.DataFrame({
      "foo": [1, null, 2, 3],
      "bar": [6.0, .5, 7.0, 8.0],
      "ham": ["a", "d", "b", "c"],
    }).fillNull("one");
    const expected = new pl.DataFrame({
      "foo": [1, 1, 2, 3],
      "bar": [6.0, .5, 7.0, 8.0],
      "ham": ["a", "d", "b", "c"],
    });
    expect(actual).toFrameEqual(expected);
  });
  test.todo("filter");
  test("findIdxByName", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).findIdxByName("ham");
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  test("fold:single column", () => {
    const expected = new pl.Series([1, 2, 3]);
    const df = new pl.DataFrame([expected]);
    const actual = df.fold((a, b) => a.concat(b));
    expect(actual).toSeriesEqual(expected);
  });
  test("fold", () => {
    const s1 = new pl.Series([1, 2, 3]);
    const s2 = new pl.Series([4, 5, 6]);
    const s3 = new pl.Series([7, 8, 1]);
    const expected = new pl.Series("foo", [true, true, false]);
    const df = new pl.DataFrame([s1, s2, s3]);
    const actual = df.fold((a, b) => a.lessThan(b)).alias("foo");
    expect(actual).toSeriesEqual(expected);
  });
  test("fold-again", () => {
    const s1 = new pl.Series([1, 2, 3]);
    const s2 = new pl.Series([4, 5, 6]);
    const s3 = new pl.Series([7, 8, 1]);
    const expected = new pl.Series("foo", [12, 15, 10]);
    const df = new pl.DataFrame([s1, s2, s3]);
    const actual = df.fold((a, b) => a.plus(b)).alias("foo");
    expect(actual).toSeriesEqual(expected);
  });
  test("frameEqual:true", () => {
    const df = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
    });
    const other = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
    });
    const actual = df.frameEqual(other);
    expect(actual).toStrictEqual(true);
  });
  test("frameEqual:false", () => {
    const df = new pl.DataFrame({
      "foo": [3, 2, 22],
      "baz": [0, 7, 8],
    });
    const other = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
    });
    const actual = df.frameEqual(other);
    expect(actual).toStrictEqual(false);
  });
  test("frameEqual:nullEq:false", () => {
    const df = new pl.DataFrame({
      "foo": [1, 2, null],
      "bar": [6, 7, 8],
    });
    const other = new pl.DataFrame({
      "foo": [1, 2, null],
      "bar": [6, 7, 8],
    });
    const actual = df.frameEqual(other, false);
    expect(actual).toStrictEqual(false);
  });
  test("frameEqual:nullEq:true", () => {
    const df = new pl.DataFrame({
      "foo": [1, 2, null],
      "bar": [6, 7, 8],
    });
    const other = new pl.DataFrame({
      "foo": [1, 2, null],
      "bar": [6, 7, 8],
    });
    const actual = df.frameEqual(other, true);
    expect(actual).toStrictEqual(true);
  });
  test("getColumn", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).getColumn("ham");
    const expected = new pl.Series("ham", ["a", "b", "c"]);
    expect(actual).toSeriesEqual(expected);
  });
  test("getColumns", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "ham": ["a", "b", "c"]
    }).getColumns();
    const expected = [
      new pl.Series("foo", [1, 2, 3]),
      new pl.Series("ham", ["a", "b", "c"])
    ];
    actual.forEach((a, idx) => {
      expect(a).toSeriesEqual(expected[idx]);
    });

  });
  test("groupBy", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "ham": ["a", "b", "c"]
    }).groupBy("foo");
    expect(actual.toString()).toEqual("GroupBy");
  });
  test("hashRows", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "ham": ["a", "b", "c"]
    }).hashRows();
    expect(actual.dtype).toEqual("UInt64");
  });
  test.each([
    [1],
    [1, 2],
    [1, 2, 3],
    [1, 2, 3, 4],
  ])("hashRows:positional", (...args: any[]) => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "ham": ["a", "b", "c"]
    }).hashRows(...args);
    expect(actual.dtype).toEqual("UInt64");
  });
  test.each([
    [{ k0: 1 }],
    [{ k0: 1, k1: 2 }],
    [{ k0: 1, k1: 2, k2: 3 }],
    [{ k0: 1, k1: 2, k2: 3, k3: 4 }],
  ])("hashRows:named", (opts) => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "ham": ["a", "b", "c"]
    }).hashRows(opts);
    expect(actual.dtype).toEqual("UInt64");
  });
  test("head", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "ham": ["a", "b", "c"]
    }).head(1);
    const expected = new pl.DataFrame({
      "foo": [1],
      "ham": ["a"]
    }).head(1);
    expect(actual).toFrameEqual(expected);
  });
  test("hstack:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).hstack([new pl.Series("apple", [10, 20, 30])]);
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"],
      "apple": [10, 20, 30]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("hstack:df", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).hstack(new pl.DataFrame([new pl.Series("apple", [10, 20, 30])]));
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"],
      "apple": [10, 20, 30]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("hstack:df", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    });
    actual.insertAtIdx(0, new pl.Series("apple", [10, 20, 30]));
    const expected = new pl.DataFrame({
      "apple": [10, 20, 30],
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("interpolate", () => {
    const df = new pl.DataFrame({
      a: [1, null, 3]
    });
    const expected = new pl.DataFrame({
      a: [1, 2, 3]
    });
    const actual = df.interpolate();
    expect(actual).toFrameEqual(expected);
  });
  test("isDuplicated", () => {
    const df = new pl.DataFrame({
      a: [1, 2, 2],
      b: [1, 2, 2]
    });
    const expected = new pl.Series([false, true, true]);
    const actual = df.isDuplicated();
    expect(actual).toSeriesEqual(expected);
  });
  test("isEmpty", () => {
    const df = new pl.DataFrame({});
    expect(df.isEmpty()).toEqual(true);
  });
  test("isUnique", () => {
    const df = new pl.DataFrame({
      a: [1, 2, 2],
      b: [1, 2, 2]
    });
    const expected = new pl.Series([true, false, false]);
    const actual = df.isUnique();
    expect(actual).toSeriesEqual(expected);
  });
  describe("join", () => {
    test("on", () => {
      const df = new pl.DataFrame({
        "foo": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"]
      });
      const actual = df.join(otherDF, { on: "ham" });

      const expected = new pl.DataFrame({
        "foo": [1, 2],
        "bar": [6.0, 7.0],
        "ham": ["a", "b"],
        "apple": ["x", "y"],
      });
      expect(actual).toFrameEqual(expected);
    });
    test("on:multiple-columns", () => {
      const df = new pl.DataFrame({
        "foo": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"],
        "foo": [1, 10, 11],

      });
      const actual = df.join(otherDF, { on: ["ham", "foo"] });

      const expected = new pl.DataFrame({
        "foo": [1],
        "bar": [6.0],
        "ham": ["a"],
        "apple": ["x"],
      });
      expect(actual).toFrameEqual(expected);
    });
    test("on:left&right", () => {
      const df = new pl.DataFrame({
        "foo_left": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"],
        "foo_right": [1, 10, 11],

      });
      const actual = df.join(otherDF, {
        leftOn: ["foo_left", "ham"],
        rightOn: ["foo_right", "ham"]
      });

      const expected = new pl.DataFrame({
        "foo_left": [1],
        "bar": [6.0],
        "ham": ["a"],
        "apple": ["x"],
      });
      expect(actual).toFrameEqual(expected);
    });
    test("on:left&right", () => {
      const df = new pl.DataFrame({
        "foo_left": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"],
        "foo_right": [1, 10, 11],

      });
      const actual = df.join(otherDF, {
        leftOn: ["foo_left", "ham"],
        rightOn: ["foo_right", "ham"]
      });

      const expected = new pl.DataFrame({
        "foo_left": [1],
        "bar": [6.0],
        "ham": ["a"],
        "apple": ["x"],
      });
      expect(actual).toFrameEqual(expected);
    });
    test("on throws error if only 'leftOn' is specified", () => {
      const df = new pl.DataFrame({
        "foo_left": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"],
        "foo_right": [1, 10, 11],

      });
      const f = () => df.join(otherDF, {
        leftOn: ["foo_left", "ham"],
      } as any);
      expect(f).toThrow(TypeError);
    });
    test("on throws error if only 'rightOn' is specified", () => {
      const df = new pl.DataFrame({
        "foo_left": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"],
        "foo_right": [1, 10, 11],

      });
      const f = () => df.join(otherDF, {
        rightOn: ["foo_right", "ham"],
      } as any);
      expect(f).toThrow(TypeError);
    });
    test("on takes precedence over left&right", () => {
      const df = new pl.DataFrame({
        "foo_left": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"],
        "foo_right": [1, 10, 11],

      });
      const actual = df.join(otherDF, {
        on: "ham",
        leftOn: ["foo_left", "ham"],
        rightOn: ["foo_right", "ham"],
      } as any);
      const expected = new pl.DataFrame({
        "foo_left": [1, 2],
        "bar": [6.0, 7.0],
        "ham": ["a", "b"],
        "apple": ["x", "y"],
        "foo_right": [1, 10],
      });
      expect(actual).toFrameEqual(expected);
    });
    test("how:left", () => {
      const df = new pl.DataFrame({
        "foo": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"],
        "foo": [1, 10, 11],

      });
      const actual = df.join(otherDF, {
        on: "ham",
        how: "left"
      });
      const expected = new pl.DataFrame({
        "foo": [1, 2, 3],
        "bar": [6, 7, 8],
        "ham": ["a", "b", "c"],
        "apple": ["x", "y", null],
        "fooright": [1, 10, null],
      });
      expect(actual).toFrameEqual(expected);
    });
    test("how:outer", () => {
      const df = new pl.DataFrame({
        "foo": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y"],
        "ham": ["a", "d"],
        "foo": [1, 10],

      });
      const actual = df.join(otherDF, {
        on: "ham",
        how: "outer"
      });
      const expected = new pl.DataFrame({
        "foo": [1, 2, 3, null],
        "bar": [6, 7, 8, null],
        "ham": ["a", "b", "c", "d"],
        "apple": ["x", null, null, "y"],
        "fooright": [1, null, null, 10],
      });
      expect(actual).toFrameEqual(expected);
    });
    test("suffix", () => {
      const df = new pl.DataFrame({
        "foo": [1, 2, 3],
        "bar": [6.0, 7.0, 8.0],
        "ham": ["a", "b", "c"]
      });
      const otherDF = new pl.DataFrame({
        "apple": ["x", "y", "z"],
        "ham": ["a", "b", "d"],
        "foo": [1, 10, 11],

      });
      const actual = df.join(otherDF, {
        on: "ham",
        how: "left",
        suffix: "_other"
      });
      const expected = new pl.DataFrame({
        "foo": [1, 2, 3],
        "bar": [6, 7, 8],
        "ham": ["a", "b", "c"],
        "apple": ["x", "y", null],
        "foo_other": [1, 10, null],
      });
      expect(actual).toFrameEqual(expected);
    });
  });
  test("lazy", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
      "ham": ["a", "b", "c"]
    }).lazy().collectSync();

    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6.0, 7.0, 8.0],
      "ham": ["a", "b", "c"]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("limit", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "ham": ["a", "b", "c"]
    }).limit(1);
    const expected = new pl.DataFrame({
      "foo": [1],
      "ham": ["a"]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("max:axis:0", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).max();
    expect(actual.row(0)).toEqual([3, 8, null]);
  });
  test("max:axis:1", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 9],
      "bar": [6, 2, 8],
    }).max(1);
    const expected = new pl.Series("foo", [6, 2, 9]);
    expect(actual).toSeriesEqual(expected);
  });
  test("mean:axis:0", () => {
    const actual = new pl.DataFrame({
      "foo": [4, 4, 4],
      "bar": [1, 1, 10],
      "ham": ["a", "b", "a"]
    }).mean();
    expect(actual.row(0)).toEqual([4, 4, null]);
  });
  test("mean:axis:1", () => {
    const actual = new pl.DataFrame({
      "foo": [1, null, 6],
      "bar": [6, 2, 8],
    }).mean(1, "ignore");
    const expected = new pl.Series("foo", [3.5, 2, 7]);
    expect(actual).toSeriesEqual(expected);
  });
  test("median", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).median();

    expect(actual.row(0)).toEqual([2, 7, null]);
  });
  test.todo("melt");
  test("min:axis:0", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).min();
    expect(actual.row(0)).toEqual([1, 6, null]);
  });
  test("min:axis:1", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 9],
      "bar": [6, 2, 8],
    }).min(1);
    const expected = new pl.Series("foo", [1, 2, 8]);
    expect(actual).toSeriesEqual(expected);
  });
  test("nChunks", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 9],
      "bar": [6, 2, 8],
    }).nChunks();
    expect(actual).toEqual(1);
  });
  test("nullCount", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, null],
      "bar": [6, 2, 8],
      "apple": [6, 2, 8],
      "pizza": [null, null, 8],
    }).nullCount();
    expect(actual.row(0)).toEqual([1, 0, 0, 2]);
  });
  test.todo("pipe");
  test("quantile", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).quantile(0.5);
    expect(actual.row(0)).toEqual([2, 7, null]);
  });
  test("rename", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).rename({
      "foo": "foo_new",
      "bar": "bar_new",
      "ham": "ham_new"
    });
    expect(actual.columns).toEqual(["foo_new", "bar_new", "ham_new"]);
  });
  test("replaceAtIdx", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    });
    const s = new pl.Series("new_foo", [0.12, 2.0, 9.99]);
    actual.replaceAtIdx(0, s);
    expect(actual.getColumn("new_foo")).toSeriesEqual(s);
    expect(actual.findIdxByName("new_foo")).toEqual(0);
  });
  test("row", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).row(1);
    expect(actual).toEqual([2, 7, "b"]);
  });
  test("rows", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).rows();
    expect(actual).toEqual([
      [1, 6, "a"],
      [2, 7, "b"],
      [3, 8, "c"]
    ]);
  });
  test("sample:n", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).sample(2);
    expect(actual.height).toStrictEqual(2);
  });
  test("sample:frac", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
      "ham": ["a", "b", "c", null]
    }).sample({ frac: 0.5 });
    expect(actual.height).toStrictEqual(2);
  });
  test("sample:frac", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
      "ham": ["a", "b", "c", null]
    }).sample({ frac: 0.75 });
    expect(actual.height).toStrictEqual(3);
  });
  test("sample:invalid", () => {
    const fn = () => new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
      "ham": ["a", "b", "c", null]
    }).sample({} as any);
    expect(fn).toThrow(TypeError);
  });
  test("select:strings", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
      "ham": ["a", "b", "c", null]
    }).select("ham", "foo");
    const foo = new pl.Series("foo", [1, 2, 3, 1]);
    const ham = new pl.Series("ham", ["a", "b", "c", null]);
    expect(actual.width).toStrictEqual(2);
    expect(actual.getColumn("foo")).toSeriesEqual(foo);
    expect(actual.getColumn("ham")).toSeriesEqual(ham);
  });
  test("select:expr", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
      "ham": ["a", "b", "c", null]
    }).select(pl.col("foo"), "ham");
    const foo = new pl.Series("foo", [1, 2, 3, 1]);
    const ham = new pl.Series("ham", ["a", "b", "c", null]);
    expect(actual.width).toStrictEqual(2);
    expect(actual.getColumn("foo")).toSeriesEqual(foo);
    expect(actual.getColumn("ham")).toSeriesEqual(ham);
  });
  test("shift:pos", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).shift(1);
    const expected = new pl.DataFrame({
      "foo": [null, 1, 2, 3],
      "bar": [null, 6, 7, 8],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("shift:neg", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).shift(-1);
    const expected = new pl.DataFrame({
      "foo": [2, 3, 1, null],
      "bar": [7, 8, 1, null],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("shiftAndFill:positional", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).shiftAndFill(-1, 99);
    const expected = new pl.DataFrame({
      "foo": [2, 3, 1, 99],
      "bar": [7, 8, 1, 99],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("shiftAndFill:named", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).shiftAndFill({ periods: -1, fillValue: 99 });
    const expected = new pl.DataFrame({
      "foo": [2, 3, 1, 99],
      "bar": [7, 8, 1, 99],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("shrinkToFit:inPlace", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    });
    actual.shrinkToFit(true);
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("shrinkToFit", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).shrinkToFit();
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("slice:positional", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).slice(0, 2);
    const expected = new pl.DataFrame({
      "foo": [1, 2],
      "bar": [6, 7],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("slice:named", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).slice({ offset: 0, length: 2 });
    const expected = new pl.DataFrame({
      "foo": [1, 2],
      "bar": [6, 7],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("sort:positional", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).sort("bar");
    const expected = new pl.DataFrame({
      "foo": [1, 1, 2, 3],
      "bar": [1, 6, 7, 8],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("sort:named", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, 1],
      "bar": [6, 7, 8, 1],
    }).sort({ by: "bar", reverse: true });
    const expected = new pl.DataFrame({
      "foo": [3, 2, 1, 1],
      "bar": [8, 7, 6, 1],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("sort:multi-args", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3, -1],
      "bar": [6, 7, 8, 2],
      "baz": ["a", "b", "d", "A"],
    }).sort({
      by: [
        pl.col("baz"),
        pl.col("bar")
      ]
    });
    const expected = new pl.DataFrame({
      "foo": [-1, 1, 2, 3],
      "bar": [2, 6, 7, 8],
      "baz": ["A", "a", "b", "d"],
    });
    expect(actual).toFrameEqual(expected);
  });
  test("std", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).std();
    const expected = new pl.DataFrame([
      new pl.Series("foo", [1]),
      new pl.Series("bar", [1]),
      new pl.Series("ham", [null], pl.Utf8),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("sum:axis:0", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).sum();
    expect(actual.row(0)).toEqual([6, 21, null]);
  });
  test("sum:axis:1", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 9],
      "bar": [6, 2, 8],
    }).sum(1).rename("sum");
    const expected = new pl.Series("sum", [7, 4, 17]);
    expect(actual).toSeriesEqual(expected);
  });
  test("tail", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 9],
      "bar": [6, 2, 8],
    }).tail(1).row(0);
    const expected = [9, 8];
    expect(actual).toEqual(expected);
  });
  test("transpose", () => {
    const expected = new pl.DataFrame({
      "column_0": [1, 1],
      "column_1": [2, 2],
      "column_2": [3, 3]
    });
    const df = new pl.DataFrame({
      a: [1, 2, 3],
      b: [1, 2, 3]
    });
    const actual = df.transpose();
    expect(actual).toFrameEqual(expected);
  });
  test("transpose:includeHeader", () => {
    const expected = new pl.DataFrame({
      "column": ["a", "b"],
      "column_0": [1, 1],
      "column_1": [2, 2],
      "column_2": [3, 3]
    });
    const df = new pl.DataFrame({
      a: [1, 2, 3],
      b: [1, 2, 3]
    });
    const actual = df.transpose({ includeHeader: true });
    expect(actual).toFrameEqual(expected);
  });
  test("transpose:columnNames", () => {
    const expected = new pl.DataFrame({
      "a": [1, 1],
      "b": [2, 2],
      "c": [3, 3]
    });
    const df = new pl.DataFrame({
      a: [1, 2, 3],
      b: [1, 2, 3]
    });
    const actual = df.transpose({ includeHeader: false, columnNames: "abc" });
    expect(actual).toFrameEqual(expected);
  });
  test("transpose:columnNames:generator", () => {
    const expected = new pl.DataFrame({
      "col_0": [1, 1],
      "col_1": [2, 2],
      "col_2": [3, 3]
    });
    function* namesGenerator() {
      const baseName = "col_";
      let count = 0;
      while (true) {
        let name = `${baseName}${count}`;
        yield name;
        count++;
      }
    }
    const df = new pl.DataFrame({
      a: [1, 2, 3],
      b: [1, 2, 3]
    });
    const actual = df.transpose({ includeHeader: false, columnNames: namesGenerator() });
    expect(actual).toFrameEqual(expected);
  });
  test("var", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [6, 7, 8],
      "ham": ["a", "b", "c"]
    }).var();
    const expected = new pl.DataFrame([
      new pl.Series("foo", [1]),
      new pl.Series("bar", [1]),
      new pl.Series("ham", [null], pl.Utf8),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("vstack", () => {
    const df1 = new pl.DataFrame({
      "foo": [1, 2],
      "bar": [6, 7],
      "ham": ["a", "b"]
    });
    const df2 = new pl.DataFrame({
      "foo": [3, 4],
      "bar": [8, 9],
      "ham": ["c", "d"]
    });

    const actual = df1.vstack(df2);
    const expected = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 3, 4]),
      new pl.Series("bar", [6, 7, 8, 9]),
      new pl.Series("ham", ["a", "b", "c", "d"]),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("withColumn:series", () => {
    const actual = df
      .clone()
      .withColumn(new pl.Series("col_a", ["a", "a", "a"], pl.Utf8));
    const expected = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 9], pl.Int16),
      new pl.Series("bar", [6, 2, 8], pl.Int16),
      new pl.Series("col_a", ["a", "a", "a"], pl.Utf8),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("withColumn:expr", () => {
    const actual = df
      .clone()
      .withColumn(pl.lit("a").alias("col_a"));

    const expected = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 9], pl.Int16),
      new pl.Series("bar", [6, 2, 8], pl.Int16),
      new pl.Series("col_a", ["a", "a", "a"], pl.Utf8),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("withColumns:series", () => {
    const actual = df
      .clone()
      .withColumns(
        new pl.Series("col_a", ["a", "a", "a"], pl.Utf8),
        new pl.Series("col_b", ["b", "b", "b"], pl.Utf8)
      );
    const expected = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 9], pl.Int16),
      new pl.Series("bar", [6, 2, 8], pl.Int16),
      new pl.Series("col_a", ["a", "a", "a"], pl.Utf8),
      new pl.Series("col_b", ["b", "b", "b"], pl.Utf8),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("withColumns:expr", () => {
    const actual = df
      .clone()
      .withColumns(
        pl.lit("a").alias("col_a"),
        pl.lit("b").alias("col_b")
      );
    const expected = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 9], pl.Int16),
      new pl.Series("bar", [6, 2, 8], pl.Int16),
      new pl.Series("col_a", ["a", "a", "a"], pl.Utf8),
      new pl.Series("col_b", ["b", "b", "b"], pl.Utf8),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("withColumnRenamed:positional", () => {
    const actual = df
      .clone()
      .withColumnRenamed("foo", "apple");

    const expected = new pl.DataFrame([
      new pl.Series("apple", [1, 2, 9], pl.Int16),
      new pl.Series("bar", [6, 2, 8], pl.Int16),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("withColumnRenamed:named", () => {
    const actual = df
      .clone()
      .withColumnRenamed({ existing: "foo", replacement: "apple" });

    const expected = new pl.DataFrame([
      new pl.Series("apple", [1, 2, 9], pl.Int16),
      new pl.Series("bar", [6, 2, 8], pl.Int16),
    ]);
    expect(actual).toFrameEqual(expected);
  });
  test("withRowCount", () => {
    const actual = df
      .clone()
      .withRowCount();

    const expected = new pl.DataFrame([
      new pl.Series("row_nr", [0, 1, 2], pl.UInt32),
      new pl.Series("foo", [1, 2, 9], pl.Int16),
      new pl.Series("bar", [6, 2, 8], pl.Int16),
    ]);
    expect(actual).toFrameEqual(expected);
  });
});
describe("io", () => {
  const df = new pl.DataFrame([
    new pl.Series("foo", [1, 2, 9], pl.Int16),
    new pl.Series("bar", [6, 2, 8], pl.Int16),
  ]);
  test("toCSV:string", () => {
    const actual = df.clone().toCSV();
    const expected = "foo,bar\n1,6\n2,2\n9,8\n";
    expect(actual).toEqual(expected);
  });
  test("toCSV:string:sep", () => {
    const actual = df.clone().toCSV({ sep: "X" });
    const expected = "fooXbar\n1X6\n2X2\n9X8\n";
    expect(actual).toEqual(expected);
  });
  test("toCSV:string:header", () => {
    const actual = df.clone().toCSV({ sep: "X", hasHeader: false });
    const expected = "1X6\n2X2\n9X8\n";
    expect(actual).toEqual(expected);
  });
  test("toCSV:stream", (done) => {
    const df = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 3], pl.UInt32),
      new pl.Series("bar", ["a", "b", "c"])
    ]);
    let body = "";
    const writeStream = new Stream.Writable({
      write(chunk, encoding, callback) {
        body += chunk;
        callback(null);

      }
    });
    df.toCSV(writeStream);
    const newDF = pl.readCSV(body);
    expect(newDF).toFrameEqual(df);
    done();
  });
  test("toCSV:path", (done) => {
    const df = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 3], pl.UInt32),
      new pl.Series("bar", ["a", "b", "c"])
    ]);
    df.toCSV("./test.csv");
    const newDF = pl.readCSV("./test.csv");
    expect(newDF).toFrameEqual(df);
    fs.rmSync("./test.csv");
    done();
  });
  test("toJS:dataframe", () => {
    const df = new pl.DataFrame({
      foo: [1],
      bar: ["a"]
    });
    const expected = {
      columns: [
        {
          name: "foo",
          datatype: "Float64",
          values: [1.0]
        },
        {
          name: "bar",
          datatype: "Utf8",
          values: ["a"]
        },
      ]
    };
    const actual = df.toObject({ orient: "dataframe" });
    expect(actual).toEqual(expected);
  });
  test("toJS:row", () => {
    const df = new pl.DataFrame({
      foo: [1],
      bar: ["a"]
    });
    const expected = [
      { foo: 1.0, bar: "a" }
    ];
    const actual = df.toObject({ orient: "row" });
    expect(actual).toEqual(expected);
  });
  test("toObject", () => {
    const df = new pl.DataFrame({
      foo: [1],
      bar: ["a"]
    });
    const expected = {
      columns: [
        {
          name: "foo",
          datatype: "Float64",
          values: [1]
        },
        {
          name: "bar",
          datatype: "Utf8",
          values: ["a"]
        }
      ]
    };
    const actual = df.toObject();
    expect(actual).toEqual(expected);
  });
  test("toJSON:multiline", () => {
    const rows = [
      { foo: 1.1, bar: 6.2, ham: "a" },
      { foo: 3.1, bar: 9.2, ham: "b" },
      { foo: 3.1, bar: 9.2, ham: "c" }
    ];
    const actual = new pl.DataFrame(rows).toJSON({ multiline: true });
    const expected = rows.map(r => JSON.stringify(r)).join("\n").concat("\n");
    expect(actual).toEqual(expected);
  });
  test("toJSON:stream", (done) => {
    const df = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 3], pl.UInt32),
      new pl.Series("bar", ["a", "b", "c"])
    ]);

    let body = "";
    const writeStream = new Stream.Writable({
      write(chunk, encoding, callback) {
        body += chunk;
        callback(null);

      }
    });
    df.toJSON(writeStream, { multiline: true });
    const newDF = pl.readJSON(body);
    expect(newDF).toFrameEqual(df);
    done();
  });
  test("toJSON:path", (done) => {
    const df = new pl.DataFrame([
      new pl.Series("foo", [1, 2, 3], pl.UInt32),
      new pl.Series("bar", ["a", "b", "c"])
    ]);
    df.toJSON("./test.json", { multiline: true });
    const newDF = pl.readJSON("./test.json");
    expect(newDF).toFrameEqual(df);
    fs.rmSync("./test.json");
    done();
  });
  test("JSON.stringify(df)", () => {
    const rows = [
      { foo: 1.1, bar: 6.2, ham: "a" },
      { foo: 3.1, bar: 9.2, ham: "b" },
      { foo: 3.1, bar: 9.2, ham: "c" }
    ];
    const df = new pl.DataFrame(rows);
    const expected = new pl.DataFrame(rows).toJSON();
    const actual = JSON.stringify(df);
    expect(actual).toEqual(expected);
  });
  test("toJSON:rows", () => {
    const rows = [
      { foo: 1.1, bar: 6.2, ham: "a" },
      { foo: 3.1, bar: 9.2, ham: "b" },
      { foo: 3.1, bar: 9.2, ham: "c" }
    ];
    const expected = JSON.stringify(rows);
    const actual = new pl.DataFrame(rows).toJSON({ orient: "row" });
    expect(actual).toEqual(expected);
  });
  test("toJSON:col", () => {
    const cols = {
      foo: [1, 2, 3],
      bar: ["a", "b", "c"]
    };
    const expected = JSON.stringify(cols);
    const actual = new pl.DataFrame(cols).toJSON({ orient: "col" });
    expect(actual).toEqual(expected);
  });
  test("toSeries", () => {
    const s = new pl.Series([1, 2, 3]);
    const actual = s.clone().toFrame().toSeries(0);
    expect(actual).toSeriesEqual(s);
  });
});
describe("create", () => {
  test("from empty", () => {
    const df = new pl.DataFrame();
    expect(df.isEmpty()).toStrictEqual(true);
  });
  test("from empty-object", () => {
    const df = new pl.DataFrame({});
    expect(df.isEmpty()).toStrictEqual(true);
  });
  test("all supported types", () => {
    const df = new pl.DataFrame({
      bool: [true, null],
      date: new pl.Series("", [new Date(), new Date()], pl.Date),
      date_nulls: new pl.Series("", [null, new Date()], pl.Date),
      datetime: new pl.Series("", [new Date(), new Date()]),
      datetime_nulls: new pl.Series("", [null, new Date()]),
      string: ["a", "b"],
      string_nulls: [null, "a"],
      categorical: new pl.Series("", ["one", "two"], pl.Categorical),
      categorical_nulls: new pl.Series("", ["apple", null], pl.Categorical),
      list: [[1], [2, 3]],
      float_64: [1, 2],
      float_64_nulls: [1, null],
      uint_64: [1n, 2n],
      uint_64_null: [null, 2n],
      int_8_typed: Int8Array.from([1, 2]),
      int_16_typed: Int16Array.from([1, 2]),
      int_32_typed: Int32Array.from([1, 2]),
      int_64_typed: BigInt64Array.from([1n, 2n]),
      uint_8_typed: Uint8Array.from([1, 2]),
      uint_16_typed: Uint16Array.from([1, 2]),
      uint_32_typed: Uint32Array.from([1, 2]),
      uint_64_typed: BigUint64Array.from([1n, 2n]),
      float_32_typed: Float32Array.from([1.1, 2.2]),
      float_64_typed: Float64Array.from([1.1, 2.2]),
    });
    const expectedSchema = {
      bool: "Bool",
      date: "Date",
      date_nulls: "Date",
      datetime: "Datetime",
      datetime_nulls: "Datetime",
      string: "Utf8",
      string_nulls: "Utf8",
      categorical: "Categorical",
      categorical_nulls: "Categorical",
      list: "List",
      float_64: "Float64",
      float_64_nulls: "Float64",
      uint_64: "UInt64",
      uint_64_null: "UInt64",
      int_8_typed: "Int8",
      int_16_typed: "Int16",
      int_32_typed: "Int32",
      int_64_typed: "Int64",
      uint_8_typed: "UInt8",
      uint_16_typed: "UInt16",
      uint_32_typed: "UInt32",
      uint_64_typed: "UInt64",
      float_32_typed: "Float32",
      float_64_typed: "Float64",
    };
    const actual = df.schema();
    expect(actual).toEqual(expectedSchema);
  });
  test("from series-array", () => {
    const s1 = new pl.Series("num", [1, 2, 3]);
    const s2 = new pl.Series("date", [null, Date.now(), Date.now()], pl.Datetime);
    const df = new pl.DataFrame([s1, s2]);
    expect(df.getColumn("num")).toSeriesEqual(s1);
    expect(df.getColumn("date")).toSeriesEqual(s2);
  });
  test("from arrays", () => {
    const columns = [
      [1, 2, 3],
      [1, 2, 2]
    ];

    const df = new pl.DataFrame(columns);

    expect(df.getColumns()[0].toArray()).toEqual(columns[0]);
    expect(df.getColumns()[1].toArray()).toEqual(columns[1]);
  });
  test("from arrays: orient=col", () => {
    const columns = [
      [1, 2, 3],
      [1, 2, 2]
    ];

    const df = new pl.DataFrame(columns, { orient: "col" });

    expect(df.getColumns()[0].toArray()).toEqual(columns[0]);
    expect(df.getColumns()[1].toArray()).toEqual(columns[1]);
  });
  test("from arrays: orient=row", () => {
    const rows = [
      [1, 2, 3],
      [1, 2, 2]
    ];

    const df = new pl.DataFrame(rows, { orient: "row" });

    expect(df.row(0)).toEqual(rows[0]);
    expect(df.row(1)).toEqual(rows[1]);
  });
  test("from arrays with column names: orient=col", () => {
    const columns = [
      [1, 2, 3],
      [1, 2, 2]
    ];

    const expectedColumnNames = ["a", "b"];
    const df = new pl.DataFrame(columns, { columns: expectedColumnNames, orient: "col" });

    expect(df.getColumns()[0].toArray()).toEqual(columns[0]);
    expect(df.getColumns()[1].toArray()).toEqual(columns[1]);
    expect(df.columns).toEqual(expectedColumnNames);

  });
  test("from arrays: invalid ", () => {
    const columns = [
      [1, 2, 3],
      [1, 2, 2]
    ];

    const fn = () => new pl.DataFrame(columns, { columns: ["a", "b", "c", "d"] });
    expect(fn).toThrow();
  });
  test("from arrays with columns, orient=row", () => {
    const rows = [
      [1, 2, 3],
      [1, 2, 2]
    ];
    const expectedColumns = ["a", "b", "c"];
    const df = new pl.DataFrame(rows, { columns: expectedColumns, orient: "row" });

    expect(df.row(0)).toEqual(rows[0]);
    expect(df.row(1)).toEqual(rows[1]);
    expect(df.columns).toEqual(expectedColumns);
  });
  test("from row objects", () => {
    const rows = [
      { "num": 1, "date": new Date(Date.now()), "string": "foo1" },
      { "num": 1, "date": new Date(Date.now()), "string": "foo2" }
    ];

    const df = new pl.DataFrame(rows);
    expect(df.row(0)).toEqual(Object.values(rows[0]));
    expect(df.row(1)).toEqual(Object.values(rows[1]));
    expect(df.columns).toEqual(Object.keys(rows[0]));
    expect(df.dtypes).toEqual(["Float64", "Datetime", "Utf8"]);
  });
  test("from nulls", () => {
    const df = new pl.DataFrame({ "nulls": [null, null, null] });
    const expected = new pl.DataFrame([new pl.Series("nulls", [null, null, null], pl.Float64)]);
    expect(df).toFrameStrictEqual(expected);
  });
  test("from list types", () => {
    const int8List = [
      Int8Array.from([1, 2, 3]),
      Int8Array.from([2]),
      Int8Array.from([1, 1, 1])
    ];
    const expected: any = {
      "num_list": [[1, 2], [], [3, null]],
      "bool_list": [[true, null], [], [false]],
      "str_list": [["a", null], ["b", "c"], []],
      "bigint_list": [[1n], [2n, 3n], []],
      "int8_list": int8List
    };
    expected.int8_list = int8List.map(i => [...i]);
    const df = new pl.DataFrame(expected);

    expect(df.toObject({ orient: "col" })).toEqual(expected);
  });
});
describe("arithmetic", () => {
  test("add", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [4, 5, 6]
    }).add(1);
    const expected = new pl.DataFrame({
      "foo": [2, 3, 4],
      "bar": [5, 6, 7]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("sub", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [4, 5, 6]
    }).sub(1);
    const expected = new pl.DataFrame({
      "foo": [0, 1, 2],
      "bar": [3, 4, 5]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("div", () => {
    const actual = new pl.DataFrame({
      "foo": [2, 4, 6],
      "bar": [2, 2, 2]
    }).div(2);
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [1, 1, 1]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("mul", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [3, 2, 1]
    }).mul(2);
    const expected = new pl.DataFrame({
      "foo": [2, 4, 6],
      "bar": [6, 4, 2]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("rem", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [3, 2, 1]
    }).rem(2);
    const expected = new pl.DataFrame({
      "foo": [1, 0, 1],
      "bar": [1, 0, 1]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("plus", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [4, 5, 6]
    }).plus(1);
    const expected = new pl.DataFrame({
      "foo": [2, 3, 4],
      "bar": [5, 6, 7]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("minus", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [4, 5, 6]
    }).minus(1);
    const expected = new pl.DataFrame({
      "foo": [0, 1, 2],
      "bar": [3, 4, 5]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("divideBy", () => {
    const actual = new pl.DataFrame({
      "foo": [2, 4, 6],
      "bar": [2, 2, 2]
    }).divideBy(2);
    const expected = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [1, 1, 1]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("multiplyBy", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [3, 2, 1]
    }).multiplyBy(2);
    const expected = new pl.DataFrame({
      "foo": [2, 4, 6],
      "bar": [6, 4, 2]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("modulo", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [3, 2, 1]
    }).modulo(2);
    const expected = new pl.DataFrame({
      "foo": [1, 0, 1],
      "bar": [1, 0, 1]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("add:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [4, 5, 6]
    }).add(new pl.Series([3, 2, 1]));
    const expected = new pl.DataFrame({
      "foo": [4, 4, 4],
      "bar": [7, 7, 7]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("sub:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [4, 5, 6]
    }).sub(new pl.Series([1, 2, 3]));
    const expected = new pl.DataFrame({
      "foo": [0, 0, 0],
      "bar": [3, 3, 3]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("div:series", () => {
    const actual = new pl.DataFrame({
      "foo": [2, 4, 6],
      "bar": [2, 2, 2]
    }).div(new pl.Series([2, 2, 1]));
    const expected = new pl.DataFrame({
      "foo": [1, 2, 6],
      "bar": [1, 1, 2]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("mul:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [3, 2, 1]
    }).mul(new pl.Series([2, 3, 1]));
    const expected = new pl.DataFrame({
      "foo": [2, 6, 3],
      "bar": [6, 6, 1]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("rem:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [3, 2, 1]
    }).rem(new pl.Series([1, 1, 3]));
    const expected = new pl.DataFrame({
      "foo": [0, 0, 0],
      "bar": [0, 0, 1]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("plus:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [4, 5, 6]
    }).plus(new pl.Series([3, 2, 1]));
    const expected = new pl.DataFrame({
      "foo": [4, 4, 4],
      "bar": [7, 7, 7]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("minus:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [4, 5, 6]
    }).minus(new pl.Series([1, 2, 3]));
    const expected = new pl.DataFrame({
      "foo": [0, 0, 0],
      "bar": [3, 3, 3]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("divideBy:series", () => {
    const actual = new pl.DataFrame({
      "foo": [2, 4, 6],
      "bar": [2, 2, 2]
    }).divideBy(new pl.Series([2, 2, 1]));
    const expected = new pl.DataFrame({
      "foo": [1, 2, 6],
      "bar": [1, 1, 2]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("multiplyBy:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [3, 2, 1]
    }).multiplyBy(new pl.Series([2, 3, 1]));
    const expected = new pl.DataFrame({
      "foo": [2, 6, 3],
      "bar": [6, 6, 1]
    });
    expect(actual).toFrameEqual(expected);
  });
  test("modulo:series", () => {
    const actual = new pl.DataFrame({
      "foo": [1, 2, 3],
      "bar": [3, 2, 1]
    }).modulo(new pl.Series([1, 1, 3]));
    const expected = new pl.DataFrame({
      "foo": [0, 0, 0],
      "bar": [0, 0, 1]
    });
    expect(actual).toFrameEqual(expected);
  });
});

describe("meta", () => {
  test("array destructuring", () => {
    const df = new pl.DataFrame({
      os: ["apple", "linux"],
      version: [10.12, 18.04]
    });
    const [col0] = df;
    expect(col0).toSeriesEqual(df.getColumn("os"));
    const [, version] = df;
    expect(version).toSeriesEqual(df.getColumn("version"));
    const [[row0Index0], [, row1Index1]] = df;
    expect(row0Index0).toStrictEqual("apple");
    expect(row1Index1).toStrictEqual(18.04);
  });
  test("object destructuring", () => {
    const df = new pl.DataFrame({
      os: ["apple", "linux"],
      version: [10.12, 18.04]
    });
    const { os, version } = <any>df;
    expect(os).toSeriesEqual(df.getColumn("os"));
    expect(version).toSeriesEqual(df.getColumn("version"));
    const df2 = new pl.DataFrame({
      fruits: ["apple", "orange"],
      cars: ["ford", "honda"]
    });
    const df3 = new pl.DataFrame({ ...df, ...df2 });
    const expected = df.hstack(df2);
    expect(df3).toFrameEqual(expected);
  });
  test("object bracket notation", () => {
    const df = new pl.DataFrame({
      os: ["apple", "linux"],
      version: [10.12, 18.04]
    });

    expect(df["os"]).toSeriesEqual(df.getColumn("os"));
    expect(df["os"][1]).toStrictEqual("linux");

    df["os"] = new pl.Series(["mac", "ubuntu"]);
    expect(df["os"][0]).toStrictEqual("mac");
  });
  test("object.keys shows column names", () => {
    const df = new pl.DataFrame({
      os: ["apple", "linux"],
      version: [10.12, 18.04]
    });
    const keys = Object.keys(df);
    expect(keys).toEqual(df.columns);
  });
  test("object.values shows column values", () => {
    const df = new pl.DataFrame({
      os: ["apple", "linux"],
      version: [10.12, 18.04]
    });
    const values = Object.values(df);
    expect(values[0]).toSeriesEqual(df["os"]);
    expect(values[1]).toSeriesEqual(df["version"]);
  });
  test("df rows", () => {
    const df = new pl.DataFrame({
      os: ["apple", "linux"],
      version: [10.12, 18.04]
    });
    const actual = df[0][0];
    expect(actual).toStrictEqual(df.getColumn("os").get(0));
  });
  test("proxy:has", () => {
    const df = new pl.DataFrame({
      os: ["apple", "linux"],
      version: [10.12, 18.04]
    });
    expect("os" in df).toBe(true);
  });
  test("inspect & toString", () => {
    const df = new pl.DataFrame({
      a: [1]
    });
    const expected = `shape: (1, 1)
┌─────┐
│ a   │
│ --- │
│ f64 │
╞═════╡
│ 1.0 │
└─────┘`;
    const actualInspect = df[Symbol.for("nodejs.util.inspect.custom")]();
    const dfString = df.toString();
    expect(actualInspect).toStrictEqual(expected);
    expect(dfString).toStrictEqual(expected);
  });
});
