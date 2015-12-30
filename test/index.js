'use strict';

// Load modules

const Code = require('..');
const Hoek = require('hoek');
const Lab = require('lab');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;


describe('count()', () => {

    it('returns assertion count', (done) => {

        Code.expect(10).to.be.above(5);
        Code.expect('abc').to.be.a.string();
        Hoek.assert(Code.count() === 2);
        done();
    });
});

describe('expect()', () => {

    it('validates assertion', (done) => {

        let exception = false;
        try {
            Code.expect('abcd').to.contain('a');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(!exception, exception);
        done();
    });

    it('uses grammar', (done) => {

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
        done();
    });

    it('asserts on invalid condition', (done) => {

        let exception = false;
        try {
            Code.expect('abcd').to.contain('e');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to include \'e\'', exception);
        done();
    });

    it('asserts on invalid condition (not)', (done) => {

        let exception = false;
        try {
            Code.expect('abcd').to.not.contain('a');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to not include \'a\'', exception);
        done();
    });

    it('asserts on invalid condition (once)', (done) => {

        let exception = false;
        try {
            Code.expect('abcad').to.once.contain('a');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcad\' to include \'a\' once', exception);
        done();
    });

    it('asserts on invalid condition (with actual)', (done) => {

        let exception = false;
        try {
            Code.expect('abcd').to.have.length(3);
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to have a length of 3 but got 4', exception);
        done();
    });

    it('asserts on invalid condition (prefix)', (done) => {

        let exception = false;
        try {
            Code.expect('abcd', 'Oops').to.contain('e');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Oops: Expected \'abcd\' to include \'e\'', exception);
        done();
    });

    it('asserts on invalid condition (large array, display truncated)', (done) => {

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
        done();
    });

    it('asserts on invalid condition (large array, display not truncated)', (done) => {

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
        done();
    });

    it('asserts on invalid condition (large object, display truncated)', (done) => {

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
        done();
    });

    it('asserts on invalid condition (large object, display not truncated)', (done) => {

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
        done();
    });

    it('handles multi-line error message', (done) => {

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
        Hoek.assert(exception.message === 'Expected { a: 1,\n  b: \'12345678901234567890123456789012345678901234567890\' } to be a string but got \'object\'', exception);
        done();
    });

    it('asserts on invalid condition (long object values, display truncated)', (done) => {

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
        done();
    });

    it('asserts on invalid condition (long object values, display not truncated)', (done) => {

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
        done();
    });

    it('asserts on invalid condition (long string, display truncated)', (done) => {

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
        done();
    });

    it('asserts on invalid condition (long string, display not truncated)', (done) => {

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
        done();
    });

    it('resets flags between chained assertions', (done) => {

        let exception = false;
        try {

            Code.expect('abc').to.contain('a').and.to.not.contain('d');
            Code.expect('abc').to.not.contain('d').and.to.contain('a');
            Code.expect('abc').to.not.contain('d').and.to.not.contain('e');
            Code.expect('abc').to.contain('a').and.to.not.contain('d').and.to.contain('c').to.not.contain('f');
            Code.expect(() => {}).to.not.throw().and.to.be.a.function();
            Code.expect(10).to.not.be.about(8, 1).and.to.be.about(9, 1);
            Code.expect(10).to.be.about(9, 1).and.to.not.be.about(8, 1);
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(!exception, exception);
        done();
    });

    it('uses the global prototype setting when doing deep compares on objects', (done) => {

        const origPrototype = Code.settings.comparePrototypes;
        let exception = false;

        Code.settings.comparePrototypes = false;

        try {

            const obj = Object.create(null);
            Code.expect({}).to.deep.equal(obj);
            obj.foo = 'bar';
            Code.expect({ foo: 'bar' }).to.deep.equal(obj);
            Code.expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });
        }
        catch (err) {
            exception = err;
        }

        Code.settings.comparePrototypes = origPrototype;
        Hoek.assert(!exception, exception);
        done();
    });

    describe('assertion', () => {

        describe('argument()', () => {

            it('validates correct type', (done) => {

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
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect({ 1: 1, 2: 2, 3: 3, length: 3 }).to.be.arguments();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected { \'1\': 1, \'2\': 2, \'3\': 3, length: 3 } to be an arguments but got \'object\'', exception);
                done();
            });
        });

        describe('array()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect([1]).to.be.an.array();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect({ 1: 1 }).to.be.an.array();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected { \'1\': 1 } to be an array but got \'object\'', exception);
                done();
            });
        });

        describe('boolean()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(true).to.be.a.boolean();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect(undefined).to.be.a.boolean();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected undefined to be a boolean but got \'undefined\'', exception);
                done();
            });
        });

        describe('buffer()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(new Buffer([1])).to.be.a.buffer();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect(null).to.be.a.buffer();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected null to be a buffer but got \'null\'', exception);
                done();
            });
        });

        describe('date()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(new Date()).to.be.a.date();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect(true).to.be.a.date();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected true to be a date but got \'boolean\'', exception);
                done();
            });
        });

        describe('function()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.be.a.function();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect(false).to.be.a.function();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected false to be a function but got \'boolean\'', exception);
                done();
            });
        });

        describe('number()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(22).to.be.a.number();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.be.a.number();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to be a number but got \'function\'', exception);
                done();
            });
        });

        describe('regexp()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(/a/).to.be.a.regexp();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect(new Date()).to.be.a.regexp();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message.match(/Expected .* GMT.* to be a regexp but got 'date'/), exception);
                done();
            });
        });

        describe('string()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect('asd').to.be.a.string();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect(/a/).to.be.a.string();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected /a/ to be a string but got \'regexp\'', exception);
                done();
            });
        });

        describe('object()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect({}).to.be.a.object();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect(new Buffer([20])).to.be.an.object();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected <Buffer 14> to be an object but got \'buffer\'', exception);
                done();
            });
        });

        describe('true()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(true).to.be.true();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect('a').to.be.true();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be true', exception);
                done();
            });
        });

        describe('false()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(false).to.be.false();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect('a').to.be.false();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be false', exception);
                done();
            });
        });

        describe('null()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(null).to.be.null();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect('a').to.be.null();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be null', exception);
                done();
            });
        });

        describe('undefined()', () => {

            it('validates correct type', (done) => {

                let exception = false;
                try {
                    Code.expect(undefined).to.be.undefined();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates correct type (missing)', (done) => {

                let exception = false;
                try {
                    Code.expect().to.be.undefined();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect('a').to.be.undefined();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be undefined', exception);
                done();
            });
        });

        describe('include()', () => {

            it('validates strings', (done) => {

                let exception = false;
                try {
                    Code.expect('abc').to.include('ab');
                    Code.expect('abc').to.only.include('abc');
                    Code.expect('aaa').to.only.include('a');
                    Code.expect('abc').to.once.include('b');
                    Code.expect('abc').to.include(['a', 'c']);
                    Code.expect('abc').to.part.include(['a', 'd']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates arrays', (done) => {

                let exception = false;
                try {
                    Code.expect([1, 2, 3]).to.include(1);
                    Code.expect([{ a: 1 }]).to.deep.include({ a: 1 });
                    Code.expect([1, 2, 3]).to.include([1, 2]);
                    Code.expect([{ a: 1 }]).to.deep.include([{ a: 1 }]);
                    Code.expect([1, 1, 2]).to.only.include([1, 2]);
                    Code.expect([1, 2]).to.once.include([1, 2]);
                    Code.expect([1, 2, 3]).to.part.include([1, 4]);
                    Code.expect([[1], [2]]).to.deep.include([[1]]);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates objects', (done) => {

                let exception = false;
                try {
                    Code.expect({ a: 1, b: 2, c: 3 }).to.include('a');
                    Code.expect({ a: 1, b: 2, c: 3 }).to.include(['a', 'c']);
                    Code.expect({ a: 1, b: 2, c: 3 }).to.only.include(['a', 'b', 'c']);
                    Code.expect({ a: 1, b: 2, c: 3 }).to.include({ a: 1 });
                    Code.expect({ a: 1, b: 2, c: 3 }).to.include({ a: 1, c: 3 });
                    Code.expect({ a: 1, b: 2, c: 3 }).to.part.include({ a: 1, d: 4 });
                    Code.expect({ a: 1, b: 2, c: 3 }).to.only.include({ a: 1, b: 2, c: 3 });
                    Code.expect({ a: [1], b: [2], c: [3] }).to.deep.include({ a: [1], c: [3] });
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates aliases', (done) => {

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
                done();
            });
        });

        describe('endWith()', () => {

            it('validates strings', (done) => {

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
                done();
            });

            it('does not validate arrays', (done) => {

                let exception = false;
                try {
                    Code.expect(['a', 'b', 'c']).to.endWith('abcdef');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert endsWith on a string, with a string', exception);
                done();
            });

            it('does not validate using arrays', (done) => {

                let exception = false;
                try {
                    Code.expect('abcdef').to.endWith(['a', 'b', 'c']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert endsWith on a string, with a string', exception);
                done();
            });

        });

        describe('startWith()', () => {

            it('validates strings', (done) => {

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
                done();
            });

            it('does not validate arrays', (done) => {

                let exception = false;
                try {
                    Code.expect(['a', 'b', 'c']).to.startWith('abcdef');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert startsWith on a string, with a string', exception);
                done();
            });

            it('does not validate using arrays', (done) => {

                let exception = false;
                try {
                    Code.expect('abcdef').to.startWith(['a', 'b', 'c']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert startsWith on a string, with a string', exception);
                done();
            });

        });

        describe('exist()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect('a').to.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion (null)', (done) => {

                let exception = false;
                try {
                    Code.expect(null).to.be.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected null to exist', exception);
                done();
            });

            it('invalidates assertion (undefined)', (done) => {

                let exception = false;
                try {
                    Code.expect(undefined).to.be.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected undefined to exist', exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect('a').exists();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (not error)', (done) => {

                let exception = false;
                try {
                    Code.expect(new Error('some message')).to.not.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'some message', exception);
                done();
            });
        });

        describe('empty()', () => {

            it('validates string', (done) => {

                let exception = false;
                try {
                    Code.expect('').to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates buffer', (done) => {

                let exception = false;
                try {
                    Code.expect(new Buffer('')).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates array', (done) => {

                let exception = false;
                try {
                    Code.expect([]).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates object', (done) => {

                let exception = false;
                try {
                    Code.expect({}).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect('a').to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to be empty', exception);
                done();
            });
        });

        describe('length()', () => {

            it('validates string', (done) => {

                let exception = false;
                try {
                    Code.expect('a').to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates buffer', (done) => {

                let exception = false;
                try {
                    Code.expect(new Buffer('a')).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates array', (done) => {

                let exception = false;
                try {
                    Code.expect([1]).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates object', (done) => {

                let exception = false;
                try {
                    Code.expect({ a: 10 }).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', (done) => {

                let exception = false;
                try {
                    Code.expect('a').to.have.length(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a\' to have a length of 10 but got 1', exception);
                done();
            });
        });

        describe('equal()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect('abc').to.equal('abc');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect('abc').equals('abc');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (deep)', (done) => {

                let exception = false;
                try {
                    Code.expect(['abc']).to.deep.equal(['abc']);
                    Code.expect({ a: 1 }).to.deep.equal({ a: 1 });
                    Code.expect({}).to.not.deep.equal({ a: 1 });
                    Code.expect({ a: 1 }).to.not.deep.equal({});
                    Code.expect(Object.create(null)).to.not.deep.equal({});
                    Code.expect(Object.create(null)).to.deep.equal({}, { prototype: false });
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(['a']).to.equal(['a']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [ \'a\' ] to equal specified value', exception);
                done();
            });
        });

        describe('above()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.above(5);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect(1).to.be.greaterThan(0);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.above(50);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be above 50', exception);
                done();
            });
        });

        describe('least()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.at.least(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.min(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.at.least(20);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be at least 20', exception);
                done();
            });
        });

        describe('below()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(1).to.be.below(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect(1).to.be.lessThan(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(1).to.be.below(0);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 1 to be below 0', exception);
                done();
            });
        });

        describe('most()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.at.most(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.max(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(100).to.be.at.most(20);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 100 to be at most 20', exception);
                done();
            });
        });

        describe('within()', () => {

            it('validates assertion', (done) => {

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
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect(5).to.be.in.range(0, 10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion (over)', (done) => {

                let exception = false;
                try {
                    Code.expect(5).to.be.within(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 5 to be within 0..4', exception);
                done();
            });

            it('invalidates assertion (under)', (done) => {

                let exception = false;
                try {
                    Code.expect(-1).to.be.within(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected -1 to be within 0..4', exception);
                done();
            });
        });

        describe('between()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(5).to.be.between(0, 10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion (over)', (done) => {

                let exception = false;
                try {
                    Code.expect(4).to.be.between(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 4 to be between 0..4', exception);
                done();
            });

            it('invalidates assertion (under)', (done) => {

                let exception = false;
                try {
                    Code.expect(0).to.be.between(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 0 to be between 0..4', exception);
                done();
            });
        });

        describe('about()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.about(8, 2);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.about(8, 1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be about 8 \u00b11', exception);
                done();
            });

            it('invalidates assertion (invalid arguments)', (done) => {

                let exception = false;
                try {
                    Code.expect(10).to.be.about('8', '1');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'About assertion requires two number arguments', exception);
                done();
            });
        });

        describe('instanceof()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(new Date()).to.be.instanceof(Date);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect(new Date()).to.be.instanceOf(Date);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect([]).to.be.instanceof(RegExp);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of RegExp', exception);
                done();
            });

            it('invalidates assertion (anonymous)', (done) => {

                const Custom = function () { };

                let exception = false;
                try {
                    Code.expect([]).to.be.instanceof(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of provided type', exception);
                done();
            });

            it('invalidates assertion (anonymous)', (done) => {

                function Custom() { }           /* eslint func-style:0 */

                let exception = false;
                try {
                    Code.expect([]).to.be.instanceof(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of Custom', exception);
                done();
            });
        });

        describe('match()', () => {

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect('a4x').to.match(/\w\dx/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect('a4x').matches(/\w\dx/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect('a4x').to.match(/\w\dy/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'a4x\' to match /\\w\\dy/', exception);
                done();
            });
        });

        describe('satisfy()', () => {

            const validate = function (value) {

                return value === 'some value';
            };

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect('some value').to.satisfy(validate);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect('some value').satisfies(validate);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect('wrong').to.satisfy(validate);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected \'wrong\' to satisfy rule', exception);
                done();
            });
        });

        describe('throw()', () => {

            const throws = function () {

                throw new Error('kaboom');
            };

            it('validates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', (done) => {

                let exception = false;
                try {
                    Code.expect(throws).throws();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.throw();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error', exception);
                done();
            });

            it('forbids arguments on negative assertion', (done) => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.not.throw('message');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Cannot specify arguments when expecting not to throw', exception);
                done();
            });

            it('validates assertion (message)', (done) => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (empty message)', (done) => {

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
                done();
            });

            it('validates assertion (message regex)', (done) => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw(/boom/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (missing message)', (done) => {

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
                done();
            });

            it('invalidates assertion (message)', (done) => {

                let exception = false;
                try {
                    Code.expect(() => { }).to.throw('steve');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error', exception);
                done();
            });

            it('invalidates assertion (empty message)', (done) => {

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
                done();
            });

            it('validates assertion (type)', (done) => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion (known type)', (done) => {

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
                done();
            });

            it('invalidates assertion (anonymous type)', (done) => {

                const Custom = function () { };

                let exception = false;
                try {
                    Code.expect(throws).to.throw(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw provided type', exception);
                done();
            });

            it('validates assertion (type and message)', (done) => {

                let exception = false;
                try {
                    Code.expect(throws).to.throw(Error, 'kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });
        });
    });
});

describe('fail', () => {

    it('trigger failure', (done) => {

        let exception = false;
        try {
            Code.fail('Something wrong happened!');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Something wrong happened!', exception);
        done();
    });

    it('trigger failure only once', (done) => {

        let exception = false;
        try {
            Code.fail('Final Failure');
            Code.fail('FAIL AGAIN');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Final Failure', exception);
        done();
    });

});

describe('incomplete()', () => {

    it('keeps track of incomplete assertions', (done) => {

        const a = Code.expect(1).to;
        Code.expect(2).to.equal(2);
        Hoek.assert(Code.incomplete().length === 1);
        a.equal(1);
        Hoek.assert(!Code.incomplete());
        done();
    });
});
