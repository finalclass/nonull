// deno-lint-ignore-file no-explicit-any
// Vrant type is a type that is a tuple of two elements. First is a string which describes the type and
// second is the payload.
//
// The type is used usually with as an union with similar types. For example:

// type V1:Vrant =
//   | ["foo", number]
//   | ["bar", string];

// in the above example V1 is a variadic type which can be either ["foo", number] or ["bar", string].
// You can match the type using Vrant.match

// const result = Vrant.match<V1, "ok">({
//   foo(n) { // here n is "number"
//     return "ok"; // all cases must return the same type
//   },
//   bar(s) { // here s is "string"
//     return "ok";
//   },
// });

// The type of result is "ok" | "ok" which is just "ok".

// Here is the implementation of Vrant.match:

type VrantBase = [string, any];

type VrantMatch<V extends VrantBase, R> = {
  [K in V[0]]: V extends [K, infer A] ? (arg: A) => R : never;
};

const Vrant = {
  match<V extends VrantBase, R>(val: V, cases: VrantMatch<V, R>): R {
    return (cases as any)[val[0]](val[1]);
  },

  unwrap<V extends VrantBase>(
    val: V,
    name: V[0],
  ): typeof val extends [V[0], infer A] ? A : never {
    if (val[0] !== name) {
      throw new Error("Vrant unwrap failed");
    }
    return val[1];
  },

  is<V extends VrantBase>(
    val: unknown,
    key: V[1],
  ): val is V extends [V[0], infer A] ? [V[0], A] : never {
    return (val as any)?.[0] === key;
  },
};

type V1 =
  | ["foo", number]
  | ["bar", string];

const v1: V1 = ["foo", 3];

const result = Vrant.match<V1, string>(v1, {
  foo(n: number) {
    return "ok" + n;
  },
  bar(s: string) {
    return "ok" + s;
  },
});

const n = Vrant.unwrap(v1, "foo");

if (Vrant.is(v1, "foo")) {
  console.log("is foo");
}
console.log(result, n);
