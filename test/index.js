// Load modules

var Code = require('..');
var Hoek = require('hoek');
var Lab = require('lab');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;


describe('count()', function () {

    it('returns assertion count', function (done) {

        Code.expect(10).to.be.above(5);
        Code.expect('abc').to.be.a.string();
        Hoek.assert(Code.count() === 2);
        done();
    });
});

describe('expect()', function () {

    it('validates assertion', function (done) {

        var exception = false;
        try {
            Code.expect('abcd').to.contain('a');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(!exception, exception);
        done();
    });

    it('uses grammar', function (done) {

        var exception = false;
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

    it('asserts on invalid condition', function (done) {

        var exception = false;
        try {
            Code.expect('abcd').to.contain('e');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to include \'e\'', exception);
        done();
    });

    it('asserts on invalid condition (not)', function (done) {

        var exception = false;
        try {
            Code.expect('abcd').to.not.contain('a');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to not include \'a\'', exception);
        done();
    });

    it('asserts on invalid condition (with actual)', function (done) {

        var exception = false;
        try {
            Code.expect('abcd').to.have.length(3);
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'abcd\' to have a length of 3 but got 4', exception);
        done();
    });

    it('asserts on invalid condition (prefix)', function (done) {

        var exception = false;
        try {
            Code.expect('abcd', 'Oops').to.contain('e');
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Oops: Expected \'abcd\' to include \'e\'', exception);
        done();
    });

    it('asserts on invalid condition (large array)', function (done) {

        var exception = false;
        try {
            Code.expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected [Array(18)] to be a string but got \'array\'', exception);
        done();
    });

    it('asserts on invalid condition (large object)', function (done) {

        var exception = false;
        try {
            Code.expect({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected { Object (a, b, ...) } to be a string but got \'object\'', exception);
        done();
    });

    it('asserts on invalid condition (long object values)', function (done) {

        var exception = false;
        try {
            Code.expect({ a: 12345678901234567890, b: 12345678901234567890 }).to.be.a.string();
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected { Object (a, b) } to be a string but got \'object\'', exception);
        done();
    });

    it('asserts on invalid condition (long string)', function (done) {

        var exception = false;
        try {
            Code.expect('{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }').to.be.a.number();
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(exception.message === 'Expected \'{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g...\' to be a number but got \'string\'', exception);
        done();
    });

    it('resets flags between chained assertions', function (done) {

        var exception = false;
        try {

            Code.expect('abc').to.contain('a').and.to.not.contain('d');
            Code.expect('abc').to.not.contain('d').and.to.contain('a');
            Code.expect('abc').to.not.contain('d').and.to.not.contain('e');
            Code.expect('abc').to.contain('a').and.to.not.contain('d').and.to.contain('c').to.not.contain('f');
            Code.expect(function () {}).to.not.throw().and.to.be.a.function();
            Code.expect(10).to.not.be.about(8, 1).and.to.be.about(9, 1);
            Code.expect(10).to.be.about(9, 1).and.to.not.be.about(8, 1);
        }
        catch (err) {
            exception = err;
        }

        Hoek.assert(!exception, exception);
        done();
    });

    describe('assertion', function () {

        describe('argument()', function () {

            it('validates correct type', function (done) {

                var grab = function () {

                    return arguments;
                };

                var exception = false;
                try {
                    Code.expect(grab(1, 2, 3)).to.be.arguments();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('array()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect([1]).to.be.an.array();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('boolean()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(true).to.be.a.boolean();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('buffer()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(new Buffer([1])).to.be.a.buffer();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('date()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(new Date()).to.be.a.date();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('function()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(function () { }).to.be.a.function();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('number()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(22).to.be.a.number();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
                try {
                    Code.expect(function () { }).to.be.a.number();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to be a number but got \'function\'', exception);
                done();
            });
        });

        describe('regexp()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(/a/).to.be.a.regexp();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('string()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect('asd').to.be.a.string();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('object()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect({}).to.be.a.object();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('true()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(true).to.be.true();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('false()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(false).to.be.false();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('null()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(null).to.be.null();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('undefined()', function () {

            it('validates correct type', function (done) {

                var exception = false;
                try {
                    Code.expect(undefined).to.be.undefined();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates correct type (missing)', function (done) {

                var exception = false;
                try {
                    Code.expect().to.be.undefined();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('include()', function () {

            it('validates strings', function (done) {

                var exception = false;
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

            it('validates arrays', function (done) {

                var exception = false;
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

            it('validates objects', function (done) {

                var exception = false;
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

            it('validates aliases', function (done) {

                var exception = false;
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

        describe('endWith()', function () {

            it('validates strings', function (done) {

                var exception = false;
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

            it('does not validate arrays', function (done) {

                var exception = false;
                try {
                    Code.expect(['a', 'b', 'c']).to.endWith('abcdef');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert endsWith on a string, with a string', exception);
                done();
            });

            it('does not validate using arrays', function (done) {

                var exception = false;
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

        describe('startWith()', function () {

            it('validates strings', function (done) {

                var exception = false;
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

            it('does not validate arrays', function (done) {

                var exception = false;
                try {
                    Code.expect(['a', 'b', 'c']).to.startWith('abcdef');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Can only assert startsWith on a string, with a string', exception);
                done();
            });

            it('does not validate using arrays', function (done) {

                var exception = false;
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

        describe('exist()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect('a').to.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion (null)', function (done) {

                var exception = false;
                try {
                    Code.expect(null).to.be.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected null to exist', exception);
                done();
            });

            it('invalidates assertion (undefined)', function (done) {

                var exception = false;
                try {
                    Code.expect(undefined).to.be.exist();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected undefined to exist', exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect('a').exists();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });
        });

        describe('empty()', function () {

            it('validates string', function (done) {

                var exception = false;
                try {
                    Code.expect('').to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates buffer', function (done) {

                var exception = false;
                try {
                    Code.expect(new Buffer('')).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates array', function (done) {

                var exception = false;
                try {
                    Code.expect([]).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates object', function (done) {

                var exception = false;
                try {
                    Code.expect({}).to.be.empty();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('length()', function () {

            it('validates string', function (done) {

                var exception = false;
                try {
                    Code.expect('a').to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates buffer', function (done) {

                var exception = false;
                try {
                    Code.expect(new Buffer('a')).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates array', function (done) {

                var exception = false;
                try {
                    Code.expect([1]).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates object', function (done) {

                var exception = false;
                try {
                    Code.expect({ a: 10 }).to.have.length(1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates incorrect type', function (done) {

                var exception = false;
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

        describe('equal()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect('abc').to.equal('abc');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect('abc').equals('abc');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (deep)', function (done) {

                var exception = false;
                try {
                    Code.expect(['abc']).to.deep.equal(['abc']);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
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

        describe('above()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(10).to.be.above(5);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect(1).to.be.greaterThan(0);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
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

        describe('least()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(10).to.be.at.least(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect(10).to.be.min(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
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

        describe('below()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(1).to.be.below(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect(1).to.be.lessThan(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
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

        describe('most()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(10).to.be.at.most(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect(10).to.be.max(10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
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

        describe('within()', function () {

            it('validates assertion', function (done) {

                var exception = false;
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

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect(5).to.be.in.range(0, 10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion (over)', function (done) {

                var exception = false;
                try {
                    Code.expect(5).to.be.within(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 5 to be within 0..4', exception);
                done();
            });

            it('invalidates assertion (under)', function (done) {

                var exception = false;
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

        describe('between()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(5).to.be.between(0, 10);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion (over)', function (done) {

                var exception = false;
                try {
                    Code.expect(4).to.be.between(0, 4);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 4 to be between 0..4', exception);
                done();
            });

            it('invalidates assertion (under)', function (done) {

                var exception = false;
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

        describe('about()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(10).to.be.about(8, 2);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(10).to.be.about(8, 1);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected 10 to be about 8 \u00b11', exception);
                done();
            });

            it('invalidates assertion (invalid arguments)', function (done) {

                var exception = false;
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

        describe('instanceof()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(new Date()).to.be.instanceof(Date);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect(new Date()).to.be.instanceOf(Date);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect([]).to.be.instanceof(RegExp);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of RegExp', exception);
                done();
            });

            it('invalidates assertion (anonymous)', function (done) {

                var Custom = function () { };

                var exception = false;
                try {
                    Code.expect([]).to.be.instanceof(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [] to be an instance of provided type', exception);
                done();
            });

            it('invalidates assertion (anonymous)', function (done) {

                function Custom() { }           /* eslint func-style:0 */

                var exception = false;
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

        describe('match()', function () {

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect('a4x').to.match(/\w\dx/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect('a4x').matches(/\w\dx/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
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

        describe('satisfy()', function () {

            var validate = function (value) {

                return value === 'some value';
            };

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect('some value').to.satisfy(validate);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect('some value').satisfies(validate);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
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

        describe('throw()', function () {

            var throws = function () {

                throw new Error('kaboom');
            };

            it('validates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(throws).to.throw();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (alias)', function (done) {

                var exception = false;
                try {
                    Code.expect(throws).throws();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(function () { }).to.throw();
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error', exception);
                done();
            });

            it('forbids arguments on negative assertion', function (done) {

                var exception = false;
                try {
                    Code.expect(function () { }).to.not.throw('message');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Cannot specify arguments when expecting not to throw', exception);
                done();
            });

            it('validates assertion (message)', function (done) {

                var exception = false;
                try {
                    Code.expect(throws).to.throw('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (empty message)', function (done) {

                var exception = false;
                try {
                    Code.expect(function () {

                        throw new Error('');
                    }).to.throw('');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (message regex)', function (done) {

                var exception = false;
                try {
                    Code.expect(throws).to.throw(/boom/);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('validates assertion (missing message)', function (done) {

                var Custom = function () { };

                var exception = false;
                try {
                    Code.expect(function () { throw new Custom(); }).to.throw('kaboom');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error with specified message', exception);
                done();
            });

            it('invalidates assertion (message)', function (done) {

                var exception = false;
                try {
                    Code.expect(function () { }).to.throw('steve');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error', exception);
                done();
            });

            it('invalidates assertion (empty message)', function (done) {

                var exception = false;
                try {
                    Code.expect(function () { throw new Error('kaboom'); }).to.throw('');
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw an error with specified message', exception);
                done();
            });

            it('validates assertion (type)', function (done) {

                var exception = false;
                try {
                    Code.expect(throws).to.throw(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(!exception, exception);
                done();
            });

            it('invalidates assertion (known type)', function (done) {

                var Custom = function () { };

                var exception = false;
                try {
                    Code.expect(function () { throw new Custom(); }).to.throw(Error);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw Error', exception);
                done();
            });

            it('invalidates assertion (anonymous type)', function (done) {

                var Custom = function () { };

                var exception = false;
                try {
                    Code.expect(throws).to.throw(Custom);
                }
                catch (err) {
                    exception = err;
                }

                Hoek.assert(exception.message === 'Expected [Function] to throw provided type', exception);
                done();
            });

            it('validates assertion (type and message)', function (done) {

                var exception = false;
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

describe('incomplete()', function () {

    it('keeps track of incomplete assertions', function (done) {

        var a = Code.expect(1).to;
        Code.expect(2).to.equal(2);
        Hoek.assert(Code.incomplete().length === 1);
        a.equal(1);
        Hoek.assert(!Code.incomplete());
        done();
    });
});
