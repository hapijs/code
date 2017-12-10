interface Expect {
    a: Expect,
    an: Expect,
    and: Expect,
    at: Expect,
    be: Expect,
    have: Expect,
    in: Expect,
    to: Expect,

    not: Expect,
    once: Expect,
    only: Expect,
    part: Expect,
    shallow: Expect,

    arguments(): Expect,
    array(): Expect,
    boolean(): Expect,
    buffer(): Expect,
    date(): Expect,
    error(message?: String | RegExp): Expect,
    error(type: Error, message?: String | RegExp): Expect,
    function(): Expect,
    number(): Expect,
    regexp(): Expect,
    string(): Expect,
    object(): Expect,

    true(): Expect,
    false(): Expect,
    null(): Expect,
    undefined(): Expect,
    NaN(): Expect,

    include(values: any): Expect,
    includes(values: any): Expect,
    contain(values: any): Expect,
    contains(values: any): Expect,

    startWith(value: String): Expect,
    startsWith(value: String): Expect,
    endWith(value: String): Expect,
    endsWith(value: String): Expect,

    exist(): Expect,
    empty(): Expect,

    length(size: Number): Expect,

    equal(value: any, options?: any): Expect,

    above(value: Number): Expect,
    greaterThan(value: Number): Expect,

    least(value: Number): Expect,
    min(value: Number): Expect,

    below(value: Number): Expect,
    lessThan(value: Number): Expect,

    most(value: Number): Expect,
    max(value: Number): Expect,

    within(from: Number, to: Number): Expect,
    range(from: Number, to: Number): Expect,
    between(from: Number, to: Number): Expect,

    about(value: Number, delta: Number): Expect,

    instanceof(type: ObjectConstructor): Expect,

    match(regex: RegExp): Expect,
    matchs(regex: RegExp): Expect,

    satisfy(validator: Function): Expect,
    satisfies(validator: Function): Expect,

    throw(message?: string | RegExp): Expect,
    throw(type: ErrorConstructor, message?: string | RegExp): Expect,
    throws(message?: string | RegExp): Expect,
    throws(type: ErrorConstructor, message?: string | RegExp): Expect
}

export function expect(value: any, prefix?: string): Expect;

export function fail(message: string): void;

export function count(): number;

export function incomplete(): null | string[];

export function thrownAt(error?: Error): {
    filename: string,
    line: string,
    column: string
};

export const settings: {
    truncateMessages: boolean;
    comparePrototypes: boolean;
}