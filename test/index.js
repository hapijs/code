'use strict';

// Load modules

const Util = require('util');

const Hoek = require('hoek');
const Lab = require('lab');
const Code = require('..');


// Declare internals

const internals = {};


// Test shortcuts

const { describe, it } = exports.lab = Lab.script();


describe('count()', () => {

    it('returns assertion count', () => {

        Code.expect(10).to.be.above(5);
        Code.expect('abc').to.be.a.string();
        Hoek.assert(Code.count() === 2);
    });
});

describe('expect()', () => {

    it('validates assertion', () => {

        let exception = false;
        try {
            Code.expect('abcd').to.contain('a');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(!exception, exception);
    });

    it('uses grammar', () => {

        let exception = false;
        try {
            Code.expect(10).to.be.above(5);
            Code.expect('abc').to.be.a.string();
            Code.expect([1, 2]).to.be.an.array();
            Code.expect(20).to.be.at.least(20);
            Code.expect('abc').to.have.length(3);
            Code.expect('abc').to.be.a.string().and.contain(['a', 'b']);
            Code.expect(6).to.be.in.range(5, 6);
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(!exception, exception);
    });

    it('asserts on invalid condition', () => {

        let exception = false;
        try {
            Code.expect('abcd').to.contain('e');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to include \'e\'', exception);
    });

    it('asserts on invalid condition (not)', () => {

        let exception = false;
        try {
            Code.expect('abcd').to.not.contain('a');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to not include \'a\'', exception);
    });

    it('asserts on invalid condition (once)', () => {

        let exception = false;
        try {
            Code.expect('abcad').to.once.contain('a');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcad\' to include \'a\' once', exception);
    });

    it('asserts on invalid condition (with actual)', () => {

        let exception = false;
        try {
            Code.expect('abcd').to.have.length(3);
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to have a length of 3 but got 4', exception);
    });

    it('asserts on invalid condition (prefix)', () => {

        let exception = false;
        try {
            Code.expect('abcd', 'Oops').to.contain('e');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Oops: Expected \'abcd\' to include \'e\'', exception);
    });

    it('asserts on invalid condition (large array, display truncated)', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = true;
            Code.expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected [Array(18)] to be a string but got \'array\'', exception);
    });

    it('asserts on invalid condition (large array, display not truncated)', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ] to be a string but got \'array\'', exception);
    });

    it('asserts on invalid condition (large object, display truncated)', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = true;
            Code.expect({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected { Object (a, b, ...) } to be a string but got \'object\'', exception);
    });

    it('asserts on invalid condition (large object, display not truncated)', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 } to be a string but got \'object\'', exception);
    });

    it('handles multi-line error message', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect({ a: 1, b: '12345678901234567890123456789012345678901234567890' }).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;

        const lines = exception.message.split('\n');

        Hoek.assert(lines.length === 2, exception);
        Hoek.assert(lines[0].trim() === 'Expected { a: 1,', exception);
        Hoek.assert(lines[1].trim() === 'b: \'12345678901234567890123456789012345678901234567890\' } to be a string but got \'object\'', exception);
    });

    it('asserts on invalid condition (long object values, display truncated)', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = true;
            Code.expect({ a: 12345678901234567890, b: 12345678901234567890 }).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected { Object (a, b) } to be a string but got \'object\'', exception);
    });

    it('asserts on invalid condition (long object values, display not truncated)', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect({ a: 12345678901234567890, b: 12345678901234567890 }).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected { a: 12345678901234567000, b: 12345678901234567000 } to be a string but got \'object\'', exception);
    });

    it('asserts on invalid condition (long string, display truncated)', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = true;
            Code.expect('{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }').to.be.a.number();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected \'{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g...\' to be a number but got \'string\'', exception);
    });

    it('asserts on invalid condition (long string, display not truncated)', () => {

        let exception = false;
        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect('{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }').to.be.a.number();
        }
        catch (err) {
            exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected \'{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }\' to be a number but got \'string\'', exception);
    });

    it('resets flags between chained assertions', () => {

        let exception = false;
        try {

            Code.expect('abc').to.contain('a').and.to.not.contain('d');
            Code.expect('abc').to.not.contain('d').and.to.contain('a');
            Code.expect('abc').to.not.contain('d').and.to.not.contain('e');
            Code.expect('abc').to.contain('a').and.to.not.contain('d').and.to.contain('c').to.not.contain('f');
            Code.expect(() => { }).to.not.throw().and.to.be.a.function();
            Code.expect(10).to.not.be.about(8, 1).and.to.be.about(9, 1);
            Code.expect(10).to.be.about(9, 1).and.to.not.be.about(8, 1);
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(!exception, exception);
    });

    it('uses the global prototype setting when doing deep compares on objects', () => {

        const origPrototype = Code.settings.comparePrototypes;
        let exception = false;

        Code.settings.comparePrototypes = false;

        try {

            const obj = Object.create(null);
            Code.expect({}).to.equal(obj);
            obj.foo = 'bar';
            Code.expect({ foo: 'bar' }).to.equal(obj);
            Code.expect({ foo: 'bar' }).to.equal({ foo: 'bar' });
        }
        catch (err) {
            exception = err;
        }

        Code.settings.comparePrototypes = origPrototype;
        Hoek.assert(!exception, exception);
        Code.settings.comparePrototypes = true;

        try {

            const obj = Object.create(null);
            Code.expect({}).to.equal(obj);
        }
        catch (err) {
            exception = err;
        }

        Code.settings.comparePrototypes = origPrototype;
        Hoek.assert(exception.message === 'Expected {} to equal specified value: {}', exception);
    });

    describe('assertion', () => {

        describe('argument()', () => {

            it('validates correct type', () => {

                const grab = function () {

                    return arguments;
                };

                let exception = false;
                try {
                    Code.expect(grab(1, 2, 3)).to.be.arguments();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect({ 1: 1, 2: 2, 3: 3, length: 3 }).to.be.arguments();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected { \'1\': 1, \'2\': 2, \'3\': 3, length: 3 } to be an arguments but got \'object\'', exception);
            });
        });

        describe('array()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect([1]).to.be.an.array();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect({ 1: 1 }).to.be.an.array();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected { \'1\': 1 } to be an array but got \'object\'', exception);
            });
        });

        describe('boolean()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(true).to.be.a.boolean();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect(undefined).to.be.a.boolean();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected undefined to be a boolean but got \'undefined\'', exception);
            });
        });

        describe('buffer()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(new Buffer([1])).to.be.a.buffer();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect(null).to.be.a.buffer();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected null to be a buffer but got \'null\'', exception);
            });
        });

        describe('date()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(new Date()).to.be.a.date();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect(true).to.be.a.date();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected true to be a date but got \'boolean\'', exception);
            });
        });

        describe('error()', () => {

            const error = new Error('kaboom');

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(error).to.be.an.error();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (not error)', () => {

                const Custom = function () { };
                Hoek.inherits(Custom, Error);

                let exception = false;
                try {
                    Code.expect(false).to.not.be.an.error();
                    Code.expect(new Error('kaboom')).to.not.be.an.error('baboom');
                    Code.expect(new Error('kaboom')).to.not.be.an.error(Error, 'baboom');
                    Code.expect(new Error()).to.not.be.an.error(Custom);
                    Code.expect(new Error('kaboom')).to.not.be.an.error(Custom, 'baboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect(false).to.be.an.error();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected false to be an error with Error type', exception);
            });

            it('validates assertion (message)', () => {

                let exception = false;
                try {
                    Code.expect(error).to.be.an.error('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (empty message)', () => {

                let exception = false;
                try {
                    Code.expect(new Error('')).to.be.an.error('');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (message regex)', () => {

                let exception = false;
                try {
                    Code.expect(error).to.be.an.error(/boom/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (missing message)', () => {

                const Custom = function () { };
                Hoek.inherits(Custom, Error);

                let exception = false;
                try {
                    Code.expect(new Custom()).to.be.an.error('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Error] to be an error with specified message', exception);
            });


            it('invalidates assertion (empty message)', () => {

                let exception = false;
                try {
                    Code.expect(new Error('kaboom')).to.be.an.error('');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Error: kaboom] to be an error with specified message', exception);
            });

            it('validates assertion (type)', () => {

                let exception = false;
                try {
                    Code.expect(error).to.be.an.error(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (known type)', () => {

                const Custom = function () { };

                let exception = false;
                try {
                    Code.expect(new Custom()).to.be.an.error(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(/Expected (Custom )?{} to be an error with Error type/.test(exception.message), exception);
            });

            it('invalidates assertion (anonymous type)', () => {

                const Custom = function () { };
                Hoek.inherits(Custom, Error);
                delete Custom.name; // Ensure that the type is anonymous

                let exception = false;
                try {
                    Code.expect(error).to.be.an.error(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Error: kaboom] to be an error with provided type', exception);
            });

            it('validates assertion (type and message)', () => {

                let exception = false;
                try {
                    Code.expect(error).to.be.an.error(Error, 'kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });
        });

        describe('function()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.be.a.function();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect(false).to.be.a.function();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected false to be a function but got \'boolean\'', exception);
            });

            it('identifies async functions', () => {

                let exception = false;
                try {
                    Code.expect(async () => { }).to.be.a.function();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });
        });

        describe('number()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(22).to.be.a.number();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.be.a.number();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to be a number but got \'function\'', exception);
            });
        });

        describe('regexp()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(/a/).to.be.a.regexp();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect(new Date()).to.be.a.regexp();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message.match(/Expected .* to be a regexp but got 'date'/), exception);
            });
        });

        describe('string()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect('asd').to.be.a.string();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect(/a/).to.be.a.string();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected /a/ to be a string but got \'regexp\'', exception);
            });
        });

        describe('object()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect({}).to.be.a.object();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect(new Buffer([20])).to.be.an.object();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected <Buffer 14> to be an object but got \'buffer\'', exception);
            });
        });

        describe('true()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(true).to.be.true();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect('a').to.be.true();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be true', exception);
            });
        });

        describe('false()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(false).to.be.false();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect('a').to.be.false();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be false', exception);
            });
        });

        describe('null()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(null).to.be.null();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect('a').to.be.null();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be null', exception);
            });
        });

        describe('undefined()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(undefined).to.be.undefined();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates correct type (missing)', () => {

                let exception = false;
                try {
                    Code.expect().to.be.undefined();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect('a').to.be.undefined();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be undefined', exception);
            });
        });

        describe('NaN()', () => {

            it('validates correct type', () => {

                let exception = false;
                try {
                    Code.expect(NaN).to.be.NaN();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                const fail = (value) => {

                    let exception = false;

                    try {

                        Code.expect(value).to.be.NaN();
                    }
                    catch (err) {
                        exception = err;
                    }

                    Hoek.assert(exception.message === `Expected ${Util.inspect(value)} to be NaN`, exception);
                };

                fail(1);
                fail(0);
                fail(Infinity);
                fail(undefined);
                fail(null);
                fail(true);
                fail(false);
                fail('');
                fail('foo');
                fail({});
                fail([]);
            });
        });

        describe('include()', () => {

            it('validates strings', () => {

                let exception = false;
                try {
                    Code.expect('abc').to.include('ab');
                    Code.expect('abc').to.shallow.include('ab');
                    Code.expect('abc').to.only.include('abc');
                    Code.expect('abc').to.only.shallow.include('abc');
                    Code.expect('aaa').to.only.include('a');
                    Code.expect('aaa').to.only.shallow.include('a');
                    Code.expect('abc').to.once.include('b');
                    Code.expect('abc').to.once.shallow.include('b');
                    Code.expect('abc').to.include(['a', 'c']);
                    Code.expect('abc').to.shallow.include(['a', 'c']);
                    Code.expect('abc').to.part.include(['a', 'd']);
                    Code.expect('abc').to.part.shallow.include(['a', 'd']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates arrays', () => {

                let exception = false;
                try {
                    Code.expect([1, 2, 3]).to.include(1);
                    Code.expect([1, 2, 3]).to.shallow.include(1);
                    Code.expect([{ a: 1 }]).to.include({ a: 1 });
                    Code.expect([1, 2, 3]).to.include([1, 2]);
                    Code.expect([{ a: 1 }]).to.include([{ a: 1 }]);
                    Code.expect([1, 1, 2]).to.only.include([1, 2]);
                    Code.expect([1, 2]).to.once.include([1, 2]);
                    Code.expect([1, 2, 3]).to.part.include([1, 4]);
                    Code.expect([[1], [2]]).to.include([[1]]);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates array with only a partial object value', () => {

                let exception = false;
                try {
                    Code.expect([{ a: 1, b: 1 }]).to.include({ a: 1 });
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [ { a: 1, b: 1 } ] to include { a: 1 }', exception);
            });

            it('invalidates arrays (shallow)', () => {

                let exception = false;
                try {
                    Code.expect([{ a: 1 }]).to.shallow.include({ a: 1 });
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [ { a: 1 } ] to include { a: 1 }', exception);
            });

            it('validates objects', () => {

                let exception = false;
                try {
                    Code.expect({ a: 1, b: 2, c: 3 }).to.include('a');
                    Code.expect({ a: 1, b: 2, c: 3 }).to.shallow.include('a');
                    Code.expect({ a: 1, b: 2, c: 3 }).to.include(['a', 'c']);
                    Code.expect({ a: 1, b: 2, c: 3 }).to.only.include(['a', 'b', 'c']);
                    Code.expect({ a: 1, b: 2, c: 3 }).to.include({ a: 1 });
                    Code.expect({ a: 1, b: 2, c: 3 }).to.include({ a: 1, c: 3 });
                    Code.expect({ a: 1, b: 2, c: 3 }).to.part.include({ a: 1, d: 4 });
                    Code.expect({ a: 1, b: 2, c: 3 }).to.only.include({ a: 1, b: 2, c: 3 });
                    Code.expect({ a: [1], b: [2], c: [3] }).to.include({ a: [1], c: [3] });
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates objects (shallow)', () => {

                let exception = false;
                try {
                    Code.expect({ a: [1] }).to.shallow.include({ a: [1] });
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected { a: [ 1 ] } to include { a: [ 1 ] }', exception);
            });

            it('validates aliases', () => {

                let exception = false;
                try {
                    Code.expect('abc').to.includes('ab');
                    Code.expect('abc').to.only.contain('abc');
                    Code.expect('aaa').to.only.contains('a');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('asserts called with only one argument', () => {

                {
                    let exception = false;
                    try {
                        Code.expect('abc').to.include();
                    }
                    catch (err) {
                        exception = err;
                    }
                    Hoek.assert(exception.message === 'Can only assert include with a single parameter', exception);
                }

                {
                    let exception = false;
                    try {
                        Code.expect('abc').to.include('a', 'b');
                    }
                    catch (err) {
                        exception = err;
                    }

                    Hoek.assert(exception.message === 'Can only assert include with a single parameter', exception);
                }

            });

        });

        describe('endWith()', () => {

            it('validates strings', () => {

                let exception = false;
                try {
                    Code.expect('http://xyz.abc/def').to.endWith('abc/def');
                    Code.expect('abcdefgh').not.to.endWith('abc');
                    Code.expect('foobar').not.to.endWith('not-long-enough');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('does not validate arrays', () => {

                let exception = false;
                try {
                    Code.expect(['a', 'b', 'c']).to.endWith('abcdef');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert endsWith on a string, with a string', exception);
            });

            it('does not validate using arrays', () => {

                let exception = false;
                try {
                    Code.expect('abcdef').to.endWith(['a', 'b', 'c']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert endsWith on a string, with a string', exception);
            });

        });

        describe('startWith()', () => {

            it('validates strings', () => {

                let exception = false;
                try {
                    Code.expect('http://xyz.abc/def').to.startWith('http://');
                    Code.expect('eeeaaaeee').to.startWith('eee');
                    Code.expect('eeeaaaeee').not.to.startWith('aaa');
                    Code.expect('http://xyz.abc/def').not.to.startWith('https://');
                    Code.expect('abcdefgh').not.to.startWith('fgh');
                    Code.expect('foobar').not.to.startWith('not-long-enough');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('does not validate arrays', () => {

                let exception = false;
                try {
                    Code.expect(['a', 'b', 'c']).to.startWith('abcdef');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert startsWith on a string, with a string', exception);
            });

            it('does not validate using arrays', () => {

                let exception = false;
                try {
                    Code.expect('abcdef').to.startWith(['a', 'b', 'c']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert startsWith on a string, with a string', exception);
            });

        });

        describe('exist()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect('a').to.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (null)', () => {

                let exception = false;
                try {
                    Code.expect(null).to.be.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected null to exist', exception);
            });

            it('invalidates assertion (undefined)', () => {

                let exception = false;
                try {
                    Code.expect(undefined).to.be.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected undefined to exist', exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect('a').exists();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (not error)', () => {

                const failed = new Error('some message');           // Create error on a different line than where the assertion is

                let exception = false;
                try {
                    Code.expect(failed).to.not.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'some message', exception);
                Hoek.assert(exception.at.line !== Code.thrownAt(failed).line, 'Reports the wrong line number');
            });
        });

        describe('empty()', () => {

            it('validates string', () => {

                let exception = false;
                try {
                    Code.expect('').to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates buffer', () => {

                let exception = false;
                try {
                    Code.expect(new Buffer('')).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates array', () => {

                let exception = false;
                try {
                    Code.expect([]).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates object', () => {

                let exception = false;
                try {
                    Code.expect({}).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect('a').to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be empty', exception);
            });
        });

        describe('length()', () => {

            it('validates string', () => {

                let exception = false;
                try {
                    Code.expect('a').to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates buffer', () => {

                let exception = false;
                try {
                    Code.expect(new Buffer('a')).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates array', () => {

                let exception = false;
                try {
                    Code.expect([1]).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates object', () => {

                let exception = false;
                try {
                    Code.expect({ a: 10 }).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                let exception = false;
                try {
                    Code.expect('a').to.have.length(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to have a length of 10 but got 1', exception);
            });

            it('throws on length check on objects with no length property', (done) => {

                let exception = false;
                try {
                    Code.expect(null).to.have.length(2);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert length on object, array or string', exception);
                done();
            });
        });

        describe('equal()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect('abc').to.equal('abc');
                    Code.expect(['abc']).to.equal(['abc']);
                    Code.expect({ a: 1 }).to.equal({ a: 1 });
                    Code.expect({}).to.not.equal({ a: 1 });
                    Code.expect({ a: 1 }).to.not.equal({});
                    Code.expect(Object.create(null)).to.not.equal({}, { prototype: true });
                    Code.expect(Object.create(null)).to.equal({}, { prototype: false });
                    Code.expect(Object.create(null)).to.equal({});
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect('abc').equals('abc');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect({ foo: 1 }).to.equal({ foo: 2 });
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected { foo: 1 } to equal specified value: { foo: 2 }', exception);
            });

            it('validates assertion (shallow)', () => {

                let exception = false;
                try {
                    const foo = { bar: 'baz' };

                    Code.expect('a').to.shallow.equal('a');
                    Code.expect(1).to.shallow.equal(1);
                    Code.expect(foo).to.shallow.equal(foo);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (shallow)', () => {

                let exception = false;
                try {
                    Code.expect(['a']).to.shallow.equal(['a']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [ \'a\' ] to equal specified value: [ \'a\' ]', exception);
            });

            it('prints the specified value', () => {

                let exception = false;
                try {
                    Code.expect('test').to.equal('junk');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'test\' to equal specified value: \'junk\'', exception);
            });
        });

        describe('above()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.above(5);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect(1).to.be.greaterThan(0);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.above(50);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be above 50', exception);
            });
        });

        describe('least()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.at.least(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.min(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.at.least(20);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be at least 20', exception);
            });
        });

        describe('below()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(1).to.be.below(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect(1).to.be.lessThan(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect(1).to.be.below(0);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 1 to be below 0', exception);
            });
        });

        describe('most()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.at.most(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.max(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect(100).to.be.at.most(20);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 100 to be at most 20', exception);
            });
        });

        describe('within()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(5).to.be.within(0, 10);
                    Code.expect(0).to.be.within(0, 10);
                    Code.expect(10).to.be.within(0, 10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect(5).to.be.in.range(0, 10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (over)', () => {

                let exception = false;
                try {
                    Code.expect(5).to.be.within(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 5 to be within 0..4', exception);
            });

            it('invalidates assertion (under)', () => {

                let exception = false;
                try {
                    Code.expect(-1).to.be.within(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected -1 to be within 0..4', exception);
            });
        });

        describe('between()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(5).to.be.between(0, 10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (over)', () => {

                let exception = false;
                try {
                    Code.expect(4).to.be.between(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 4 to be between 0..4', exception);
            });

            it('invalidates assertion (under)', () => {

                let exception = false;
                try {
                    Code.expect(0).to.be.between(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 0 to be between 0..4', exception);
            });
        });

        describe('about()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.about(8, 2);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.about(8, 1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be about 8 \u00b11', exception);
            });

            it('invalidates assertion (invalid arguments)', () => {

                let exception = false;
                try {
                    Code.expect(10).to.be.about('8', '1');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'About assertion requires two number arguments', exception);
            });
        });

        describe('instanceof()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(new Date()).to.be.instanceof(Date);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect(new Date()).to.be.instanceOf(Date);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect([]).to.be.instanceof(RegExp);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of RegExp', exception);
            });

            it('invalidates assertion (anonymous)', () => {

                const Custom = function () { };
                delete Custom.name; // Ensure that the type is anonymous

                let exception = false;
                try {
                    Code.expect([]).to.be.instanceof(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of provided type', exception);
            });

            it('invalidates assertion (anonymous)', () => {

                function Custom() { }           /* eslint func-style:0 */

                let exception = false;
                try {
                    Code.expect([]).to.be.instanceof(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of Custom', exception);
            });
        });

        describe('match()', () => {

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect('a4x').to.match(/\w\dx/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect('a4x').matches(/\w\dx/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect('a4x').to.match(/\w\dy/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a4x\' to match /\\w\\dy/', exception);
            });
        });

        describe('satisfy()', () => {

            const validate = function (value) {

                return value === 'some value';
            };

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect('some value').to.satisfy(validate);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect('some value').satisfies(validate);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect('wrong').to.satisfy(validate);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'wrong\' to satisfy rule', exception);
            });
        });

        describe('throw()', () => {

            const throws = function () {

                throw new Error('kaboom');
            };

            it('validates assertion', () => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                let exception = false;
                try {
                    Code.expect(throws).throws();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.throw();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error', exception);
            });

            it('forbids arguments on negative assertion', () => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.not.throw('message');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Cannot specify arguments when expecting not to throw', exception);
            });

            it('validates assertion (message)', () => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (empty message)', () => {

                let exception = false;
                try {
                    Code.expect(() => {

                        throw new Error('');
                    }).to.throw('');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (message regex)', () => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw(/boom/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (missing message)', () => {

                const Custom = function () { };

                let exception = false;
                try {
                    Code.expect(() => {

                        throw new Custom();
                    }).to.throw('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error with specified message', exception);
            });

            it('invalidates assertion (message)', () => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.throw('steve');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error', exception);
            });

            it('invalidates assertion (empty message)', () => {

                let exception = false;
                try {
                    Code.expect(() => {

                        throw new Error('kaboom');
                    }).to.throw('');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error with specified message', exception);
            });

            it('validates assertion (type)', () => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (known type)', () => {

                const Custom = function () { };

                let exception = false;
                try {
                    Code.expect(() => {

                        throw new Custom();
                    }).to.throw(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw Error', exception);
            });

            it('invalidates assertion (anonymous type)', () => {

                const Custom = function () { };
                delete Custom.name; // Ensure that the type is anonymous

                let exception = false;
                try {
                    Code.expect(throws).to.throw(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(/Expected \[Function(: throws)?\] to throw provided type/.test(exception.message), exception);
            });

            it('validates assertion (type and message)', () => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw(Error, 'kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });
        });

        describe('reject()', () => {

            it('validates rejection', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates resolution', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.resolve(3)).to.not.reject();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates rejection', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.resolve(3)).to.reject();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with an error', exception);
            });

            it('validates rejection (alias)', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).rejects();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates rejection (not a promise)', async () => {

                let exception = false;
                try {
                    await Code.expect(() => { }).to.reject();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert reject on promises', exception);
            });

            it('forbids arguments on negative rejection', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.not.reject('message');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Cannot specify arguments when expecting not to reject', exception);
            });

            it('validates rejection (message)', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates rejection (empty message)', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error(''))).to.reject('');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates rejection (message regex)', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject(/boom/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates rejection (missing message)', async () => {

                const Custom = function () { };

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Custom())).to.reject('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with an error with specified message', exception);
            });

            it('invalidates rejection (message)', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject('steve');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with an error with specified message', exception);
            });

            it('invalidates rejection (empty message)', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.rejects('');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with an error with specified message', exception);
            });

            it('validates rejection (type)', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates rejection (known type)', async () => {

                const Custom = function () { };

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Custom())).to.reject(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with Error', exception);
            });

            it('invalidates rejection (anonymous type)', async () => {

                const Custom = function () { };
                delete Custom.name; // Ensure that the type is anonymous

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(/Expected \[Promise\] to reject with provided type/.test(exception.message), exception);
            });

            it('validates rejection (type and message)', async () => {

                let exception = false;
                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject(Error, 'kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('returns rejection error', async () => {

                const Custom = function () { };
                delete Custom.name; // Ensure that the type is anonymous

                let exception = false;
                try {
                    const err = await Code.expect(Promise.reject(new Error('kaboom'))).to.reject();
                    Code.expect(err).to.be.an.error('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
            });
        });
    });
});

describe('fail', () => {

    it('trigger failure', () => {

        let exception = false;
        try {
            Code.fail('Something wrong happened!');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Something wrong happened!', exception);
    });

    it('trigger failure only once', () => {

        let exception = false;
        try {
            Code.fail('Final Failure');
            Code.fail('FAIL AGAIN');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Final Failure', exception);
    });

});

describe('incomplete()', () => {

    it('keeps track of incomplete assertions', () => {

        const a = Code.expect(1).to;
        Code.expect(2).to.equal(2);
        Hoek.assert(Code.incomplete().length === 1);
        a.equal(1);
        Hoek.assert(!Code.incomplete());
    });
});

describe('thrownAt()', () => {

    it('handles error with missing stack', () => {

        const failed = new Error('foo');
        failed.stack = undefined;
        const at = Code.thrownAt(failed);

        Hoek.assert(at === undefined, 'Reports the wrong at information');
    });
});
