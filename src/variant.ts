type VariantBase = [string, any];

type VariantMatch<V extends VariantBase, R> = {
  [K in V[0]]: V extends [K, infer A] ? (arg: A) => R : never;
};

export const Variant = {

  /**
   * Match a variant value with a set of cases.
   * Each case must return the same type.
   */
  match<V extends VariantBase, R>(val: V, cases: VariantMatch<V, R>): R {
    return (cases as any)[val[0]](val[1]);
  },

  /**
   */
  unwrap<V extends VariantBase>(
    val: V,
    name: V[0],
  ): typeof val extends [V[0], infer A] ? A : never {
    if (val[0] !== name) {
      throw new Error("Variant unwrap failed");
    }
    return val[1];
  },

  /**
   * Check if a value is a variant value.
   */
  is<V extends VariantBase>(
    val: unknown,
    key: V[1],
  ): val is V extends [V[0], infer A] ? [V[0], A] : never {
    return (val as any)?.[0] === key;
  },
};
