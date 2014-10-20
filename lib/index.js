// Initial version adapted from Chai, copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>, http://chaijs.com, MIT Licensed

// Load modules

var NodeUtil = require('util');
var Hoek = require('hoek');


// Declare internals

var internals = {
    flags: ['deep', 'not', 'once', 'only', 'part'],
    grammar: ['a', 'an', 'at', 'be', 'been', 'has', 'have', 'is', 'that', 'to', 'with']
};


exports.expect = function (value, prefix) {

    return new internals.Assertion(value, prefix);
};


internals.Assertion = function (ref, prefix) {

    this._ref = ref;
    this._prefix = prefix || '';
    this._state = {};
};


internals.Assertion.prototype.assert = function (expr, msg, actual, expected) {

    var passed = this._state.not ? !expr : expr;
    if (passed) {
        return;
    }

    msg = (Array.isArray(msg) ? (this._state.not ? msg[1] : msg[0]) : (this._state.not ? 'not ' + msg : msg));
    var message = (this._prefix ? this._prefix + ': ' : '') + 'expected ' + internals.display(this._ref) + ' to ' + msg;
    if (arguments.length === 3) {           // 'actual' without 'expected'
        message += ' but got ' + internals.display(actual);
    }

    var error = new Error(message);
    error.actual = actual;
    error.expected = expected;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(error, this.assert);
    }

    throw error;
};


[].concat(internals.flags, internals.grammar).forEach(function (word) {

    var method = internals.flags.indexOf(word) !== -1 ? function () { this._state[word] = !!!this._state[word]; return this; }      // !!! to flip undefined
                                                      : function () { return this; };

    Object.defineProperty(internals.Assertion.prototype, word, { get: method, configurable: true });
});


internals.addMethod = function (names, fn) {

    names = [].concat(names);
    names.forEach(function (name) {

        internals.Assertion.prototype[name] = fn;
    });
};


['arguments', 'array', 'boolean', 'buffer', 'date', 'function', 'number', 'regexp', 'string', 'object'].forEach(function (word) {

    var article = ['a', 'e', 'i', 'o', 'u'].indexOf(word[0]) !== -1 ? 'an ' : 'a ';
    internals.addMethod(word, function () {

        var type = internals.type(this._ref);
        this.assert(type === word, 'be ' + article + word, type);
    });
});


[true, false, null, undefined].forEach(function (value) {

    var name = NodeUtil.inspect(value);
    internals.addMethod(name, function () {

        this.assert(this._ref === value, 'be ' + name, this._ref);
    });
});


internals.addMethod(['include', 'includes', 'contain', 'contains'], function (value) {

    this.assert(Hoek.contain(this._ref, value, this._state), 'include ' + internals.display(value));
});


internals.addMethod(['exist', 'exists'], function () {

    this.assert(this._ref !== null && this._ref !== undefined, 'exist');
});


internals.addMethod('empty', function () {

    Hoek.assert(typeof this._ref === 'object' || typeof this._ref === 'string', 'Can only assert empty on object or string');

    var length = this._ref.length !== undefined ? this._ref.length : Object.keys(this._ref).length;
    this.assert(!length, 'be empty');
});


internals.addMethod('length', function (size) {

    Hoek.assert(typeof this._ref === 'object' || typeof this._ref === 'string', 'Can only assert empty on object or string');

    var length = this._ref.length !== undefined ? this._ref.length : Object.keys(this._ref).length;
    this.assert(length === size, 'have a length of ' + size, length);
});


internals.addMethod(['equal', 'equals'], function (value) {

    var compare = (this._state.deep ? Hoek.deepEqual : function (a, b) { return a === b; });
    this.assert(compare(this._ref, value), 'equal specified value', this._ref, value);
});


internals.addMethod(['above', 'greaterThan'], function (value) {

    this.assert(this._ref > value, 'be above ' + value, this._ref);
});


