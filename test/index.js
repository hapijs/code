'use strict';


const Util = require('util');

const Hoek = require('@hapi/hoek');
const Lab = require('@hapi/lab');
const Code = require('..');


const internals = {};


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

        try {
            Code.expect('abcd').to.contain('a');
        }
        catch (err) {
            var exception = err;
        }

        Hoek.assert(!exception, exception);
    });

    it('uses grammar', () => {

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
            var exception = err;
        }

        Hoek.assert(!exception, exception);
    });

    it('asserts on invalid condition', () => {

        try {
            Code.expect('abcd').to.contain('e');
        }
        catch (err) {
            var exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to include \'e\'', exception);
    });

    it('asserts on invalid condition (not)', () => {

        try {
            Code.expect('abcd').to.not.contain('a');
        }
        catch (err) {
            var exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to not include \'a\'', exception);
    });

    it('asserts on invalid condition (once)', () => {

        try {
            Code.expect('abcad').to.once.contain('a');
        }
        catch (err) {
            var exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcad\' to include \'a\' once', exception);
    });

    it('asserts on invalid condition (with actual)', () => {

        try {
            Code.expect('abcd').to.have.length(3);
        }
        catch (err) {
            var exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to have a length of 3 but got 4', exception);
    });

    it('asserts on invalid condition (prefix)', () => {

        try {
            Code.expect('abcd', 'Oops').to.contain('e');
        }
        catch (err) {
            var exception = err;
        }

        Hoek.assert(exception.message === 'Oops: Expected \'abcd\' to include \'e\'', exception);
    });

    it('asserts on invalid condition (large array, display truncated)', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = true;
            Code.expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]).to.be.a.string();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected [Array(18)] to be a string but got \'array\'', exception);
    });

    it('asserts on invalid condition (large array, display not truncated)', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]).to.be.a.string();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        const message = exception.message.replace(/\n/g, '').replace(/ {2,}/g, ' ').replace(/8]/, '8 ]');
        Hoek.assert(message === 'Expected [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ] to be a string but got \'array\'', exception);
    });

    it('asserts on invalid condition (large object, display truncated)', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = true;
            Code.expect({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }).to.be.a.string();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected { Object (a, b, ...) } to be a string but got \'object\'', exception);
    });

    it('asserts on invalid condition (large object, display not truncated)', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }).to.be.a.string();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 } to be a string but got \'object\'', exception);
    });

    it('handles multi-line error message', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect({ a: 1, b: '12345678901234567890123456789012345678901234567890' }).to.be.a.string();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;

        const message = exception.message.replace(/\n/g, '').replace(/ {2,}/g, ' ');
        Hoek.assert(message === `Expected { a: 1, b: '12345678901234567890123456789012345678901234567890' } to be a string but got 'object'`, exception);
    });

    it('asserts on invalid condition (long object values, display truncated)', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = true;
            Code.expect({ a: 12345678901234567890, b: 12345678901234567890 }).to.be.a.string();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected { Object (a, b) } to be a string but got \'object\'', exception);
    });

    it('asserts on invalid condition (long object values, display not truncated)', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect({ a: 12345678901234567890, b: 12345678901234567890 }).to.be.a.string();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected { a: 12345678901234567000, b: 12345678901234567000 } to be a string but got \'object\'', exception);
    });

    it('asserts on invalid condition (long string, display truncated)', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = true;
            Code.expect('{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }').to.be.a.number();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected \'{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g...\' to be a number but got \'string\'', exception);
    });

    it('asserts on invalid condition (long string, display not truncated)', () => {

        const origTruncate = Code.settings.truncateMessages;
        try {
            Code.settings.truncateMessages = false;
            Code.expect('{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }').to.be.a.number();
        }
        catch (err) {
            var exception = err;
        }

        Code.settings.truncateMessages = origTruncate;
        Hoek.assert(exception.message === 'Expected \'{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }\' to be a number but got \'string\'', exception);
    });

    it('resets flags between chained assertions', () => {

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
            var exception = err;
        }

        Hoek.assert(!exception, exception);
    });

    it('uses the global prototype setting when doing deep compares on objects', () => {

        const origPrototype = Code.settings.comparePrototypes;

        Code.settings.comparePrototypes = false;

        try {

            const obj = Object.create(null);
            Code.expect({}).to.equal(obj);
            obj.foo = 'bar';
            Code.expect({ foo: 'bar' }).to.equal(obj);
            Code.expect({ foo: 'bar' }).to.equal({ foo: 'bar' });
        }
        catch (err) {
            var exception1 = err;
        }

        Code.settings.comparePrototypes = origPrototype;
        Hoek.assert(!exception1, exception1);
        Code.settings.comparePrototypes = true;

        try {
            const obj = Object.create(null);
            Code.expect({}).to.equal(obj);
        }
        catch (err) {
            var exception2 = err;
        }

        Code.settings.comparePrototypes = origPrototype;
        Hoek.assert(exception2.message === `Expected {} to equal specified value: ${Util.format(Object.create(null))}`, exception2);
    });

    describe('assertion', () => {

        describe('argument()', () => {

            it('validates correct type', () => {

                const grab = function () {

                    return arguments;   // eslint-disable-line prefer-rest-params
                };

                try {
                    Code.expect(grab(1, 2, 3)).to.be.arguments();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect({ 1: 1, 2: 2, 3: 3, length: 3 }).to.be.arguments();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected { \'1\': 1, \'2\': 2, \'3\': 3, length: 3 } to be an arguments but got \'object\'', exception);
            });
        });

        describe('array()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect([1]).to.be.an.array();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect({ 1: 1 }).to.be.an.array();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected { \'1\': 1 } to be an array but got \'object\'', exception);
            });
        });

        describe('boolean()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(true).to.be.a.boolean();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect(undefined).to.be.a.boolean();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected undefined to be a boolean but got \'undefined\'', exception);
            });
        });

        describe('buffer()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(Buffer.from([1])).to.be.a.buffer();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect(null).to.be.a.buffer();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected null to be a buffer but got \'null\'', exception);
            });
        });

        describe('date()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(new Date()).to.be.a.date();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect(true).to.be.a.date();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected true to be a date but got \'boolean\'', exception);
            });
        });

        describe('error()', () => {

            const error = new Error('kaboom');

            it('validates assertion', () => {

                try {
                    Code.expect(error).to.be.an.error();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (not error)', () => {

                const Custom = class extends Error { };

                try {
                    Code.expect(false).to.not.be.an.error();
                    Code.expect(new Error('kaboom')).to.not.be.an.error('baboom');
                    Code.expect(new Error('kaboom')).to.not.be.an.error(Error, 'baboom');
                    Code.expect(new Error()).to.not.be.an.error(Custom);
                    Code.expect(new Error('kaboom')).to.not.be.an.error(Custom, 'baboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect(false).to.be.an.error();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected false to be an error with Error type', exception);
            });

            it('validates assertion (message)', () => {

                try {
                    Code.expect(error).to.be.an.error('kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (empty message)', () => {

                try {
                    Code.expect(new Error('')).to.be.an.error('');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (message regex)', () => {

                try {
                    Code.expect(error).to.be.an.error(/boom/);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (missing message)', () => {

                const Custom = class extends Error { };

                try {
                    Code.expect(new Custom()).to.be.an.error('kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Error] to be an error with specified message', exception);
            });


            it('invalidates assertion (empty message)', () => {

                try {
                    Code.expect(new Error('kaboom')).to.be.an.error('');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Error: kaboom] to be an error with specified message', exception);
            });

            it('validates assertion (type)', () => {

                try {
                    Code.expect(error).to.be.an.error(Error);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (known type)', () => {

                const Custom = function () { };

                try {
                    Code.expect(new Custom()).to.be.an.error(Error);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(/Expected (Custom )?{} to be an error with Error type/.test(exception.message), exception);
            });

            it('invalidates assertion (anonymous type)', () => {

                const Custom = class extends Error {
                    static name = undefined; // Ensure that the type is anonymous
                };

                try {
                    Code.expect(error).to.be.an.error(Custom);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Error: kaboom] to be an error with provided type', exception);
            });

            it('validates assertion (type and message)', () => {

                try {
                    Code.expect(error).to.be.an.error(Error, 'kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });
        });

        describe('function()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(() => { }).to.be.a.function();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect(false).to.be.a.function();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected false to be a function but got \'boolean\'', exception);
            });

            it('identifies async functions', () => {

                try {
                    Code.expect(async () => { }).to.be.a.function();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });
        });

        describe('number()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(22).to.be.a.number();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect(() => { }).to.be.a.number();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to be a number but got \'function\'', exception);
            });
        });

        describe('regexp()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(/a/).to.be.a.regexp();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect(new Date()).to.be.a.regexp();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message.match(/Expected .* to be a regexp but got 'date'/), exception);
            });
        });

        describe('string()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect('asd').to.be.a.string();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect(/a/).to.be.a.string();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected /a/ to be a string but got \'regexp\'', exception);
            });
        });

        describe('object()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect({}).to.be.a.object();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect(Buffer.from([20])).to.be.an.object();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected <Buffer 14> to be an object but got \'buffer\'', exception);
            });
        });

        describe('true()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(true).to.be.true();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect('a').to.be.true();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be true', exception);
            });
        });

        describe('false()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(false).to.be.false();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect('a').to.be.false();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be false', exception);
            });
        });

        describe('null()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(null).to.be.null();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect('a').to.be.null();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be null', exception);
            });
        });

        describe('undefined()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(undefined).to.be.undefined();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates correct type (missing)', () => {

                try {
                    Code.expect().to.be.undefined();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect('a').to.be.undefined();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be undefined', exception);
            });
        });

        describe('NaN()', () => {

            it('validates correct type', () => {

                try {
                    Code.expect(NaN).to.be.NaN();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                const fail = (value) => {

                    try {
                        Code.expect(value).to.be.NaN();
                    }
                    catch (err) {
                        var exception = err;
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
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates arrays', () => {

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
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates array with only a partial object value', () => {

                try {
                    Code.expect([{ a: 1, b: 1 }]).to.include({ a: 1 });
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [ { a: 1, b: 1 } ] to include { a: 1 }', exception);
            });

            it('invalidates arrays (shallow)', () => {

                try {
                    Code.expect([{ a: 1 }]).to.shallow.include({ a: 1 });
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [ { a: 1 } ] to include { a: 1 }', exception);
            });

            it('validates objects', () => {

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
                    Code.expect({ a: 1, b: { c: 3, d: 4 } }).to.part.include({ b: { c: 3 } });
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates objects (shallow)', () => {

                try {
                    Code.expect({ a: [1] }).to.shallow.include({ a: [1] });
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected { a: [ 1 ] } to include { a: [ 1 ] }', exception);
            });

            it('validates aliases', () => {

                try {
                    Code.expect('abc').to.includes('ab');
                    Code.expect('abc').to.only.contain('abc');
                    Code.expect('aaa').to.only.contains('a');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('asserts called with only one argument', () => {

                try {
                    Code.expect('abc').to.include();
                }
                catch (err) {
                    var exception1 = err;
                }

                Hoek.assert(exception1.message === 'Can only assert include with a single parameter', exception1);

                try {
                    Code.expect('abc').to.include('a', 'b');
                }
                catch (err) {
                    var exception2 = err;
                }

                Hoek.assert(exception2.message === 'Can only assert include with a single parameter', exception2);
            });

        });

        describe('endWith()', () => {

            it('validates strings', () => {

                try {
                    Code.expect('http://xyz.abc/def').to.endWith('abc/def');
                    Code.expect('abcdefgh').not.to.endWith('abc');
                    Code.expect('foobar').not.to.endWith('not-long-enough');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('does not validate arrays', () => {

                try {
                    Code.expect(['a', 'b', 'c']).to.endWith('abcdef');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert endsWith on a string, with a string', exception);
            });

            it('does not validate using arrays', () => {

                try {
                    Code.expect('abcdef').to.endWith(['a', 'b', 'c']);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert endsWith on a string, with a string', exception);
            });

        });

        describe('startWith()', () => {

            it('validates strings', () => {

                try {
                    Code.expect('http://xyz.abc/def').to.startWith('http://');
                    Code.expect('eeeaaaeee').to.startWith('eee');
                    Code.expect('eeeaaaeee').not.to.startWith('aaa');
                    Code.expect('http://xyz.abc/def').not.to.startWith('https://');
                    Code.expect('abcdefgh').not.to.startWith('fgh');
                    Code.expect('foobar').not.to.startWith('not-long-enough');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('does not validate arrays', () => {

                try {
                    Code.expect(['a', 'b', 'c']).to.startWith('abcdef');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert startsWith on a string, with a string', exception);
            });

            it('does not validate using arrays', () => {

                try {
                    Code.expect('abcdef').to.startWith(['a', 'b', 'c']);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert startsWith on a string, with a string', exception);
            });

        });

        describe('exist()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect('a').to.exist();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (null)', () => {

                try {
                    Code.expect(null).to.be.exist();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected null to exist', exception);
            });

            it('invalidates assertion (undefined)', () => {

                try {
                    Code.expect(undefined).to.be.exist();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected undefined to exist', exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect('a').exists();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (not error)', () => {

                const failed = new Error('some message');           // Create error on a different line than where the assertion is

                try {
                    Code.expect(failed).to.not.exist();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'some message', exception);
                Hoek.assert(exception.at.line !== Code.thrownAt(failed).line, 'Reports the wrong line number');
                Hoek.assert(exception.at.filename === __filename, `expected ${exception.at.filename} to equal ${__filename}`);
            });

            it('validates assertion (error)', () => {

                try {
                    Code.expect({}).to.not.exist();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected {} to not exist', exception);
                Hoek.assert(exception.actual === undefined, exception);
                Hoek.assert(exception.expected === undefined, exception);
                Hoek.assert(exception.at.filename === __filename, `expected ${exception.at.filename} to equal ${__filename}`);
            });
        });

        describe('empty()', () => {

            it('validates string', () => {

                try {
                    Code.expect('').to.be.empty();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates buffer', () => {

                try {
                    Code.expect(Buffer.from('')).to.be.empty();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates array', () => {

                try {
                    Code.expect([]).to.be.empty();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates object', () => {

                try {
                    Code.expect({}).to.be.empty();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect('a').to.be.empty();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be empty', exception);
            });
        });

        describe('length()', () => {

            it('validates string', () => {

                try {
                    Code.expect('a').to.have.length(1);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates buffer', () => {

                try {
                    Code.expect(Buffer.from('a')).to.have.length(1);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates array', () => {

                try {
                    Code.expect([1]).to.have.length(1);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates object', () => {

                try {
                    Code.expect({ a: 10 }).to.have.length(1);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates incorrect type', () => {

                try {
                    Code.expect('a').to.have.length(10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to have a length of 10 but got 1', exception);
            });

            it('throws on length check on objects with no length property', () => {

                try {
                    Code.expect(null).to.have.length(2);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert length on object, array or string', exception);
            });
        });

        describe('equal()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect('abc').to.equal('abc');
                    Code.expect(['abc']).to.equal(['abc']);
                    Code.expect({ a: 1 }).to.equal({ a: 1 });
                    Code.expect({}).to.not.equal({ a: 1 });
                    Code.expect({ a: 1 }).to.not.equal({});
                    Code.expect(Object.create(null)).to.not.equal({}, { prototype: true });
                    Code.expect(Object.create(null)).to.equal({}, { prototype: false });
                    Code.expect(Object.create(null)).to.equal({});
                    Code.expect({ a: 1, b: 2 }).to.equal({ a: 1, b: 3 }, { skip: ['b'] });

                    const f1 = () => { };
                    const f1a = () => { };
                    Code.expect({ f1 }).to.equal({ f1: f1a });
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect('abc').equals('abc');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect({ foo: 1 }).to.equal({ foo: 2 });
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected { foo: 1 } to equal specified value: { foo: 2 }', exception);
            });

            it('validates assertion (shallow)', () => {

                try {
                    const foo = { bar: 'baz' };

                    Code.expect('a').to.shallow.equal('a');
                    Code.expect(1).to.shallow.equal(1);
                    Code.expect(foo).to.shallow.equal(foo);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (shallow)', () => {

                try {
                    Code.expect(['a']).to.shallow.equal(['a']);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [ \'a\' ] to equal specified value: [ \'a\' ]', exception);
            });

            it('prints the specified value', () => {

                try {
                    Code.expect('test').to.equal('junk');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'test\' to equal specified value: \'junk\'', exception);
            });
        });

        describe('above()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect(10).to.be.above(5);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect(1).to.be.greaterThan(0);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect(10).to.be.above(50);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be above 50', exception);
            });
        });

        describe('least()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect(10).to.be.at.least(10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect(10).to.be.min(10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect(10).to.be.at.least(20);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be at least 20', exception);
            });
        });

        describe('below()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect(1).to.be.below(10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect(1).to.be.lessThan(10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect(1).to.be.below(0);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected 1 to be below 0', exception);
            });
        });

        describe('most()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect(10).to.be.at.most(10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect(10).to.be.max(10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect(100).to.be.at.most(20);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected 100 to be at most 20', exception);
            });
        });

        describe('within()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect(5).to.be.within(0, 10);
                    Code.expect(0).to.be.within(0, 10);
                    Code.expect(10).to.be.within(0, 10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect(5).to.be.in.range(0, 10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (over)', () => {

                try {
                    Code.expect(5).to.be.within(0, 4);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected 5 to be within 0..4', exception);
            });

            it('invalidates assertion (under)', () => {

                try {
                    Code.expect(-1).to.be.within(0, 4);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected -1 to be within 0..4', exception);
            });
        });

        describe('between()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect(5).to.be.between(0, 10);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (over)', () => {

                try {
                    Code.expect(4).to.be.between(0, 4);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected 4 to be between 0..4', exception);
            });

            it('invalidates assertion (under)', () => {

                try {
                    Code.expect(0).to.be.between(0, 4);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected 0 to be between 0..4', exception);
            });
        });

        describe('about()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect(10).to.be.about(8, 2);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect(10).to.be.about(8, 1);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be about 8 \u00b11', exception);
            });

            it('invalidates assertion (invalid arguments)', () => {

                try {
                    Code.expect(10).to.be.about('8', '1');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'About assertion requires two number arguments', exception);
            });
        });

        describe('instanceof()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect(new Date()).to.be.instanceof(Date);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect(new Date()).to.be.instanceOf(Date);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect([]).to.be.instanceof(RegExp);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of RegExp', exception);
            });

            it('invalidates assertion (anonymous)', () => {

                const Custom = function () { };
                delete Custom.name; // Ensure that the type is anonymous

                try {
                    Code.expect([]).to.be.instanceof(Custom);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of provided type', exception);
            });

            it('invalidates assertion (anonymous)', () => {

                function Custom() { }           /* eslint func-style:0 */

                try {
                    Code.expect([]).to.be.instanceof(Custom);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of Custom', exception);
            });
        });

        describe('match()', () => {

            it('validates assertion', () => {

                try {
                    Code.expect('a4x').to.match(/\w\dx/);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect('a4x').matches(/\w\dx/);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect('a4x').to.match(/\w\dy/);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a4x\' to match /\\w\\dy/', exception);
            });
        });

        describe('satisfy()', () => {

            const validate = function (value) {

                return value === 'some value';
            };

            it('validates assertion', () => {

                try {
                    Code.expect('some value').to.satisfy(validate);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect('some value').satisfies(validate);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect('wrong').to.satisfy(validate);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'wrong\' to satisfy rule', exception);
            });
        });

        describe('throw()', () => {

            const throws = function () {

                throw Object.assign(new Error('kaboom'), { code: 123 });
            };

            it('validates assertion', () => {

                try {
                    var thrown = Code.expect(throws).to.throw();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
                Hoek.assert(thrown.code === 123, thrown);
            });

            it('validates assertion (alias)', () => {

                try {
                    Code.expect(throws).throws();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion', () => {

                try {
                    Code.expect(() => { }).to.throw();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error', exception);
            });

            it('forbids arguments on negative assertion', () => {

                try {
                    Code.expect(() => { }).to.not.throw('message');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Cannot specify arguments when expecting not to throw', exception);
            });

            it('validates assertion (message)', () => {

                try {
                    Code.expect(throws).to.throw('kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (empty message)', () => {

                try {
                    Code.expect(() => {

                        throw new Error('');
                    }).to.throw('');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (message regex)', () => {

                try {
                    Code.expect(throws).to.throw(/boom/);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates assertion (missing message)', () => {

                const Custom = function () { };

                try {
                    Code.expect(() => {

                        throw new Custom();
                    }).to.throw('kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error with specified message', exception);
            });

            it('invalidates assertion (message)', () => {

                try {
                    Code.expect(() => { }).to.throw('steve');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error', exception);
            });

            it('invalidates assertion (empty message)', () => {

                try {
                    Code.expect(() => {

                        throw new Error('kaboom');
                    }).to.throw('');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error with specified message', exception);
            });

            it('validates assertion (type)', () => {

                try {
                    Code.expect(throws).to.throw(Error);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates assertion (known type)', () => {

                const Custom = function () { };

                try {
                    Code.expect(() => {

                        throw new Custom();
                    }).to.throw(Error);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw Error', exception);
            });

            it('invalidates assertion (anonymous type)', () => {

                const Custom = function () { };
                delete Custom.name; // Ensure that the type is anonymous

                try {
                    Code.expect(throws).to.throw(Custom);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(/Expected \[Function(: throws)?\] to throw provided type/.test(exception.message), exception);
            });

            it('validates assertion (type and message)', () => {

                try {
                    Code.expect(throws).to.throw(Error, 'kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });
        });

        describe('reject()', () => {

            it('validates rejection', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates resolution', async () => {

                try {
                    await Code.expect(Promise.resolve(3)).to.not.reject();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates rejection', async () => {

                try {
                    await Code.expect(Promise.resolve(3)).to.reject();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with an error', exception);
            });

            it('validates rejection (alias)', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).rejects();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates rejection (not a promise)', async () => {

                try {
                    await Code.expect(() => { }).to.reject();
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert reject on promises', exception);
            });

            it('forbids arguments on negative rejection', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.not.reject('message');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Cannot specify arguments when expecting not to reject', exception);
            });

            it('validates rejection (message)', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject('kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates rejection (empty message)', async () => {

                try {
                    await Code.expect(Promise.reject(new Error(''))).to.reject('');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates rejection (message regex)', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject(/boom/);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('validates rejection (missing message)', async () => {

                const Custom = function () { };

                try {
                    var expectedLineNumber = Number(new Error().stack.match(/:(\d+)/)[1]) + 1;
                    await Code.expect(Promise.reject(new Custom())).to.reject('kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with an error with specified message', exception);
                Hoek.assert(Number(exception.at.line) === expectedLineNumber, `expected ${expectedLineNumber}, got ${exception.at.line}`);
                Hoek.assert(exception.at.filename === __filename, `expected ${exception.at.filename} to equal ${__filename}`);
            });

            it('invalidates rejection (message)', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject('steve');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with an error with specified message', exception);
            });

            it('invalidates rejection (empty message)', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.rejects('');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with an error with specified message', exception);
            });

            it('validates rejection (type)', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject(Error);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('invalidates rejection (known type)', async () => {

                const Custom = function () { };

                try {
                    await Code.expect(Promise.reject(new Custom())).to.reject(Error);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Promise] to reject with Error', exception);
            });

            it('invalidates rejection (anonymous type)', async () => {

                const Custom = function () { };
                delete Custom.name; // Ensure that the type is anonymous

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject(Custom);
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(/Expected \[Promise\] to reject with provided type/.test(exception.message), exception);
            });

            it('invalidates rejection (invalid type)', async () => {

                const promise = Promise.reject(new Error('kaboom'));

                const fail = async (value) => {

                    try {
                        await Code.expect(promise).to.reject(value);
                    }
                    catch (err) {
                        var exception = err;
                    }

                    Hoek.assert(exception.message === 'Can not assert with invalid type argument', exception);
                };

                await fail(0);
                await fail(1);
                await fail(Infinity);
                await fail(undefined);
                await fail(null);
                await fail(true);
                await fail(false);
                await fail({});
                await fail([]);
                await fail(NaN);
            });

            it('invalidates rejection (invalid message type)', async () => {

                const promise = Promise.reject(new Error('kaboom'));

                const fail = async (value) => {

                    try {
                        await Code.expect(promise).to.reject(Error, value);
                    }
                    catch (err) {
                        var exception = err;
                    }

                    Hoek.assert(exception.message === 'Can not assert with invalid message argument type', exception);
                };

                await fail(1);
                await fail(0);
                await fail(Infinity);
                await fail(undefined);
                await fail(null);
                await fail(true);
                await fail(false);
                await fail({});
                await fail([]);
                await fail(NaN);
            });

            it('validates rejection (type and message)', async () => {

                try {
                    await Code.expect(Promise.reject(new Error('kaboom'))).to.reject(Error, 'kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });

            it('returns rejection error', async () => {

                const Custom = function () { };
                delete Custom.name; // Ensure that the type is anonymous

                try {
                    const err = await Code.expect(Promise.reject(new Error('kaboom'))).to.reject();
                    Code.expect(err).to.be.an.error('kaboom');
                }
                catch (err) {
                    var exception = err;
                }

                Hoek.assert(!exception, exception);
            });
        });
    });

    it('handles cases where thrownAt() cannot parse the error', () => {

        const captureStackTrace = Error.captureStackTrace;

        Error.captureStackTrace = (error) => {

            error.stack = 5;
        };

        try {
            Code.expect(1).to.equal(2);
        }
        catch (err) {
            var exception = err;
        }
        finally {
            Error.captureStackTrace = captureStackTrace;
        }

        Hoek.assert(exception);
        Hoek.assert(exception.message === 'Expected 1 to equal specified value: 2', exception.message);
        Hoek.assert(exception.at.filename === __filename);
        Hoek.assert(exception.at.column === '18');
    });
});

describe('fail', () => {

    it('trigger failure', () => {

        try {
            Code.fail('Something wrong happened!');
        }
        catch (err) {
            var exception = err;
        }

        Hoek.assert(exception.message === 'Something wrong happened!', exception);
    });

    it('trigger failure only once', () => {

        try {
            Code.fail('Final Failure');
            Code.fail('FAIL AGAIN');
        }
        catch (err) {
            var exception = err;
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

    it('handles error with unnamed functions', () => {

        const test = (f) => f();

        try {

            // eslint-disable-next-line prefer-arrow-callback
            test(function () {

                Code.expect(true).to.be.false();
            });

            Code.fail('an error should have been thrown');
        }
        catch (ex) {

            const at = Code.thrownAt(ex);
            Hoek.assert(at.filename === __filename);
        }
    });
});
