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

                Hoek.assert(exception.message === 'Expected \'a\' to be true but got \'a\'', exception);
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

                Hoek.assert(exception.message === 'Expected \'a\' to be false but got \'a\'', exception);
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

                Hoek.assert(exception.message === 'Expected \'a\' to be null but got \'a\'', exception);
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

                Hoek.assert(exception.message === 'Expected \'a\' to be undefined but got \'a\'', exception);
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