/* eslint-disable newline-per-chained-call */
import * as pl from "@polars";
import { InvalidOperationError } from "../polars/error";
import Chance from "chance";


describe("from lists", () => {
  test("bool", () => {
    const expected = [[true, false], [true], [null], []];
    // @ts-ignore
    const actual = new pl.Series(expected).toArray();
    expect(actual).toEqual(expected);
  });
  test("number", () => {
    const expected = [[1, 2], [3], [null], []];
    // @ts-ignore
    const actual = new pl.Series(expected).toArray();
    expect(actual).toEqual(expected);
  });
  test("bigint", () => {
    const expected = [[1n, 2n], [3n], [null], []];
    // @ts-ignore
    const actual = new pl.Series(expected).toArray();
    expect(actual).toEqual(expected);
  });
  test("string", () => {
    const expected = [[], [null], ["a"], [null], ["b", "c"]];
    // @ts-ignore
    const actual = new pl.Series(expected).toArray();
    expect(actual).toEqual(expected);
  });
});
describe("typedArrays", () => {
  test("int8", () => {
    const int8Array = new Int8Array([1, 2, 3]);
    // @ts-ignore
    const actual = new pl.Series(int8Array).toArray();
    const expected = [...int8Array];
    expect(actual).toEqual(expected);
  });
  test("int8:list", () => {
    const int8Arrays = [
      new Int8Array([1, 2, 3]),
      new Int8Array([33, 44, 55]),
    ];
    const expected = int8Arrays.map(i => [...i]);
    // @ts-ignore
    const actual = new pl.Series(int8Arrays).toArray();
    expect(actual).toEqual(expected);
  });
  test("int16", () => {
    const int16Array = new Int16Array([1, 2, 3]);
    // @ts-ignore
    const actual = new pl.Series(int16Array).toArray();
    const expected = Array.from(int16Array);
    expect(actual).toEqual(expected);
  });
  test("int16:list", () => {
    const int16Arrays = [
      new Int16Array([1, 2, 3]),
      new Int16Array([33, 44, 55]),
    ];
    // @ts-ignore
    const actual = new pl.Series(int16Arrays).toArray();
    const expected = int16Arrays.map(i => [...i]);
    expect(actual).toEqual(expected);
  });
  test("int32", () => {
    const int32Array = new Int32Array([1, 2, 3]);
    // @ts-ignore
    const actual = new pl.Series(int32Array).toArray();
    expect(actual).toEqual([...int32Array]);
  });
  test("int32:list", () => {
    const int32Arrays = [
      new Int32Array([1, 2, 3]),
      new Int32Array([33, 44, 55]),
    ];
    // @ts-ignore
    const actual = new pl.Series(int32Arrays).toArray();
    const expected = int32Arrays.map(i => [...i]);
    expect(actual).toEqual(expected);
  });

  // serde downcasts int64 to 'number'
  test("int64", () => {
    const int64Array = new BigInt64Array([1n, 2n, 3n]);
    // @ts-ignore
    const actual = new pl.Series(int64Array).toArray();

    const expected = Array.from(int64Array).map((v: any) => parseInt(v));

    expect(actual).toEqual(expected);
  });
  // serde downcasts int64 to 'number'
  test("int64:list", () => {
    const int64Arrays = [
      new BigInt64Array([1n, 2n, 3n]),
      new BigInt64Array([33n, 44n, 55n]),
    ] as any;
    // @ts-ignore
    const actual = new pl.Series(int64Arrays).toArray();
    const expected = [
      [1, 2, 3],
      [33, 44, 55]
    ];
    expect(actual).toEqual(expected);
  });
  test("uint8", () => {
    const uint8Array = new Uint8Array([1, 2, 3]);
    // @ts-ignore
    const actual = new pl.Series(uint8Array).toArray();
    const expected = [...uint8Array];
    expect(actual).toEqual(expected);
  });
  test("uint8:list", () => {
    const uint8Arrays = [
      new Uint8Array([1, 2, 3]),
      new Uint8Array([33, 44, 55]),
    ];
    // @ts-ignore
    const actual = new pl.Series(uint8Arrays).toArray();
    const expected = uint8Arrays.map(i => [...i]);
    expect(actual).toEqual(expected);
  });
  test("uint16", () => {
    const uint16Array = new Uint16Array([1, 2, 3]);
    // @ts-ignore
    const actual = new pl.Series(uint16Array).toArray();
    const expected = [...uint16Array];
    expect(actual).toEqual(expected);
  });
  test("uint16:list", () => {
    const uint16Arrays = [
      new Uint16Array([1, 2, 3]),
      new Uint16Array([33, 44, 55]),
    ];
    // @ts-ignore
    const actual = new pl.Series(uint16Arrays).toArray();
    const expected = uint16Arrays.map(i => [...i]);
    expect(actual).toEqual(expected);
  });
  test("uint32", () => {
    const uint32Array = new Uint32Array([1, 2, 3]);
    // @ts-ignore
    const actual = new pl.Series(uint32Array).toArray();
    const expected = [...uint32Array];
    expect(actual).toEqual(expected);
  });
  test("uint32:list", () => {
    const uint32Arrays = [
      new Uint32Array([1, 2, 3]),
      new Uint32Array([33, 44, 55]),
    ];
    // @ts-ignore
    const actual = new pl.Series(uint32Arrays).toArray();
    const expected = uint32Arrays.map(i => [...i]);
    expect(actual).toEqual(expected);
  });
  test("uint64", () => {
    const uint64Array = new BigUint64Array([1n, 2n, 3n]);
    // @ts-ignore
    const actual = new pl.Series(uint64Array).toArray();
    const expected = [...uint64Array];
    expect(actual).toEqual(expected);
  });
  test("uint64:list", () => {
    const uint64Arrays = [
      new BigUint64Array([1n, 2n, 3n]),
      new BigUint64Array([33n, 44n, 55n]),
    ];
    // @ts-ignore
    const actual = new pl.Series(uint64Arrays).toArray();
    const expected = uint64Arrays.map(i => [...i]);
    expect(actual).toEqual(expected);
  });
  test("float32", () => {
    const float32Array = new Float32Array([1, 2, 3]);
    // @ts-ignore
    const actual = new pl.Series(float32Array).toArray();
    const expected = [...float32Array];
    expect(actual).toEqual(expected);
  });
  test("float32:list", () => {
    const float32Arrays = [
      new Float32Array([1, 2, 3]),
      new Float32Array([33, 44, 55]),
    ];
    // @ts-ignore
    const actual = new pl.Series(float32Arrays).toArray();
    const expected = float32Arrays.map(i => [...i]);
    expect(actual).toEqual(expected);
  });
  test("float64", () => {
    const float64Array = new Float64Array([1, 2, 3]);
    // @ts-ignore
    const actual = new pl.Series(float64Array).toArray();
    const expected = [...float64Array];
    expect(actual).toEqual(expected);
  });
  test("float64:list", () => {
    const float64Arrays = [
      new Float64Array([1, 2, 3]),
      new Float64Array([33, 44, 55]),
    ];
    // @ts-ignore
    const actual = new pl.Series(float64Arrays).toArray();
    const expected = float64Arrays.map(i => [...i]);
    expect(actual).toEqual(expected);
  });
  test("invalid:list", () => {
    const float64Arrays = [
      new Float64Array([33, 44, 55]),
      new BigUint64Array([1n, 2n, 3n]),
    ];
    // @ts-ignore
    const fn = () => new pl.Series(float64Arrays).toArray();
    expect(fn).toThrow();
  });
});
describe("series", () => {
  const chance = new Chance();

  describe("create series", () => {
    it.each`
      values
      ${[1, 1n]}
      ${["foo", 2]}
      ${[false, "false"]}
    `("does not allow multiple types", ({ values }) => {
      try {
        new pl.Series("", values);
      } catch (err) {
        expect((err as Error).message).toBeDefined();
      }
    });

    it.each`
      values                    | dtype         | type
      ${["foo", "bar", "baz"]}  | ${"Utf8"}     | ${"string"}
      ${[1, 2, 3]}              | ${"Float64"}  | ${"number"}
      ${[1n, 2n, 3n]}           | ${"UInt64"}   | ${"bigint"}
      ${[true, false]}          | ${"Bool"}     | ${"boolean"}
      ${[]}                     | ${"Float64"}  | ${"empty"}
      ${[new Date(Date.now())]} | ${"Datetime"} | ${"Date"}
    `("defaults to $dtype for \"$type\"", ({ values, dtype }) => {
      const name = chance.string();
      const s = new pl.Series(name, values);
      expect(s.name).toStrictEqual(name);
      expect(s.length).toStrictEqual(values.length);
      expect(s.dtype).toStrictEqual(dtype);
    });

    it.each`
      values                   | dtype
      ${["foo", "bar", "baz"]} | ${"Utf8"}
      ${[1, 2, 3]}             | ${"Float64"}
      ${[1n, 2n, 3n]}          | ${"UInt64"}
    `("defaults to $dtype for $input", ({ values, dtype }) => {
      const name = chance.string();
      const s = new pl.Series(name, values);
      expect(s.name).toStrictEqual(name);
      expect(s.length).toStrictEqual(values.length);
      expect(s.dtype).toStrictEqual(dtype);
    });

    it.each`
    values | type
    ${[1, 2, 3]} | ${"number"}
    ${["1", "2", "3"]} | ${"string"}
    ${[1n, 2n, 3n]} | ${"bigint"}
    ${[true, false, null]} | ${"Option<bool>"}
    ${[1, 2, null]} | ${"Option<number>"}
    ${[1n, 2n, null]} |  ${"Option<bigint>"}
    ${[1.11, 2.22, 3.33, null]} |  ${"Option<float>"}
    ${new Int8Array([9, 10, 11])} | ${"Int8Array"}
    ${new Int16Array([12321, 2456, 22])} | ${"Int16Array"}
    ${new Int32Array([515121, 32411322, 32423])} | ${"Int32Array"}
    ${new Uint8Array([1, 2, 3, 4, 5, 6, 11])} | ${"Uint8Array"}
    ${new Uint16Array([1, 2, 3, 55, 11])} | ${"Uint16Array"}
    ${new Uint32Array([1123, 2, 3000, 12801, 99, 43242])} | ${"Uint32Array"}
    ${new BigInt64Array([1123n, 2n, 3000n, 12801n, 99n, 43242n])} | ${"BigInt64Array"}
    ${new BigUint64Array([1123n, 2n, 3000n, 12801n, 99n, 43242n])} | ${"BigUint64Array"}
    `("can be created from $type", ({ values }) => {
      const name = chance.string();
      const s = new pl.Series(name, values);
      expect([...s]).toEqual([...values]);
    });
  });

  describe("math", () => {

    it("can add", () => {
      const item = chance.natural({ max: 100 });
      const other = chance.natural({ max: 100 });
      let s = new pl.Series("", [item]);
      s = s.add(other);
      expect(s[0]).toStrictEqual(item + other);
    });

    it("can subtract", () => {
      const item = chance.natural({ max: 100 });
      const other = chance.natural({ max: 100 });

      let s = new pl.Series("", [item]);
      s = s.sub(other);
      expect(s[0]).toStrictEqual(item - other);
    });

    it("can multiply", () => {
      const item = chance.natural({ max: 100 });
      const other = chance.natural({ max: 100 });

      let s = new pl.Series("", [item]);
      s = s.mul(other);
      expect(s[0]).toStrictEqual(item * other);
    });

    it("can divide", () => {
      const item = chance.natural({ max: 100 });
      const other = chance.natural({ max: 100 });

      let s = new pl.Series("", [item]);
      s = s.div(other);
      expect(s[0]).toStrictEqual(item / other);
    });

    it("can add two series", () => {
      const item = chance.natural({ max: 100 });
      const other = chance.natural({ max: 100 });
      let s = new pl.Series("", [item]);
      s = s.add(new pl.Series("", [other]));
      expect(s[0]).toStrictEqual(item + other);
    });

    it("can subtract two series", () => {
      const item = chance.natural({ max: 100 });
      const other = chance.natural({ max: 100 });

      let s = new pl.Series("", [item]);
      s = s.sub(new pl.Series("", [other]));
      expect(s[0]).toStrictEqual(item - other);
    });

    it("can multiply two series", () => {
      const item = chance.natural({ max: 100 });
      const other = chance.natural({ max: 100 });

      let s = new pl.Series("", [item]);
      s = s.mul(new pl.Series("", [other]));
      expect(s[0]).toStrictEqual(item * other);
    });

    it("can divide two series", () => {
      const item = chance.natural({ max: 100 });
      const other = chance.natural({ max: 100 });

      let s = new pl.Series("", [item]);
      s = s.div(new pl.Series("", [other]));
      expect(s[0]).toStrictEqual(item / other);
    });
  });

  describe("comparator", () => {
    it("can perform 'eq", () => {
      // @ts-ignore
      const s = new pl.Series("", [1, 2, 3]).eq(new pl.Series([1]));
      expect([...s]).toEqual([true, false, false]);
    });
  });
});
describe("series", () => {
  const numSeries = () => new pl.Series("foo", [1, 2, 3], pl.Int32);
  const fltSeries = () => new pl.Series("float", [1, 2, 3], pl.Float64);
  const boolSeries = () => new pl.Series("bool", [true, false, false]);
  const other = () => new pl.Series("bar", [3, 4, 5], pl.Int32);

  const chance = new Chance();

  it.each`
  series        | getter
  ${numSeries()}  | ${"dtype"}
  ${numSeries()}  | ${"name"}
  ${numSeries()}  | ${"length"}
  `("$# $getter does not error", ({ series, getter }) => {
    try {
      series[getter];
    } catch (err) {
      expect(err).not.toBeDefined();
    }
  });
  it.each`
  series          | method              | args
  ${numSeries()}  | ${"abs"}          | ${[]}
  ${numSeries()}  | ${"as"}           | ${[chance.string()]}
  ${numSeries()}  | ${"alias"}        | ${[chance.string()]}
  ${numSeries()}  | ${"append"}       | ${[other()]}
  ${numSeries()}  | ${"argMax"}       | ${[]}
  ${numSeries()}  | ${"argMin"}       | ${[]}
  ${numSeries()}  | ${"argSort"}      | ${[]}
  ${boolSeries()} | ${"argTrue"}      | ${[]}
  ${numSeries()}  | ${"argUnique"}    | ${[]}
  ${numSeries()}  | ${"cast"}         | ${[pl.UInt32]}
  ${numSeries()}  | ${"chunkLengths"} | ${[]}
  ${numSeries()}  | ${"clone"}        | ${[]}
  ${numSeries()}  | ${"cumMax"}       | ${[]}
  ${numSeries()}  | ${"cumMin"}       | ${[]}
  ${numSeries()}  | ${"cumProd"}      | ${[]}
  ${numSeries()}  | ${"cumSum"}       | ${[]}
  ${numSeries()}  | ${"describe"}     | ${[]}
  ${numSeries()}  | ${"diff"}         | ${[]}
  ${numSeries()}  | ${"diff"}         | ${[{ n: 1, nullBehavior: "drop" }]}
  ${numSeries()}  | ${"diff"}         | ${[{ nullBehavior: "drop" }]}
  ${numSeries()}  | ${"diff"}         | ${[1, "drop"]}
  ${numSeries()}  | ${"dot"}          | ${[other()]}
  ${numSeries()}  | ${"dropNulls"}    | ${[]}
  ${numSeries()}  | ${"fillNull"}     | ${["zero"]}
  ${numSeries()}  | ${"fillNull"}     | ${[{ strategy: "zero" }]}
  ${numSeries()}  | ${"filter"}       | ${[boolSeries()]}
  ${fltSeries()}  | ${"floor"}        | ${[]}
  ${numSeries()}  | ${"hasValidity"}  | ${[]}
  ${numSeries()}  | ${"hash"}         | ${[]}
  ${numSeries()}  | ${"hash"}         | ${[{ k0: 10 }]}
  ${numSeries()}  | ${"hash"}         | ${[{ k0: 10, k1: 29 }]}
  ${numSeries()}  | ${"hash"}         | ${[{ k0: 10, k1: 29, k2: 3 }]}
  ${numSeries()}  | ${"hash"}         | ${[{ k0: 10, k1: 29, k3: 1, k2: 3 }]}
  ${numSeries()}  | ${"hash"}         | ${[1]}
  ${numSeries()}  | ${"hash"}         | ${[1, 2]}
  ${numSeries()}  | ${"hash"}         | ${[1, 2, 3]}
  ${numSeries()}  | ${"hash"}         | ${[1, 2, 3, 4]}
  ${numSeries()}  | ${"head"}         | ${[]}
  ${numSeries()}  | ${"head"}         | ${[1]}
  ${numSeries()}  | ${"inner"}        | ${[]}
  ${numSeries()}  | ${"interpolate"}  | ${[]}
  ${numSeries()}  | ${"isBoolean"}    | ${[]}
  ${numSeries()}  | ${"isDateTime"}   | ${[]}
  ${numSeries()}  | ${"isDuplicated"} | ${[]}
  ${fltSeries()}  | ${"isFinite"}     | ${[]}
  ${numSeries()}  | ${"isFirst"}      | ${[]}
  ${numSeries()}  | ${"isFloat"}      | ${[]}
  ${numSeries()}  | ${"isIn"}         | ${[other()]}
  ${numSeries()}  | ${"isIn"}         | ${[[1, 2, 3]]}
  ${fltSeries()}  | ${"isInfinite"}   | ${[]}
  ${numSeries()}  | ${"isNotNull"}    | ${[]}
  ${numSeries()}  | ${"isNull"}       | ${[]}
  ${numSeries()}  | ${"isNumeric"}    | ${[]}
  ${numSeries()}  | ${"isUnique"}     | ${[]}
  ${numSeries()}  | ${"isUtf8"}       | ${[]}
  ${numSeries()}  | ${"kurtosis"}     | ${[]}
  ${numSeries()}  | ${"kurtosis"}     | ${[{ fisher: true, bias: true }]}
  ${numSeries()}  | ${"kurtosis"}     | ${[{ bias: false }]}
  ${numSeries()}  | ${"kurtosis"}     | ${[{ fisher: false }]}
  ${numSeries()}  | ${"kurtosis"}     | ${[false, false]}
  ${numSeries()}  | ${"kurtosis"}     | ${[false]}
  ${numSeries()}  | ${"len"}          | ${[]}
  ${numSeries()}  | ${"limit"}        | ${[]}
  ${numSeries()}  | ${"limit"}        | ${[2]}
  ${numSeries()}  | ${"max"}          | ${[]}
  ${numSeries()}  | ${"mean"}         | ${[]}
  ${numSeries()}  | ${"median"}       | ${[]}
  ${numSeries()}  | ${"min"}          | ${[]}
  ${numSeries()}  | ${"mode"}         | ${[]}
  ${numSeries()}  | ${"nChunks"}      | ${[]}
  ${numSeries()}  | ${"nUnique"}      | ${[]}
  ${numSeries()}  | ${"nullCount"}    | ${[]}
  ${numSeries()}  | ${"peakMax"}      | ${[]}
  ${numSeries()}  | ${"peakMin"}      | ${[]}
  ${numSeries()}  | ${"quantile"}     | ${[0.4]}
  ${numSeries()}  | ${"rank"}         | ${[]}
  ${numSeries()}  | ${"rank"}         | ${["average"]}
  ${numSeries()}  | ${"rechunk"}      | ${[]}
  ${numSeries()}  | ${"rechunk"}      | ${[true]}
  ${numSeries()}  | ${"rechunk"}      | ${[{ inPlace: true }]}
  ${numSeries()}  | ${"rename"}       | ${["new name"]}
  ${numSeries()}  | ${"rename"}       | ${["new name", true]}
  ${numSeries()}  | ${"rename"}       | ${[{ name: "new name" }]}
  ${numSeries()}  | ${"rename"}       | ${[{ name: "new name", inPlace: true }]}
  ${numSeries()}  | ${"rename"}       | ${[{ name: "new name" }]}
  ${numSeries()}  | ${"rollingMax"}   | ${[{ windowSize: 1 }]}
  ${numSeries()}  | ${"rollingMax"}   | ${[{ windowSize: 1, weights: [.33] }]}
  ${numSeries()}  | ${"rollingMax"}   | ${[{ windowSize: 1, weights: [.11], minPeriods: 1 }]}
  ${numSeries()}  | ${"rollingMax"}   | ${[{ windowSize: 1, weights: [.44], minPeriods: 1, center: false }]}
  ${numSeries()}  | ${"rollingMax"}   | ${[1]}
  ${numSeries()}  | ${"rollingMax"}   | ${[1, [.11]]}
  ${numSeries()}  | ${"rollingMax"}   | ${[1, [.11], 1]}
  ${numSeries()}  | ${"rollingMax"}   | ${[1, [.23], 1, true]}
  ${numSeries()}  | ${"rollingMean"}  | ${[{ windowSize: 1 }]}
  ${numSeries()}  | ${"rollingMean"}  | ${[{ windowSize: 1, weights: [.33] }]}
  ${numSeries()}  | ${"rollingMean"}  | ${[{ windowSize: 1, weights: [.11], minPeriods: 1 }]}
  ${numSeries()}  | ${"rollingMean"}  | ${[{ windowSize: 1, weights: [.44], minPeriods: 1, center: false }]}
  ${numSeries()}  | ${"rollingMean"}  | ${[1]}
  ${numSeries()}  | ${"rollingMean"}  | ${[1, [.11]]}
  ${numSeries()}  | ${"rollingMean"}  | ${[1, [.11], 1]}
  ${numSeries()}  | ${"rollingMean"}  | ${[1, [.23], 1, true]}
  ${numSeries()}  | ${"rollingMin"}   | ${[{ windowSize: 1 }]}
  ${numSeries()}  | ${"rollingMin"}   | ${[{ windowSize: 1, weights: [.33] }]}
  ${numSeries()}  | ${"rollingMin"}   | ${[{ windowSize: 1, weights: [.11], minPeriods: 1 }]}
  ${numSeries()}  | ${"rollingMin"}   | ${[{ windowSize: 1, weights: [.44], minPeriods: 1, center: false }]}
  ${numSeries()}  | ${"rollingMin"}   | ${[1]}
  ${numSeries()}  | ${"rollingMin"}   | ${[1, [.11]]}
  ${numSeries()}  | ${"rollingMin"}   | ${[1, [.11], 1]}
  ${numSeries()}  | ${"rollingMin"}   | ${[1, [.23], 1, true]}
  ${numSeries()}  | ${"rollingSum"}   | ${[{ windowSize: 1 }]}
  ${numSeries()}  | ${"rollingSum"}   | ${[{ windowSize: 1, weights: [.33] }]}
  ${numSeries()}  | ${"rollingSum"}   | ${[{ windowSize: 1, weights: [.11], minPeriods: 1 }]}
  ${numSeries()}  | ${"rollingSum"}   | ${[{ windowSize: 1, weights: [.44], minPeriods: 1, center: false }]}
  ${numSeries()}  | ${"rollingSum"}   | ${[1]}
  ${numSeries()}  | ${"rollingSum"}   | ${[1, [.11]]}
  ${numSeries()}  | ${"rollingSum"}   | ${[1, [.11], 1]}
  ${numSeries()}  | ${"rollingSum"}   | ${[1, [.23], 1, true]}
  ${numSeries()}  | ${"rollingVar"}   | ${[{ windowSize: 1 }]}
  ${numSeries()}  | ${"rollingVar"}   | ${[{ windowSize: 1, weights: [.33] }]}
  ${numSeries()}  | ${"rollingVar"}   | ${[{ windowSize: 1, weights: [.11], minPeriods: 1 }]}
  ${numSeries()}  | ${"rollingVar"}   | ${[{ windowSize: 1, weights: [.44], minPeriods: 1, center: false }]}
  ${numSeries()}  | ${"rollingVar"}   | ${[1]}
  ${numSeries()}  | ${"rollingVar"}   | ${[1, [.11]]}
  ${numSeries()}  | ${"rollingVar"}   | ${[1, [.11], 1]}
  ${numSeries()}  | ${"rollingVar"}   | ${[1, [.23], 1, true]}
  ${fltSeries()}  | ${"round"}        | ${[1]}
  ${numSeries()}  | ${"sample"}       | ${[1, null, true]}
  ${numSeries()}  | ${"sample"}       | ${[null, 1]}
  ${numSeries()}  | ${"sample"}       | ${[{ n: 1 }]}
  ${numSeries()}  | ${"sample"}       | ${[{ frac: 0.5 }]}
  ${numSeries()}  | ${"sample"}       | ${[{ n: 1, withReplacement: true }]}
  ${numSeries()}  | ${"sample"}       | ${[{ frac: 0.1, withReplacement: true }]}
  ${numSeries()}  | ${"seriesEqual"}  | ${[other()]}
  ${numSeries()}  | ${"seriesEqual"}  | ${[other(), true]}
  ${numSeries()}  | ${"seriesEqual"}  | ${[other(), false]}
  ${numSeries()}  | ${"seriesEqual"}  | ${[other(), { nullEqual: true }]}
  ${numSeries()}  | ${"seriesEqual"}  | ${[other(), { nullEqual: false }]}
  ${numSeries()}  | ${"set"}          | ${[boolSeries(), 2]}
  ${numSeries()}  | ${"setAtIdx"}     | ${[[0, 1], 1]}
  ${numSeries()}  | ${"shift"}        | ${[]}
  ${numSeries()}  | ${"shift"}        | ${[1]}
  ${numSeries()}  | ${"shift"}        | ${[{ periods: 1 }]}
  ${numSeries()}  | ${"shiftAndFill"} | ${[1, 2]}
  ${numSeries()}  | ${"shiftAndFill"} | ${[{ periods: 1, fillValue: 2 }]}
  ${numSeries()}  | ${"skew"}         | ${[]}
  ${numSeries()}  | ${"skew"}         | ${[true]}
  ${numSeries()}  | ${"skew"}         | ${[false]}
  ${numSeries()}  | ${"skew"}         | ${[{ bias: true }]}
  ${numSeries()}  | ${"skew"}         | ${[{ bias: false }]}
  ${numSeries()}  | ${"slice"}        | ${[1, 2]}
  ${numSeries()}  | ${"slice"}        | ${[{ offset: 1, length: 2 }]}
  ${numSeries()}  | ${"sort"}         | ${[]}
  ${numSeries()}  | ${"sort"}         | ${[false]}
  ${numSeries()}  | ${"sort"}         | ${[true]}
  ${numSeries()}  | ${"sort"}         | ${[{ reverse: true }]}
  ${numSeries()}  | ${"sort"}         | ${[{ reverse: false }]}
  ${numSeries()}  | ${"sum"}          | ${[]}
  ${numSeries()}  | ${"tail"}         | ${[]}
  ${numSeries()}  | ${"take"}         | ${[[1, 2]]}
  ${numSeries()}  | ${"takeEvery"}    | ${[1]}
  ${numSeries()}  | ${"toArray"}      | ${[]}
  ${numSeries()}  | ${"unique"}       | ${[]}
  ${numSeries()}  | ${"valueCounts"}  | ${[]}
  ${numSeries()}  | ${"zipWith"}      | ${[boolSeries(), other()]}
  `("$# $method is callable", ({ series, method, args }) => {
    try {
      series[method](...args);
    } catch (err) {
      expect(err).not.toBeDefined();
    }
  });

  it.each`
  name               | actual                                               |  expected
  ${"dtype:Utf8"}    | ${new pl.Series(["foo"]).dtype}                          | ${"Utf8"}
  ${"dtype:UInt64"}  | ${new pl.Series([1n]).dtype}                             | ${"UInt64"}
  ${"dtype:Float64"} | ${new pl.Series([1]).dtype}                              | ${"Float64"}
  ${"dtype"}         | ${new pl.Series(["foo"]).dtype}                          | ${"Utf8"}
  ${"name"}          | ${new pl.Series("a", ["foo"]).name}                      | ${"a"}
  ${"length"}        | ${new pl.Series([1, 2, 3, 4]).length}                    | ${4}
  ${"abs"}           | ${new pl.Series([1, 2, -3]).abs()}                       | ${new pl.Series([1, 2, 3])}
  ${"alias"}         | ${new pl.Series([1, 2, 3]).as("foo")}                    | ${new pl.Series("foo", [1, 2, 3])}
  ${"alias"}         | ${new pl.Series([1, 2, 3]).alias("foo")}                 | ${new pl.Series("foo", [1, 2, 3])}
  ${"argMax"}        | ${new pl.Series([1, 2, 3]).argMax()}                     | ${2}
  ${"argMin"}        | ${new pl.Series([1, 2, 3]).argMin()}                     | ${0}
  ${"argSort"}       | ${new pl.Series([3, 2, 1]).argSort()}                    | ${new pl.Series([2, 1, 0])}
  ${"argTrue"}       | ${new pl.Series([true, false]).argTrue()}                | ${new pl.Series([0])}
  ${"argUnique"}     | ${new pl.Series([1, 1, 2]).argUnique()}                  | ${new pl.Series([0, 2])}
  ${"cast-Int16"}    | ${new pl.Series("", [1, 1, 2]).cast(pl.Int16)}           | ${new pl.Series("", [1, 1, 2], pl.Int16)}
  ${"cast-Int32"}    | ${new pl.Series("", [1, 1, 2]).cast(pl.Int32)}           | ${new pl.Series("", [1, 1, 2], pl.Int32)}
  ${"cast-Int64"}    | ${new pl.Series("", [1, 1, 2]).cast(pl.Int64)}           | ${new pl.Series("", [1, 1, 2], pl.Int64)}
  ${"cast-UInt16"}   | ${new pl.Series("", [1, 1, 2]).cast(pl.UInt16)}          | ${new pl.Series("", [1, 1, 2], pl.UInt16)}
  ${"cast-UInt32"}   | ${new pl.Series("", [1, 1, 2]).cast(pl.UInt32)}          | ${new pl.Series("", [1, 1, 2], pl.UInt32)}
  ${"cast-UInt64"}   | ${new pl.Series("", [1, 1, 2]).cast(pl.UInt64)}          | ${new pl.Series("", [1n, 1n, 2n])}
  ${"cast-Utf8"}     | ${new pl.Series("", [1, 1, 2]).cast(pl.Utf8)}            | ${new pl.Series("", ["1.0", "1.0", "2.0"])}
  ${"chunkLengths"}  | ${new pl.Series([1, 2, 3]).chunkLengths()[0]}            | ${3}
  ${"clone"}         | ${new pl.Series([1, 2, 3]).clone()}                      | ${new pl.Series([1, 2, 3])}
  ${"concat"}        | ${new pl.Series([1]).concat(new pl.Series([2, 3]))}          | ${new pl.Series([1, 2, 3])}
  ${"cumMax"}        | ${new pl.Series([3, 2, 4]).cumMax()}                     | ${new pl.Series([3, 3, 4])}
  ${"cumMin"}        | ${new pl.Series([3, 2, 4]).cumMin()}                     | ${new pl.Series([3, 2, 2])}
  ${"cumProd"}       | ${new pl.Series("", [1, 2, 3], pl.Int32).cumProd()}      | ${new pl.Series("", [1, 2, 6], pl.Int64)}
  ${"cumSum"}        | ${new pl.Series("", [1, 2, 3], pl.Int32).cumSum()}       | ${new pl.Series("", [1, 3, 6], pl.Int32)}
  ${"diff"}          | ${new pl.Series([1, 2, 12]).diff(1, "drop").toObject()}  | ${new pl.Series([1, 10]).toObject()}
  ${"diff"}          | ${new pl.Series([1, 11]).diff(1, "ignore")}              | ${new pl.Series("", [null, 10], pl.Float64, false)}
  ${"dropNulls"}     | ${new pl.Series([1, null, 2]).dropNulls()}               | ${new pl.Series([1, 2])}
  ${"dropNulls"}     | ${new pl.Series([1, undefined, 2]).dropNulls()}          | ${new pl.Series([1, 2])}
  ${"dropNulls"}     | ${new pl.Series(["a", null, "f"]).dropNulls()}           | ${new pl.Series(["a", "f"])}
  ${"fillNull:zero"} | ${new pl.Series([1, null, 2]).fillNull("zero")}          | ${new pl.Series([1, 0, 2])}
  ${"fillNull:one"}  | ${new pl.Series([1, null, 2]).fillNull("one")}           | ${new pl.Series([1, 1, 2])}
  ${"fillNull:max"}  | ${new pl.Series([1, null, 5]).fillNull("max")}           | ${new pl.Series([1, 5, 5])}
  ${"fillNull:min"}  | ${new pl.Series([1, null, 5]).fillNull("min")}           | ${new pl.Series([1, 1, 5])}
  ${"fillNull:mean"} | ${new pl.Series([1, 1, null, 10]).fillNull("mean")}      | ${new pl.Series([1, 1, 4, 10])}
  ${"fillNull:back"} | ${new pl.Series([1, 1, null, 10]).fillNull("backward")}  | ${new pl.Series([1, 1, 10, 10])}
  ${"fillNull:fwd"}  | ${new pl.Series([1, 1, null, 10]).fillNull("forward")}   | ${new pl.Series([1, 1, 1, 10])}
  ${"floor"}         | ${new pl.Series([1.1, 2.2]).floor()}                     | ${new pl.Series([1, 2])}
  ${"get"}           | ${new pl.Series(["foo"]).get(0)}                         | ${"foo"}
  ${"get"}           | ${new pl.Series([1, 2, 3]).get(2)}                       | ${3}
  ${"getIndex"}      | ${new pl.Series(["a", "b", "c"]).getIndex(0)}            | ${"a"}
  ${"hasValidity"}   | ${new pl.Series([1, null, 2]).hasValidity()}             | ${true}
  ${"hasValidity"}   | ${new pl.Series([1, 1, 2]).hasValidity()}                | ${false}
  ${"hash"}          | ${new pl.Series([1]).hash()}                             | ${new pl.Series([6340063056640878722n])}
  ${"head"}          | ${new pl.Series([1, 2, 3, 4, 5, 5, 5]).head()}           | ${new pl.Series([1, 2, 3, 4, 5])}
  ${"head"}          | ${new pl.Series([1, 2, 3, 4, 5, 5, 5]).head(2)}          | ${new pl.Series([1, 2])}
  ${"interpolate"}   | ${new pl.Series([1, 2, null, null, 5]).interpolate()}    | ${new pl.Series([1, 2, 3, 4, 5])}
  ${"isBoolean"}     | ${new pl.Series([1, 2, 3]).isBoolean()}                  | ${false}
  ${"isBoolean"}     | ${new pl.Series([true, false]).isBoolean()}              | ${true}
  ${"isDateTime"}    | ${new pl.Series([new Date(Date.now())]).isDateTime()}    | ${true}
  ${"isDuplicated"}  | ${new pl.Series([1, 3, 3]).isDuplicated()}               | ${new pl.Series([false, true, true])}
  ${"isFinite"}      | ${new pl.Series([1.0, 3.1]).isFinite()}                  | ${new pl.Series([true, true])}
  ${"isInfinite"}    | ${new pl.Series([1.0, 2]).isInfinite()}                  | ${new pl.Series([false, false])}
  ${"isNotNull"}     | ${new pl.Series([1, null, undefined, 2]).isNotNull()}    | ${new pl.Series([true, false, false, true])}
  ${"isNull"}        | ${new pl.Series([1, null, undefined, 2]).isNull()}       | ${new pl.Series([false, true, true, false])}
  ${"isNumeric"}     | ${new pl.Series([1, 2, 3]).isNumeric()}                  | ${true}
  ${"isUnique"}      | ${new pl.Series([1, 2, 3, 1]).isUnique()}                | ${new pl.Series([false, true, true, false])}
  ${"isUtf8"}        | ${new pl.Series([1, 2, 3, 1]).isUtf8()}                  | ${false}
  ${"kurtosis"}      | ${new pl.Series([1, 2, 3, 3, 4]).kurtosis()?.toFixed(6)} | ${"-1.044379"}
  ${"isUtf8"}        | ${new pl.Series(["foo"]).isUtf8()}                       | ${true}
  ${"len"}           | ${new pl.Series([1, 2, 3, 4, 5]).len()}                  | ${5}
  ${"limit"}         | ${new pl.Series([1, 2, 3, 4, 5, 5, 5]).limit(2)}         | ${new pl.Series([1, 2])}
  ${"max"}           | ${new pl.Series([-1, 10, 3]).max()}                      | ${10}
  ${"mean"}          | ${new pl.Series([1, 1, 10]).mean()}                      | ${4}
  ${"median"}        | ${new pl.Series([1, 1, 10]).median()}                    | ${1}
  ${"min"}           | ${new pl.Series([-1, 10, 3]).min()}                      | ${-1}
  ${"nChunks"}       | ${new pl.Series([1, 2, 3, 4, 4]).nChunks()}              | ${1}
  ${"nullCount"}     | ${new pl.Series([1, null, null, 4, 4]).nullCount()}      | ${2}
  ${"peakMax"}       | ${new pl.Series([9, 4, 5]).peakMax()}                    | ${new pl.Series([true, false, true])}
  ${"peakMin"}       | ${new pl.Series([4, 1, 3, 2, 5]).peakMin()}              | ${new pl.Series([false, true, false, true, false])}
  ${"quantile"}      | ${new pl.Series([1, 2, 3]).quantile(0.5)}                | ${2}
  ${"rank"}          | ${new pl.Series([1, 2, 3, 2, 2, 3, 0]).rank("dense")}    | ${new pl.Series("", [2, 3, 4, 3, 3, 4, 1], pl.UInt32)}
  ${"rename"}        | ${new pl.Series([1, 3, 0]).rename("b")}                  | ${new pl.Series("b", [1, 3, 0])}
  ${"rename"}        | ${new pl.Series([1, 3, 0]).rename({ name: "b" })}          | ${new pl.Series("b", [1, 3, 0])}
  ${"rollingMax"}    | ${new pl.Series([1, 2, 3, 2, 1]).rollingMax(2)}          | ${new pl.Series("", [null, 2, 3, 3, 2], pl.Float64)}
  ${"rollingMin"}    | ${new pl.Series([1, 2, 3, 2, 1]).rollingMin(2)}          | ${new pl.Series("", [null, 1, 2, 2, 1], pl.Float64)}
  ${"rollingSum"}    | ${new pl.Series([1, 2, 3, 2, 1]).rollingSum(2)}          | ${new pl.Series("", [null, 3, 5, 5, 3], pl.Float64)}
  ${"rollingMean"}   | ${new pl.Series([1, 2, 3, 2, 1]).rollingMean(2)}         | ${new pl.Series("", [null, 1.5, 2.5, 2.5, 1.5], pl.Float64)}
  ${"rollingVar"}    | ${new pl.Series([1, 2, 3, 2, 1]).rollingVar(2)[1]}       | ${0.5}
  ${"sample:n"}      | ${new pl.Series([1, 2, 3, 4, 5]).sample(2).len()}        | ${2}
  ${"sample:frac"}   | ${new pl.Series([1, 2, 3, 4, 5]).sample({ frac: .4 }).len()}| ${2}
  ${"shift"}         | ${new pl.Series([1, 2, 3]).shift(1)}                     | ${new pl.Series([null, 1, 2])}
  ${"shift"}         | ${new pl.Series([1, 2, 3]).shift(-1)}                    | ${new pl.Series([2, 3, null])}
  ${"skew"}          | ${new pl.Series([1, 2, 3, 3, 0]).skew()?.toPrecision(6)} | ${"-0.363173"}
  ${"slice"}         | ${new pl.Series([1, 2, 3, 3, 0]).slice(-3, 3)}           | ${new pl.Series([3, 3, 0])}
  ${"slice"}         | ${new pl.Series([1, 2, 3, 3, 0]).slice(1, 3)}            | ${new pl.Series([2, 3, 3])}
  ${"sort"}          | ${new pl.Series([4, 2, 5, 1, 2, 3, 3, 0]).sort()}        | ${new pl.Series([0, 1, 2, 2, 3, 3, 4, 5])}
  ${"sort"}          | ${new pl.Series([4, 2, 5, 0]).sort({ reverse: true })}      | ${new pl.Series([5, 4, 2, 0])}
  ${"sort"}          | ${new pl.Series([4, 2, 5, 0]).sort({ reverse: false })}     | ${new pl.Series([0, 2, 4, 5])}
  ${"sum"}           | ${new pl.Series([1, 2, 2, 1]).sum()}                     | ${6}
  ${"tail"}          | ${new pl.Series([1, 2, 2, 1]).tail(2)}                   | ${new pl.Series([2, 1])}
  ${"takeEvery"}     | ${new pl.Series([1, 3, 2, 9, 1]).takeEvery(2)}           | ${new pl.Series([1, 2, 1])}
  ${"take"}          | ${new pl.Series([1, 3, 2, 9, 1]).take([0, 1, 3])}        | ${new pl.Series([1, 3, 9])}
  ${"toArray"}       | ${new pl.Series([1, 2, 3]).toArray()}                    | ${[1, 2, 3]}
  ${"unique"}        | ${new pl.Series([1, 2, 3, 3]).unique().sort()}           | ${new pl.Series([1, 2, 3])}
  ${"toFrame"}       | ${new pl.Series("foo", [1, 2, 3]).toFrame().toJSON()}    | ${pl.DataFrame([new pl.Series("foo", [1, 2, 3])]).toJSON()}
  ${"shiftAndFill"}  | ${new pl.Series("foo", [1, 2, 3]).shiftAndFill(1, 99)}   | ${new pl.Series("foo", [99, 1, 2])}
  `("$# $name: expected matches actual ", ({ expected, actual }) => {
    if (pl.Series.isSeries(expected) && pl.Series.isSeries(actual)) {
      expect(actual).toSeriesEqual(expected);
    } else {
      expect(actual).toEqual(expected);
    }
  });
  it("set: expected matches actual", () => {
    const expected = new pl.Series([99, 2, 3]);
    const mask = new pl.Series([true, false, false]);
    const actual = new pl.Series([1, 2, 3]).set(mask, 99);
    expect(actual).toSeriesEqual(expected);
  });
  it("set: throws error", () => {
    const mask = new pl.Series([true]);
    expect(() => new pl.Series([1, 2, 3]).set(mask, 99)).toThrow();
  });
  it("setAtIdx:array expected matches actual", () => {
    const expected = new pl.Series([99, 2, 99]);
    const actual = new pl.Series([1, 2, 3]).setAtIdx([0, 2], 99);
    expect(actual).toSeriesEqual(expected);
  });
  it("setAtIdx:series expected matches actual", () => {
    const expected = new pl.Series([99, 2, 99]);
    const indices = new pl.Series([0, 2]);
    const actual = new pl.Series([1, 2, 3])
      .setAtIdx(indices, 99);
    expect(actual).toSeriesEqual(expected);
  });
  it("setAtIdx: throws error", () => {
    const mask = new pl.Series([true]);
    expect(() => new pl.Series([1, 2, 3]).set(mask, 99)).toThrow();
  });
  it.each`
  name | fn | errorType
  ${"isFinite"} | ${new pl.Series(["foo"]).isFinite} | ${InvalidOperationError}
  ${"isInfinite"} | ${new pl.Series(["foo"]).isInfinite} | ${InvalidOperationError}
  ${"rollingMax"} | ${() => new pl.Series(["foo"]).rollingMax(null as any)} | ${Error}
  ${"sample"} | ${() => new pl.Series(["foo"]).sample(null as any)} | ${Error}
  `("$# $name throws an error ", ({ fn, errorType }) => {
    expect(fn).toThrow(errorType);
  });
  test("reinterpret", () => {
    const s = new pl.Series("reinterpret", [1, 2], pl.Int64);
    const unsignedExpected = new pl.Series("reinterpret", [1n, 2n], pl.UInt64);
    const signedExpected = new pl.Series("reinterpret", [1, 2], pl.Int64);
    const unsigned = s.reinterpret(false);
    const signed = unsigned.reinterpret(true);

    expect(unsigned).toSeriesStrictEqual(unsignedExpected);
    expect(signed).toSeriesStrictEqual(signedExpected);
  });
  test("reinterpret:invalid", () => {
    const s = new pl.Series("reinterpret", [1, 2]);
    const fn = () => s.reinterpret();
    expect(fn).toThrow();
  });
  test("extend", () => {
    const s = new pl.Series("extended", [1], pl.UInt16);
    const expected = new pl.Series("extended", [1, null, null], pl.UInt16);
    const actual = s.extend(null, 2);
    expect(actual).toSeriesStrictEqual(expected);
  });
  test("round invalid", () => {
    const s = new pl.Series([true, false]);
    const fn = () => s.round(2);
    expect(fn).toThrow();
  });
  test("round:positional", () => {
    const s = new pl.Series([1.1111, 2.2222]);
    const expected = new pl.Series([1.11, 2.22]);
    const actual = s.round(2);
    expect(actual).toSeriesEqual(expected);
  });
  test("round:named", () => {
    const s = new pl.Series([1.1111, 2.2222]);
    const expected = new pl.Series([1.11, 2.22]);
    const actual = s.round({ decimals: 2 });
    expect(actual).toSeriesEqual(expected);
  });
});
describe("comparators & math", () => {
  test("add/plus", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([2, 3]);
    expect(s.add(1)).toSeriesEqual(expected);
    expect(s.plus(1)).toSeriesEqual(expected);
  });
  test("sub/minus", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([0, 1]);
    expect(s.sub(1)).toSeriesEqual(expected);
    expect(s.minus(1)).toSeriesEqual(expected);
  });
  test("mul/multiplyBy", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([10, 20]);
    expect(s.mul(10)).toSeriesEqual(expected);
    expect(s.multiplyBy(10)).toSeriesEqual(expected);
  });
  test("div/divideBy", () => {
    const s = new pl.Series([2, 4]);
    const expected = new pl.Series([1, 2]);
    expect(s.div(2)).toSeriesEqual(expected);
    expect(s.divideBy(2)).toSeriesEqual(expected);
  });
  test("div/divideBy", () => {
    const s = new pl.Series([2, 4]);
    const expected = new pl.Series([1, 2]);
    expect(s.div(2)).toSeriesEqual(expected);
    expect(s.divideBy(2)).toSeriesEqual(expected);
  });
  test("rem/modulo", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([1, 0]);
    expect(s.rem(2)).toSeriesEqual(expected);
    expect(s.modulo(2)).toSeriesEqual(expected);
  });
  test("eq/equals", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([true, false]);
    expect(s.eq(1)).toSeriesEqual(expected);
    expect(s.equals(1)).toSeriesEqual(expected);
  });
  test("neq/notEquals", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([false, true]);
    expect(s.neq(1)).toSeriesEqual(expected);
    expect(s.notEquals(1)).toSeriesEqual(expected);
  });
  test("gt/greaterThan", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([false, true]);
    expect(s.gt(1)).toSeriesEqual(expected);
    expect(s.greaterThan(1)).toSeriesEqual(expected);
  });
  test("gtEq/equals", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([true, true]);
    expect(s.gtEq(1)).toSeriesEqual(expected);
    expect(s.greaterThanEquals(1)).toSeriesEqual(expected);
  });
  test("lt/lessThan", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([false, false]);
    expect(s.lt(1)).toSeriesEqual(expected);
    expect(s.lessThan(1)).toSeriesEqual(expected);
  });
  test("ltEq/lessThanEquals", () => {
    const s = new pl.Series([1, 2]);
    const expected = new pl.Series([true, false]);
    expect(s.ltEq(1)).toSeriesEqual(expected);
    expect(s.lessThanEquals(1)).toSeriesEqual(expected);
  });
});
describe("series proxy & metadata", () => {
  const { Series } = pl;
  test("toString & inspect", () => {
    const s = new pl.Series("foo", [1, 2, 3], pl.Int16);
    const sString = s.toString();
    const inspectString = s[Symbol.for("nodejs.util.inspect.custom")]();
    const expected = "shape: (3,)\nSeries: 'foo' [i16]\n[\n\t1\n\t2\n\t3\n]";
    expect(sString).toStrictEqual(expected);
    expect(inspectString).toStrictEqual(expected);
  });
  test("stringTag", () => {
    const s = new pl.Series([1]);
    const t = s[Symbol.toStringTag];
    expect(t).toStrictEqual("Series");
  });
  test("get", () => {
    const s = new pl.Series([2, 3, 9, -1]);
    const [two, , nine] = s;
    expect(two).toStrictEqual(2);
    expect(nine).toStrictEqual(9);
  });
  test("from", () => {
    const expected = Series("", [1, 2, 3]);
    const actual = Series.from([1, 2, 3]);
    expect(actual).toSeriesEqual(expected);
  });
  test("of", () => {
    const expected = Series("", [1, 2, 3]);
    const actual = Series.of(1, 2, 3);
    expect(actual).toSeriesEqual(expected);
  });
});
describe("StringFunctions", () => {
  it.each`
  name               | actual                                           |  expected
  ${"toUpperCase"}   | ${new pl.Series(["foo"]).str.toUpperCase()}          | ${new pl.Series(["FOO"])}
  ${"lstrip"}        | ${new pl.Series(["  foo"]).str.lstrip()}             | ${new pl.Series(["foo"])}
  ${"rstrip"}        | ${new pl.Series(["foo   "]).str.rstrip()}            | ${new pl.Series(["foo"])}
  ${"toLowerCase"}   | ${new pl.Series(["FOO"]).str.toLowerCase()}          | ${new pl.Series(["foo"])}
  ${"contains"}      | ${new pl.Series(["f1", "f0"]).str.contains(/[0]/)}   | ${new pl.Series([false, true])}
  ${"lengths"}       | ${new pl.Series(["apple", "ham"]).str.lengths()}     | ${new pl.Series([5, 3])}
  ${"slice"}         | ${new pl.Series(["apple", "ham"]).str.slice(1)}      | ${new pl.Series(["pple", "am"])}
  `("$# $name expected matches actual", ({ expected, actual }) => {

    expect(expected).toStrictEqual(actual);
  });

  test("hex encode", () => {
    const s = new pl.Series("strings", ["foo", "bar", null]);
    const expected = new pl.Series("encoded", ["666f6f", "626172", null]);
    const encoded = s.str.encode("hex").alias("encoded");
    expect(encoded).toSeriesEqual(expected);
  });
  test("hex decode", () => {
    const s = new pl.Series("encoded", ["666f6f", "626172", "invalid", null]);
    const expected = new pl.Series("decoded", ["foo", "bar", null, null]);
    const decoded = s.str.decode("hex").alias("decoded");
    expect(decoded).toSeriesEqual(expected);
  });
  test("hex decode strict", () => {
    const s = new pl.Series("encoded", ["666f6f", "626172", "invalid", null]);
    const fn0 = () => s.str.decode("hex", true).alias("decoded");
    const fn1 = () => s.str.decode({ encoding: "hex", strict: true }).alias("decoded");
    expect(fn0).toThrow();
    expect(fn1).toThrow();
  });
  test("encode base64", () => {
    const s = new pl.Series("strings", ["foo", "bar"]);
    const expected = new pl.Series("encoded", ["Zm9v", "YmFy"]);
    const encoded = s.str.encode("base64").alias("encoded");
    expect(encoded).toSeriesEqual(expected);
  });
  test("base64 decode strict", () => {
    const s = new pl.Series("encoded", ["Zm9v", "YmFy", "not base64 encoded", null]);
    const fn0 = () => s.str.decode("base64", true).alias("decoded");
    const fn1 = () => s.str.decode({ encoding: "base64", strict: true }).alias("decoded");
    expect(fn0).toThrow();
    expect(fn1).toThrow();
  });
  test("base64 decode", () => {
    const s = new pl.Series("encoded", ["Zm9v", "YmFy", "invalid", null]);
    const decoded = new pl.Series("decoded", ["foo", "bar", null, null]);

    const actual = s.str.decode("base64").alias("decoded");
    expect(actual).toSeriesEqual(decoded);
  });
});
