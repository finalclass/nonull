export type Result<Ok, Err> =
  | ["ok", Ok]
  | ["err", Err];

class Chain<Ok, Err> {

  constructor(private result: Result<Ok, Err>) {
  }

  public isOk() : boolean{
    return Result.isOk(this.result);
  }

  public isErr(): boolean {
    return Result.isErr(this.result);
  }

  public map<NewOk>(f: (value: Ok) => NewOk): Chain<NewOk, Err> {
    return new Chain(Result.map(this.result, f));
  }

  public mapErr<NewErr>(f: (reason: Err) => NewErr): Chain<Ok, NewErr> {
    return new Chain(Result.mapErr(this.result, f));
  }

  public unwrap(): Ok {
    if (this.result[0] === "err") {
      throw new Error(`unwrap called on err: ${this.result[1]}`);
    }

    return this.result[1];
  }

  public match<Return>(cases: {
    ok: (value: Ok) => Return;
    err: (reason: Err) => Return;
  }): Return {
    if (this.result[0] === "ok") {
      return cases.ok(this.result[1]);
    } else {
      return cases.err(this.result[1]);
    }
  }
}

export const Result = {

  /**
   * Create an "err" Result.
   */
  err<Err>(reason: Err): Result<any, Err> {
    return ["err", reason];
  },

  /**
   * Create an "ok" Result.
   */
  ok<Ok>(value: Ok): Result<Ok, any> {
    return ["ok", value];
  },

  /**
   * Creates a "Chain" object that can be used for chaining operations on Result
   */
  chain<Ok, Err>(result: Result<Ok, Err>): Chain<Ok, Err> {
    return new Chain(result);
  },

  /**
   * Check if a value is a "ok" Result.
   */
  isOk<Ok, Err>(result: Result<Ok, Err>): result is ["ok", Ok] {
    return result[0] === "ok";
  },

  /**
   * Check if a value is a "err" Result.
   */
  isErr<Ok, Err>(result: Result<Ok, Err>): result is ["err", Err] {
    return result[0] === "err";
  },

  /**
   * Map a Result value to a new value.
   */
  map<Ok, Err, NewOk>(result: Result<Ok, Err>, f: (value: Ok) => NewOk): Result<NewOk, Err> {
    if (result[0] === "err") {
      return result;
    }

    return ["ok", f(result[1])];
  },

  /**
   * Map a Result error to a new error.
   */
  mapErr<Ok, Err, NewErr>(
    result: Result<Ok, Err>,
    f: (reason: Err) => NewErr,
  ): Result<Ok, NewErr> {
    if (result[0] === "ok") {
      return result;
    }

    return ["err", f(result[1])];
  },

  /**
   * Unwrap a "ok" Result value.
   * If the Result is "err" then an Error is thrown.
   */
  unwrap<Ok, Err>(result: Result<Ok, Err>): Ok {
    if (result[0] === "err") {
      const err = new Error(
        typeof result[1] === "string" ? result[1] : "Result.unwrap called on err",
      );
      err.cause = result[1];
      throw err;
    }

    return result[1];
  },


  /**
   * Match a Result value with a set of cases.
   * Each case must return the same type.
   */
  match<Ok, Err, Return>(result: Result<Ok, Err>, cases: {
    ok: (value: Ok) => Return;
    err: (reason: Err) => Return;
  }): Return {
    if (result[0] === "ok") {
      return cases.ok(result[1]);
    }
    return cases.err(result[1]);
  },
};
