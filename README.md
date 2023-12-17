# README

Variant type implementation for TypeScript.

This package provides two classes "Variant" for a general variants of type: `[string, any]` and `Result` for a Result type


## Installation

node
```sh
npm install variant
```

deno
```ts
import { Variant, Result } from "https://deno.land/x/variant/mod.ts";
```

## Usage

### Variant

```ts
import { Variant } from "@sel/variant";

type V1 =
  | ["foo", number]
  | ["bar", string];

const v1: V1 = ["foo", 3];

const result = Variant.match<V1, string>(v1, {
  foo(n: number) {
    return "ok" + n;
  },
  bar(s: string) {
    return "ok" + s;
  },
});

const n = Variant.unwrap(v1, "foo");

if (Variant.is(v1, "foo")) {
  const n = Variant.unwrap(v1, "foo"); // "n" is number
  console.log("is foo");
}
```

### Result

```ts
import { Result } from "@sel/variant";

const result = Result.ok(3);

const result2 = Result.match(result, {
  ok(n: number) {
    return "ok" + n;
  },
  err(e: Error) {
    return "err" + e.message;
  },
});


const x = Result.ok(2);
const y = Result.map(x, (n) => n * 2);

const z = Result.chain(y)
  .map((n) => n * 2)
  .map((n) => n.toString())
  .mapErr((e) => "otherError")
  .match({
    ok(n) {
      return "ok" + n;
    },
    err(e) {
      return "err" + e;
    },
  });
```

## API

### Variant

- `match<V extends VariantBase, R>(val: V, cases: VariantMatch<V, R>): R;`

   Match a variant value with a set of cases.
   Each case must return the same type.

- `unwrap<V extends VariantBase>( val: V, name: V[0],): typeof val extends [V[0], infer A] ? A : never;`


   Unwrap a variant value.
   If the variant value does not match the name, an error is thrown.
   The return type is inferred from the variant value.

   @throws

- `is<V extends VariantBase>( val: unknown, key: V[1],): val is V extends [V[0], infer A] ? [V[0], A] : never;`

   Check if a value is a variant value. Adds a type guard so after checking the compiler will infer the type:

```ts
if (Variant.is(v1, "foo")) {
  const n = Variant.unwrap(v1, "foo"); // "n" is number
  console.log("is foo");
}
```

### Result


- `err<Err>(reason: Err): Result<any, Err>;`

   Create an "err" Result.

- `ok<Ok>(value: Ok): Result<Ok, any>;`

   Create an "ok" Result.

- `chain<Ok, Err>(result: Result<Ok, Err>): Chain<Ok, Err>;`

   Creates a "Chain" object that can be used for chaining operations on Result

- `isOk<Ok, Err>(result: Result<Ok, Err>): result is ["ok", Ok];`

   Check if a value is a "ok" Result.

- `isErr<Ok, Err>(result: Result<Ok, Err>): result is ["err", Err];`

   Check if a value is a "err" Result.

- `map<Ok, Err, NewOk>(result: Result<Ok, Err>, f: (value: Ok) => NewOk): Result<NewOk, Err>;`

   Map a Result value to a new value.

- `mapErr<Ok, Err, NewErr>( result: Result<Ok, Err>, f: (reason: Err) => NewErr,): Result<Ok, NewErr>;`

   Map a Result error to a new error.

- `unwrap<Ok, Err>(result: Result<Ok, Err>): Ok;`

   Unwrap a "ok" Result value.
   If the Result is "err" then an Error is thrown.

- `match<Ok, Err, Return>(result: Result<Ok, Err>, cases: {
    ok: (value: Ok) => Return;
    err: (reason: Err) => Return;
  }): Return;` 

   Match a Result value with a set of cases.
   Each case must return the same type.

- Chain

`Chain` is a class for chaining operations on Result.

It's methods are as follows:

```ts
  constructor(private result: Result<Ok, Err>);
  public isOk(): boolean;
  public isErr(): boolean {
  map<NewOk>(f: (value: Ok) => NewOk): Chain<NewOk, Err>;
  mapErr<NewErr>(f: (reason: Err) => NewErr): Chain<Ok, NewErr>;
  unwrap(): Ok;
  match<Return>(cases: { ok: (value: Ok) => Return; err: (reason: Err) => Return; }): Return;





