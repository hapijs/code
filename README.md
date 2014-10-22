#code

BDD assertion library.

[![Build Status](https://secure.travis-ci.org/hapijs/code.png)](http://travis-ci.org/hapijs/code)

Lead Maintainer - [Eran Hammer](https://github.com/hueniverse)

## Table of Contents

- [Example](#example)
- [Usage](#usage)
    - Grammar
    - Flags
    - [`expect(value, [prefix])`](#expectvalue-prefix)
        - Types
            [`arguments()`](#arguments)
            [`array()`](#array)
            [`boolean()`](#boolean)
            [`buffer()`](#buffer)
            [`date()`](#date)
            [`function()`](#function)
            [`number()`](#number)
            [`regexp()`](#regexp)
            [`string()`](#string)
            [`object()`](#object)
        - Values
            [`true()`](#true)
            [`false()`](#false)
            [`null()`](#null)
            [`undefined()`](#undefined)

## Example

```js
var Code = require('code');
var expect = Code.expect;

expect(true).to.be.a.boolean().and.to.not.equal(false);
expect('this string').to.only.include(['this', 'string']);
```

## Usage

### Grammar

**code* supports usage of connecting words to make assertions more readable. The inclusion of these
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

Note that including the same flag twice toggles the last value set. This is especially important when chaining
multiple assertions in a single statement (e.g. when using the `and` grammar word).

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

Asserts that the value is of a certain type.

##### `arguments()`

Asserts that the value is an `arguments` object.

```js
var Code = require('code');
var expect = Code.expect;

var func = function () { return arguments; };
expect(func()).to.be.arguments();
```

##### `array()`

Asserts that the value is an `Array`.

```js
var Code = require('code');
var expect = Code.expect;

expect([1, 2]).to.be.an.array();
```

##### `boolean()`

Asserts that the value is a boolean.

```js
var Code = require('code');
var expect = Code.expect;

expect(true).to.be.a.boolean();
```

##### `buffer()`

Asserts that the value is a `Buffer`.

```js
var Code = require('code');
var expect = Code.expect;

expect(new Buffer('')).to.be.a.buffer();
```

##### `date()`

Asserts that the value is a `Date`.

```js
var Code = require('code');
var expect = Code.expect;

expect(new Date()).to.be.a.date();
```

##### `function()`

Asserts that the value is a `function`.

```js
var Code = require('code');
var expect = Code.expect;

expect(function () {}).to.be.a.function();
```

##### `number()`

Asserts that the value is a `number`.

```js
var Code = require('code');
var expect = Code.expect;

expect(123).to.be.a.number();
```

##### `regexp()`

Asserts that the value is an `RegExp`.

```js
var Code = require('code');
var expect = Code.expect;

expect(/abc/).to.be.a.regexp();
```

##### `string()`

Asserts that the value is a string.

```js
var Code = require('code');
var expect = Code.expect;

expect('abc').to.be.a.string();
```

##### `object()`

Asserts that the value is an object (excluding array, buffer, or other native objects).

```js
var Code = require('code');
var expect = Code.expect;

expect({ a: '1' }).to.be.an.object();
```

#### Values

Asserts that the value is equals to a predefined value.

##### `true()`

Asserts that the value is true.

```js
var Code = require('code');
var expect = Code.expect;

expect(true).to.be.true();
```

##### `false()`

Asserts that the value is false.

```js
var Code = require('code');
var expect = Code.expect;

expect(false).to.be.false();
```

##### `null()`

Asserts that the value is null.

```js
var Code = require('code');
var expect = Code.expect;

expect(null).to.be.null();
```

##### `undefined()`

Asserts that the value is undefined.

```js
var Code = require('code');
var expect = Code.expect;

expect(undefined).to.be.undefined();
```

#### `include(values)`
`includes()`
`contain()`
`contains()`
#### `exist()`
`exists`
#### `empty()`
#### `length()`
#### `equal`
`equals`
#### `above`
`greaterThan`
#### `least`
`min`
#### `below`
`lessThan`
#### `most`
`max`
#### `within`
`range`
#### `about`
#### `instanceof`
`instanceOf`
#### `match`
`matches`
#### `satisfy`
`satisfies`
#### `throw`
`throws`
`