internals.addMethod(['least'], function (value) {

    this.assert(this._ref >= value, 'be at least ' + value, this._ref);
});


internals.addMethod(['below', 'lessThan'], function (value) {

    this.assert(this._ref < value, 'be below ' + value, this._ref);
});


internals.addMethod(['most'], function (value) {

    this.assert(this._ref <= value, 'be at most ' + value, this._ref);
});


internals.addMethod('within', function (start, finish) {

    this.assert(this._ref >= start && this._ref <= finish, 'be within ' + start + '..' + finish, this._ref);
});


internals.addMethod('about', function (value, delta) {

    Hoek.assert(internals.type(this._ref) === 'number', 'Can only assert about on numbers');
    Hoek.assert(internals.type(value) === 'number' && internals.type(delta) === 'number', 'About assertion requires two number arguments');

    this.assert(Math.abs(this._ref - value) <= delta, 'be about ' + value + ' \u00b1' + delta, this._ref);
});


internals.addMethod(['instanceof', 'instanceOf'], function (constructor) {

    var name = internals.name(constructor);
    this.assert(this._ref instanceof constructor, 'be an instance of ' + name);
});


internals.addMethod(['match', 'matches'], function (regex) {

    this.assert(regex.exec(this._ref), 'match ' + regex);
});


internals.addMethod(['satisfy', 'satisfies'], function (matcher) {

    this.assert(matcher(this._ref), 'satisfy rule');
});


internals.addMethod(['throw', 'throws'], function (/* [constructor,] message */) {

    Hoek.assert(typeof this._ref === 'function', 'Can only assert throw on functions');
    Hoek.assert(!this._state.not || !arguments.length, 'Cannot specify arguments when expecting not to throw');

    var constructor = arguments.length && typeof arguments[0] !== 'string' && !(arguments[0] instanceof RegExp) ? arguments[0] : null;
    var lastArg = arguments[1] || arguments[0];
    var message = typeof lastArg === 'string' || lastArg instanceof RegExp ? lastArg : null;

    var thrown = false;

    try {
        this._ref();
    }
    catch (err) {
        thrown = true;

        if (constructor) {
            this.assert(err instanceof constructor, 'throw ' + internals.name(constructor));
        }

        if (message) {
            this.assert(err.message && (typeof message === 'string' ? err.message === message : err.message.match(message)), 'throw an error with specified message', err.message, message);
        }

        this.assert(thrown, 'throw an error', err);
    }

    this.assert(thrown, 'throw an error');
});


internals.natives = {
    '[object Arguments]': 'arguments',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Function]': 'function',
    '[object Number]': 'number',
    '[object RegExp]': 'regexp',
    '[object String]': 'string'
};


internals.type = function (obj) {

    var str = Object.prototype.toString.call(obj);
    if (internals.natives[str]) {
        return internals.natives[str];
    }

    if (obj === null) {
        return 'null';
    }

    if (obj === undefined) {
        return 'undefined';
    }

    if (obj === Object(obj)) {
        return 'object';
    }

    if (Buffer.isBuffer(obj)) {
        return 'buffer';
    }

    return typeof obj;
};


internals.display = function (obj) {

    var str = NodeUtil.inspect(obj);
    var type = Object.prototype.toString.call(obj);

    if (str.length >= 40) {                         // Keep strings short
        if (type === '[object Function]') {
            return !obj.name || obj.name === '' ? '[Function]' : '[Function: ' + obj.name + ']';
        }

        if (type === '[object Array]') {
            return '[ Array(' + obj.length + ') ]';
        }

        if (type === '[object Object]') {
            var keys = Object.keys(obj);
            var kstr = keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ');
            return '{ Object (' + kstr + ') }';
        }
    }

    return str;
};


internals.name = function (constructor) {

    var name = constructor.name;
    if (!name) {
        var match = /^\s?function ([^(]*)\(/.exec(constructor);
        name = match && match[1] ? match[1] : '';
    }

    return name;
};
