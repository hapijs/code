#code

BDD assertion library.

[![Current Version](https://img.shields.io/npm/v/code.svg)](https://www.npmjs.org/package/code)
[![Build Status](https://secure.travis-ci.org/hapijs/code.png)](http://travis-ci.org/hapijs/code)

Lead Maintainer - [Colin Ihrig](https://github.com/cjihrig)

## Table of Contents

- [Example](#example)
- [Acknowledgments](#acknowledgments)
- [Usage](#usage)
    - Grammar
    - Flags
    - [`expect(value, [prefix])`](#expectvalue-prefix)
        - Types
            - [`arguments()`](#arguments)
            - [`array()`](#array)
            - [`boolean()`](#boolean)
            - [`buffer()`](#buffer)
            - [`date()`](#date)
            - [`function()`](#function)
            - [`number()`](#number)
            - [`regexp()`](#regexp)
            - [`string()`](#string)
            - [`object()`](#object)
        - Values
            - [`true()`](#true)
            - [`false()`](#false)
            - [`null()`](#null)
            - [`undefined()`](#undefined)
        - [`include(values)`](#includevalues)
        - [`startWith(value)`](#startwithvalue)
        - [`endWith(value)`](#startwithvalue)
        - [`exist()`](#exist)
        - [`empty()`](#empty)
        - [`length(size)`](#lengthsize)
        - [`equal(value)`](#equalvalue)
        - [`above(value)`](#abovevalue)
        - [`least(value)`](#leastvalue)
        - [`below(value)`](#belowvalue)
        - [`most(value)`](#mostvalue)
        - [`within(from, to)`](#withinfrom-to)
        - [`about(value, delta)`](#aboutvalue-delta)
        - [`instanceof(type)`](#instanceoftype)
        - [`match(regex)`](#matchregex)
        - [`satisfy(validator)`](#satisfyvalidator)
        - [`throw([type], [message])`](#throwtype-message)
    - [`count()`](#count)
    - [`incomplete()`](#incomplete)

## Example

```js
var Code = require('code');
var expect = Code.expect;

expect(true).to.be.a.boolean().and.to.not.equal(false);
expect('this string').to.only.include(['this', 'string']);
```

## Acknowledgments

**code** was created as a direct rewrite of the powerful [**chai**](http://chaijs.com) assertions
library. This virtual fork was created for a few reasons. First, **chai** mixed usage of methods and
properties creates a problematic environment in which it is too easy to forget a method `()` and result
in an assertion that is never executed (and therefor passes incorrectly). This observation was noted by
the [**must**](https://github.com/moll/js-must) author.

The second reason is that similar to [**lab**](https://github.com/hapijs/lab), our test runner, we wanted
an assertion library that is small, simple, and intuitive - without plugins, extensions, or the overhead
of having to support testing in the browser. **code** provides much of the same functionality is about
300 lines of code that are trivial to read in a few minutes.

And last, we wanted to experiment with some new features that allow deeper integration between the test
runner and assertions library. The first of which are two methods exported (and used by **lab**) for getting
the total assertions count (which is a measure of the tests comprehensiveness), and by verifying that every
assertion created (e.g. every `expect()` call) is also executed. This will alert when a statement like
`expect(5).to.be.a.string` is not allowed to remain unnoticed (and fail to throw due to the missing `()`).

Like **lab**, the goal is to keep this module small and simple. If you need extensibility or other
functionality, we recommend looking at the many other excellent assertions libraries available.

## Usage

### Grammar

**code** supports usage of connecting words to make assertions more readable. The inclusion of these
grammar elements has no impact over the assertion outcome and are used for human readability only.
Every method or property of the assertion object returned by `expect()` returns `this` which allows
chaining addition assertions or grammar words.

The supported words are:
- `a`
- `an`
- `and`
- `at`
- `be`
- `have`
- `in`
- `to`

```js
var Code = require('code');
var expect = Code.expect;

expect(10).to.be.above(5);
expect('abc').to.be.a.string();
expect([1, 2]).to.be.an.array();
expect(20).to.be.at.least(20);
expect('abc').to.have.length(3);
expect('abc').to.be.a.string().and.contain(['a', 'b']);
expect(6).to.be.in.range(5, 6);
```

### Flags

The following words toggle a status flag for the current assertion:
- `deep` - performs a deep comparison instead of simple equality (`===`). Required when trying to compare
  objects to an identical copy that is not the same reference. Used by `equal()` and `include()`.
- `not` - inverses the expected result of any assertion.
- `once` - requires that inclusion matches appear only once in the provided value. Used by `include()`.
- `only` - requires that only the provided elements appear in the provided value. Used by `include()`.
- `part` - allows a partial match when asserting inclusion. Used by `include()`.

```js
var Code = require('code');
var expect = Code.expect;

expect(10).to.not.be.above(20);
expect([{ a: 1 }]).to.deep.include({ a: 1 });
expect([1, 1, 2]).to.only.include([1, 2]);
expect([1, 2]).to.once.include([1, 2]);
expect([1, 2, 3]).to.part.include([1, 4]);
```

Note that including the same flag twice toggles the last value set. This is especially important when
chaining multiple assertions in a single statement (e.g. when using the `and` grammar word).

### `expect(value, [prefix])`

Generates an assertion object where:
- `value` - the reference value on which to apply the assertion rules.
- `prefix` - an optional string used as an error message prefix.

```js
var Code = require('code');
var expect = Code.expect;

expect(10, 'Age').to.be.above(5);
```

#### Types

Asserts that the reference value is of a certain type.

##### `arguments()`

Asserts that the reference value is an `arguments` object.

```js
var Code = require('code');
var expect = Code.expect;

var func = function () { return arguments; };
expect(func()).to.be.arguments();
```

##### `array()`

Asserts that the reference value is an `Array`.

```js
var Code = require('code');
var expect = Code.expect;

expect([1, 2]).to.be.an.array();
```

##### `boolean()`

Asserts that the reference value is a boolean.

```js
var Code = require('code');
var expect = Code.expect;

expect(true).to.be.a.boolean();
```

##### `buffer()`

Asserts that the reference value is a `Buffer`.

```js
var Code = require('code');
var expect = Code.expect;

expect(new Buffer('')).to.be.a.buffer();
```

##### `date()`

Asserts that the reference value is a `Date`.

```js
var Code = require('code');
var expect = Code.expect;

expect(new Date()).to.be.a.date();
```

##### `function()`

Asserts that the reference value is a `function`.

```js
var Code = require('code');
var expect = Code.expect;

expect(function () {}).to.be.a.function();
```

##### `number()`

Asserts that the reference value is a `number`.

```js
var Code = require('code');
var expect = Code.expect;

expect(123).to.be.a.number();
```

##### `regexp()`

Asserts that the reference value is an `RegExp`.

```js
var Code = require('code');
var expect = Code.expect;

expect(/abc/).to.be.a.regexp();
```

##### `string()`

Asserts that the reference value is a string.

```js
var Code = require('code');
var expect = Code.expect;

expect('abc').to.be.a.string();
```

##### `object()`

Asserts that the reference value is an object (excluding array, buffer, or other native objects).

```js
var Code = require('code');
var expect = Code.expect;

expect({ a: '1' }).to.be.an.object();
```

#### Values

Asserts that the reference value is equals to a predefined value.

##### `true()`

Asserts that the reference value is true.

```js
var Code = require('code');
var expect = Code.expect;

expect(true).to.be.true();
```

##### `false()`

Asserts that the reference value is false.

```js
var Code = require('code');
var expect = Code.expect;

expect(false).to.be.false();
```

##### `null()`

Asserts that the reference value is null.

```js
var Code = require('code');
var expect = Code.expect;

expect(null).to.be.null();
```

##### `undefined()`

Asserts that the reference value is undefined.

```js
var Code = require('code');
var expect = Code.expect;

expect(undefined).to.be.undefined();
```

#### `include(values)`

Aliases: `includes()`, `contain()`, `contains()`

Asserts that the reference value (a string, array, or object) includes the provided values where:
- `values` - a single or array of values. If the reference value is a string, the values must be strings.
  If the reference value is an array, the values can be any array member (`deep` is required to compare
  non-literal types). If the reference value is an object, the values can be key names, or a single object
  with key-value pairs to match.

```js
var Code = require('code');
var expect = Code.expect;

expect('abc').to.include('ab');
expect('abc').to.only.include('abc');
expect('aaa').to.only.include('a');
expect('abc').to.once.include('b');
expect('abc').to.include(['a', 'c']);
expect('abc').to.part.include(['a', 'd']);

expect([1, 2, 3]).to.include(1);
expect([{ a: 1 }]).to.deep.include({ a: 1 });
expect([1, 2, 3]).to.include([1, 2]);
expect([{ a: 1 }]).to.deep.include([{ a: 1 }]);
expect([1, 1, 2]).to.only.include([1, 2]);
expect([1, 2]).to.once.include([1, 2]);
expect([1, 2, 3]).to.part.include([1, 4]);
expect([[1], [2]]).to.deep.include([[1]]);

expect({ a: 1, b: 2, c: 3 }).to.include('a');
expect({ a: 1, b: 2, c: 3 }).to.include(['a', 'c']);
expect({ a: 1, b: 2, c: 3 }).to.only.include(['a', 'b', 'c']);
expect({ a: 1, b: 2, c: 3 }).to.include({ a: 1 });
expect({ a: 1, b: 2, c: 3 }).to.include({ a: 1, c: 3 });
expect({ a: 1, b: 2, c: 3 }).to.part.include({ a: 1, d: 4 });
expect({ a: 1, b: 2, c: 3 }).to.only.include({ a: 1, b: 2, c: 3 });
expect({ a: [1], b: [2], c: [3] }).to.deep.include({ a: [1], c: [3] });
```

#### `startWith(value)`

Aliases: `startsWith()`,

Asserts that the reference value (a string) starts with the provided value where:
- `value` - a string.

Note that this assertion is case sensitive.

```js
var Code = require('code');
var expect = Code.expect;

expect('https://example.org/secure').to.startWith('https://');
```

#### `endWith(value)`

Aliases: `endsWith()`,

Asserts that the reference value (a string) ends with the provided value where:
- `value` - a string.

Note that this assertion is case sensitive.

```js
var Code = require('code');
var expect = Code.expect;

expect('http://example.org/relative').to.endWith('/relative');
```

#### `exist()`

Aliases: `exists`

Asserts that the reference value exists (not `null` or `undefined`).

```js
var Code = require('code');
var expect = Code.expect;

expect(4).to.exist();
expect(null).to.not.exist();
```


#### `empty()`

Asserts that the reference value has a non-zero `length` property or an object with at least one key.

```js
var Code = require('code');
var expect = Code.expect;

expect('abc').to.be.empty();
```

#### `length(size)`

Asserts that the reference value has a `length` property matching the provided size or an object with the
specified number of keys where:
- `size` - the required size.

```js
var Code = require('code');
var expect = Code.expect;

expect('abcd').to.have.length(4);
```

#### `equal(value)`

Aliases: `equals()`

Asserts that the reference value equals the provided value (`deep` is required to compare non-literal
types) where:
- `value` - the value to compare to.

```js
var Code = require('code');
var expect = Code.expect;

expect(5).to.equal(5);
expect({ a: 1 }).to.deep.equal({ a: 1 });
```

#### `above(value)`

Aliases: `greaterThan()`

Asserts that the reference value is greater than (`>`) the provided value where:
- `value` - the value to compare to.

```js
var Code = require('code');
var expect = Code.expect;

expect(10).to.be.above(5);
```

#### `least(value)`

Aliases: `min()`

Asserts that the reference value is at least (`>=`) the provided value where:
- `value` - the value to compare to.

```js
var Code = require('code');
var expect = Code.expect;

expect(10).to.be.at.least(10);
```

#### `below(value)`

Aliases: `lessThan()`

Asserts that the reference value is less than (`<`) the provided value where:
- `value` - the value to compare to.

```js
var Code = require('code');
var expect = Code.expect;

expect(10).to.be.below(20);
```

#### `most(value)`

Aliases: `max()`

Asserts that the reference value is at most (`<=`) the provided value where:
- `value` - the value to compare to.

```js
var Code = require('code');
var expect = Code.expect;

expect(10).to.be.at.most(10);
```

#### `within(from, to)`

Aliases: `range()`

Asserts that the reference value is within (`from <= value <= to`) the provided values where:
- `from` - the start of the range (inclusive).
- `to` - the end of the range (inclusive).

```js
var Code = require('code');
var expect = Code.expect;

expect(10).to.be.within(10, 20);
expect(20).to.be.within(10, 20);
```

#### `between(from, to)`

Asserts that the reference value is between but not equal (`from < value < to`) the provided values where:
- `from` - the start of the range (exclusive).
- `to` - the end of the range (exclusive).

```js
var Code = require('code');
var expect = Code.expect;

expect(15).to.be.within(10, 20);
```

#### `about(value, delta)`

Asserts that the reference value is about the provided value within a delta margin of difference where:
- `value` - the value to compare to.
- `delta` - the allowed margin of difference.

```js
var Code = require('code');
var expect = Code.expect;

expect(10).to.be.about(9, 1);
```

#### `instanceof(type)`

Aliases: `instanceOf()`

Asserts that the reference value has the provided `instanceof` value where:
- `type` - the type value to match.

```js
var Code = require('code');
var expect = Code.expect;

expect(new Date()).to.be.an.instanceof(Date);
```

#### `match(regex)`

Aliases: `matches()`

Asserts that the reference value is a string matching the provided regular expression where:
- `regex` - the regular expression to match.

```js
var Code = require('code');
var expect = Code.expect;

expect('a5').to.match(/\w\d/);
```

#### `satisfy(validator)`

Aliases: `satisfies()`

Asserts that the reference value satisfies the provided validator function where:
- `validator` - a function with the signature `function(value)` with return value `true` or `false`. The
  reference value is passed as the only argument to the `validator` function and the assertion passes if
  the return value is `true`.

```js
var Code = require('code');
var expect = Code.expect;

expect('x').to.satisfy(function (value) { return value === 'x'; });
```

#### `throw([type], [message])`

Aliases: `throws`

Asserts that the function reference value throws an exception when called. The provided reference function
is invoked within a `try`-`catch` block and any error throws is caught and compared to the provided optional
requirements where:
- `type` - the `instanceof` value of the thrown object.
- `message` a string or regular expression matching the thrown error `message` property. Note that a string
  must provide a full match.

```js
var NodeUtil = require('util');
var Code = require('code');
var expect = Code.expect;

var CustomError = function (message) {

    Error.call(this, message);
};

NodeUtil.inherit(CustomError, Error)

var throws = function () {

    throw new CustomError('Oh no!');
};

expect(throws).to.throw(CustomError, 'Oh no!');
```

### `count()`

Returns the total number of assertions created using the `expect()` method.

```js
var Code = require('code');
var expect = Code.expect;

expect(5).to.not.be.a.string();
console.log(Code.count());		// -> 1
```

### `incomplete()`

Returns an array of the locations where incomplete assertions where declared or `null` if
no incomplete assertions found.

```js
var Code = require('code');
var expect = Code.expect;

expect(5).to.not.be.a.string;
console.log(Code.incomplete());		// -> [ 'readme.js:345:1' ]
```
