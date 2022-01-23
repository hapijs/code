/// <reference types="node" />

import * as Hoek from '@hapi/hoek';


// Internal helpers

type Class<T = any> = new (...args: any[]) => T;

type UnpackArray<T> = T extends (infer U)[] ? U : T;

type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

type Loosely<T> = T extends object ? RecursivePartial<T> & { [key: string]: any } : T;

/**
 * Configure code behavior
 */
export const settings: Settings;

export interface Settings {

    /**
     * Truncate long assertion error messages for readability.
     * 
     * @default false
     */
    truncateMessages?: boolean;

    /**
     * Ignore object prototypes when doing a deep comparison.
     * 
     * @defaults false
     */
    comparePrototypes?: boolean;
}

/**
 * Makes the test fail.
 * 
 * @param message - the error message generated.
 */
export function fail(message?: string): void;


/**
 * Returns the total number of assertions created using the `expect()` method.
 * 
 * @returns total number of assertions.
 */
export function count(): number;


/**
 * Returns an array of the locations where incomplete assertions were declared or `null` if no incomplete assertions found.
 * 
 * @returns array of incomplete assertion locations.
 */
export function incomplete(): string[] | null;


/**
 * Returns the filename, line number, and column number of where the `error` was created. If no error is provided, the current location returned.
 * 
 * @param error - an error object.
 * 
 * @returns the location where the error was thrown.
 */
export function thrownAt(error?: Error): thrownAt.Location;

export namespace thrownAt {

    interface Location {

        filename: string;
        line: string;
        column: string;
    }
}


type TNarrowedAssertion<T, TTest extends T = T> =
    TTest extends Function ? expect.FunctionAssertion<T> :
    TTest extends string ? expect.StringAssertion<T> :
    TTest extends number | bigint ? expect.NumberAssertion<T> :
    TTest extends Promise<any> ? expect.PromiseAssertion<T> :
    expect.Assertion<T>;

/**
 * Declares an assertion chain.
 * 
 * @param value - the value being asserted.
 * @param prefix - a string prefix added to error messages.
 * 
 * @returns Assertion object.
 */
export function expect<T>(value: T, prefix?: string): TNarrowedAssertion<T>;

declare namespace expect {

    interface Assertion<T, TTest extends T = T> {

        // Grammar

        a: this;
        an: this;
        and: this;
        at: this;
        be: this;
        have: this;
        in: this;
        to: this;


        // Flags

        /**
         * Inverses the expected result of the assertion chain.
         */
        not: TTest extends Function ? expect.Not_FunctionAssertion<T> :
             TTest extends Promise<any> ? expect.Not_PromiseAssertion<T> :
             this;

        /**
         * Requires that inclusion matches appear only once in the provided value.
         */
        once: this;

        /**
         * Requires that only the provided elements appear in the provided value.
         */
        only: this;

        /**
         * Allows a partial match when asserting inclusion instead of a full comparison.
         */
        part: this;

        /**
         * Performs a comparison using strict equality (===) instead of a deep comparison.
         */
        shallow: this;


        // Types

        /**
         * Asserts that the reference value is an arguments object.
         * 
         * @returns assertion chain object.
         */
        arguments(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is an Array.
         *
         * @returns assertion chain object.
         */
        array(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is a boolean.
         *
         * @returns assertion chain object.
         */
        boolean(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is a Buffer.
         *
         * @returns assertion chain object.
         */
        buffer(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is a Date
         *
         * @returns assertion chain object.
         */
        date(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is an error.
         * 
         * @param type - constructor function the error must be an instance of.
         * @param message - string or regular expression the error message must match.
         *
         * @returns assertion chain object.
         */
        error(type: Class, message?: string | RegExp): TNarrowedAssertion<T>;
        error(message?: string | RegExp): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is a function.
         *
         * @returns assertion chain object.
         */
        function(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is a number.
         *
         * @returns assertion chain object.
         */
        number(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is a RegExp.
         *
         * @returns assertion chain object.
         */
        regexp(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is a string.
         *
         * @returns assertion chain object.
         */
        string(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is an object (excluding array, buffer, or other native objects).
         *
         * @returns assertion chain object.
         */
        object(): TNarrowedAssertion<T>;


        // Values

        /**
         * Asserts that the reference value is true.
         *
         * @returns assertion chain object.
         */
        true(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is false.
         *
         * @returns assertion chain object.
         */
        false(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is null.
         *
         * @returns assertion chain object.
         */
        null(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is undefined.
         *
         * @returns assertion chain object.
         */
        undefined(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is `NaN`.
         *
         * @returns assertion chain object.
         */
        NaN(): TNarrowedAssertion<T>;

        // Tests

        /**
         * Asserts that the reference value (a string, array, or object) includes the provided values.
         * 
         * @param values - the values to include.
         *
         * @returns assertion chain object.
         */
        include(values: UnpackArray<Loosely<T> | Loosely<T>[]>): TNarrowedAssertion<T>;
        include(values: string | string[]): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value (a string, array, or object) includes the provided values.
         *
         * @param values - the values to include.
         *
         * @returns assertion chain object.
         */
        includes(values: UnpackArray<Loosely<T> | Loosely<T>[]>): TNarrowedAssertion<T>;
        includes(values: string | string[]): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value (a string, array, or object) includes the provided values.
         *
         * @param values - the values to include.
         *
         * @returns assertion chain object.
         */
        contain(values: UnpackArray<Loosely<T> | Loosely<T>[]>): TNarrowedAssertion<T>;
        contain(values: string | string[]): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value (a string, array, or object) includes the provided values.
         *
         * @param values - the values to include.
         *
         * @returns assertion chain object.
         */
        contains(values: UnpackArray<Loosely<T> | Loosely<T>[]>): TNarrowedAssertion<T>;
        contains(values: string | string[]): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value exists (not null or undefined).
         *
         * @returns assertion chain object.
         */
        exist(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value exists (not null or undefined).
         *
         * @returns assertion chain object.
         */
        exists(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value has a length property equal to zero or is an object with no keys.
         *
         * @returns assertion chain object.
         */
        empty(): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value has a length property matching the provided size or an object with the specified number of keys.
         * 
         * @param size - the required length.
         *
         * @returns assertion chain object.
         */
        length(size: T extends string | Buffer | object | any[] ? number : never): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value equals the provided value.
         * 
         * @param value - the value to match.
         * @param options - comparison options.
         *
         * @returns assertion chain object.
         */
        equal(value: T, options?: Hoek.deepEqual.Options): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value equals the provided value.
         *
         * @param value - the value to match.
         * @param options - comparison options.
         *
         * @returns assertion chain object.
         */
        equals(value: T, options?: Hoek.deepEqual.Options): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value has the provided instanceof value.
         * 
         * @param type - the constructor function to be an instance of.
         */
        instanceof(type: Class): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value has the provided instanceof value.
         *
         * @param type - the constructor function to be an instance of.
         */
        instanceOf(type: Class): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value's toString() representation matches the provided regular expression.
         * 
         * @param regex - the pattern to match.
         *
         * @returns assertion chain object.
         */
        match(regex: RegExp): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value's toString() representation matches the provided regular expression.
         *
         * @param regex - the pattern to match.
         *
         * @returns assertion chain object.
         */
        matches(regex: RegExp): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value satisfies the provided validator function.
         * 
         * @param validator
         *
         * @returns assertion chain object.
         */
        satisfy(validator: (value: T) => boolean): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value satisfies the provided validator function.
         *
         * @param validator
         *
         * @returns assertion chain object.
         */
        satisfies(validator: (value: T) => boolean): TNarrowedAssertion<T>;
    }

    interface FunctionAssertion<T> extends Assertion<T> {

        /**
         * Asserts that the function reference value throws an exception when called.
         * 
         * @param type - constructor function the error must be an instance of.
         * @param message - string or regular expression the error message must match.
         *
         * @returns thrown value.
         */
        throw<E extends {}>(type: Class<E>, message?: string | RegExp): E;
        throw<E = unknown>(message?: string | RegExp): E;

        /**
         * Asserts that the function reference value throws an exception when called.
         *
         * @param type - constructor function the error must be an instance of.
         * @param message - string or regular expression the error message must match.
         *
         * @returns thrown value.
         */
        throws<E extends {}>(type: Class<E>, message?: string | RegExp): E;
        throws<E = unknown>(message?: string | RegExp): E;
    }

    interface Not_FunctionAssertion<T> extends Assertion<T> {

        /**
         * Asserts that the function reference value throws an exception when called.
         *
         * @returns assertion chain object.
         */
        throw(): TNarrowedAssertion<T>;
        throw(): TNarrowedAssertion<T>;

        /**
         * Asserts that the function reference value throws an exception when called.
         *
         * @returns assertion chain object.
         */
        throws(): TNarrowedAssertion<T>;
        throws(): TNarrowedAssertion<T>;
    }

    interface StringAssertion<T> extends Assertion<T> {

        /**
         * Asserts that the reference value (a string) starts with the provided value.
         * 
         * @param value - the value to start with.
         *
         * @returns assertion chain object.
         */
        startWith(value: string): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value (a string) starts with the provided value.
         *
         * @param value - the value to start with.
         *
         * @returns assertion chain object.
         */
        startsWith(value: string): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value (a string) ends with the provided value.
         *
         * @param value - the value to end with.
         *
         * @returns assertion chain object.
         */
        endWith(value: string): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value (a string) ends with the provided value.
         *
         * @param value - the value to end with.
         *
         * @returns assertion chain object.
         */
        endsWith(value: string): TNarrowedAssertion<T>;
    }

    interface NumberAssertion<T> extends Assertion<T> {

        /**
         * Asserts that the reference value is greater than (>) the provided value.
         * 
         * @param value - the value to compare to.
         *
         * @returns assertion chain object.
         */
        above(value: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is greater than (>) the provided value.
         *
         * @param value - the value to compare to.
         *
         * @returns assertion chain object.
         */
        greaterThan(value: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is at least (>=) the provided value.
         * 
         * @param value - the value to compare to.
         *
         * @returns assertion chain object.
         */
        least(value: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is at least (>=) the provided value.
         *
         * @param value - the value to compare to.
         *
         * @returns assertion chain object.
         */
        min(value: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is less than (<) the provided value.
         * 
         * @param value - the value to compare to.
         *
         * @returns assertion chain object.
         */
        below(value: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is less than (<) the provided value.
         *
         * @param value - the value to compare to.
         *
         * @returns assertion chain object.
         */
        lessThan(value: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is at most (<=) the provided value.
         * 
         * @param value - the value to compare to.
         *
         * @returns assertion chain object.
         */
        most(value: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is at most (<=) the provided value.
         *
         * @param value - the value to compare to.
         *
         * @returns assertion chain object.
         */
        max(value: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is within (from <= value <= to) the provided values.
         * 
         * @param from - the value to be equal to or above.
         * @param to - the value to be equal to or below.
         *
         * @returns assertion chain object.
         */
        within(from: T, to: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is within (from <= value <= to) the provided values.
         *
         * @param from - the value to be equal to or above.
         * @param to - the value to be equal to or below.
         *
         * @returns assertion chain object.
         */
        range(from: T, to: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is between but not equal (from < value < to) the provided values.
         * 
         * @param from - the value to be above.
         * @param to - the value to be below.
         *
         * @returns assertion chain object.
         */
        between(from: T, to: T): TNarrowedAssertion<T>;

        /**
         * Asserts that the reference value is about the provided value within a delta margin of difference.
         * 
         * @param value - the value to be near.
         * @param delta - the max distance to be from the value.
         *
         * @returns assertion chain object.
         */
        about(value: T extends number ? T : never, delta: T extends number ? T : never): TNarrowedAssertion<T>;
    }

    interface PromiseAssertion<T> extends Assertion<T> {

        /**
         * Asserts that the Promise reference value rejects with an exception when called.
         * 
         * @param type - constructor function the error must be an instance of.
         * @param message - string or regular expression the error message must match.
         *
         * @returns rejected value.
         */
        reject<E extends {}>(type: Class<E>, message?: string | RegExp): E;
        reject<E = unknown>(message?: string | RegExp): E;

        /**
         * Asserts that the Promise reference value rejects with an exception when called.
         *
         * @param type - constructor function the error must be an instance of.
         * @param message - string or regular expression the error message must match.
         *
         * @returns rejected value.
         */
        rejects<E extends {}>(type: Class<E>, message?: string | RegExp): E;
        rejects<E = unknown>(message?: string | RegExp): E;
    }

    interface Not_PromiseAssertion<T> extends Assertion<T> {

        /**
         * Asserts that the Promise reference value rejects with an exception when called.
         *
         * @returns null.
         */
        reject(): null;

        /**
         * Asserts that the Promise reference value rejects with an exception when called.
         *
         * @returns null.
         */
        rejects(): null;
    }
}
