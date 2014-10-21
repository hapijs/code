// Load modules

var NodeUtil = require('util');
var Hoek = require('hoek');


// Declare internals

var internals = {
    flags: ['deep', 'not', 'once', 'only', 'part'],
    grammar: ['a', 'an', 'and', 'at', 'be', 'have', 'to'],
    locations: {}
};


exports.expect = function (value, prefix) {

    var at = internals.at();
    var location = at.filename + ':' + at.line + '.' + at.column;
    internals.locations[location] = true;
    return new internals.Assertion(value, prefix, location);
};


exports.incomplete = function () {

    var locations = Object.keys(internals.locations);
    return locations.length ? locations : null;
};


internals.Assertion = function (ref, prefix, location) {

    this._ref = ref;
    this._prefix = prefix || '';
    this._location = location;
    this._flags = {};
};


internals.filterLocal = function (line) {

    return line.indexOf(__dirname) === -1;
};


internals.Assertion.prototype.assert = function (result, verb, actual, expected) {

    delete internals.locations[this._location];

    if (this._flags.not ? !result : result) {
        return this;
    }

    var message = (this._prefix ? this._prefix + ': ' : '') + 'Expected ' + internals.display(this._ref) + ' to ' + (this._flags.not ? 'not ' + verb : verb);
    if (arguments.length === 3) {           // 'actual' without 'expected'
        message += ' but got ' + internals.display(actual);
    }

    var error = new Error(message);
    Error.captureStackTrace(error, this.assert);
    error.actual = actual;
    error.expected = expected;
    error.at = internals.at(error);
    throw error;
};


[].concat(internals.flags, internals.grammar).forEach(function (word) {

    var method = internals.flags.indexOf(word) !== -1 ? function () { this._flags[word] = !(!!this._flags[word]); return this; }      // !!! to flip undefined
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
        return this.assert(type === word, 'be ' + article + word, type);
    });
});


[true, false, null, undefined].forEach(function (value) {

    var name = NodeUtil.inspect(value);
    internals.addMethod(name, function () {

        return this.assert(this._ref === value, 'be ' + name, this._ref);
    });
});


internals.addMethod(['include', 'includes', 'contain', 'contains'], function (value) {

    return this.assert(Hoek.contain(this._ref, value, this._flags), 'include ' + internals.display(value));
});


internals.addMethod(['exist', 'exists'], function () {

    return this.assert(this._ref !== null && this._ref !== undefined, 'exist');
});


internals.addMethod('empty', function () {

    Hoek.assert(typeof this._ref === 'object' || typeof this._ref === 'string', 'Can only assert empty on object or string');

    var length = this._ref.length !== undefined ? this._ref.length : Object.keys(this._ref).length;
    return this.assert(!length, 'be empty');
});


internals.addMethod('length', function (size) {

    Hoek.assert(typeof this._ref === 'object' || typeof this._ref === 'string', 'Can only assert empty on object or string');

    var length = this._ref.length !== undefined ? this._ref.length : Object.keys(this._ref).length;
    return this.assert(length === size, 'have a length of ' + size, length);
});


internals.addMethod(['equal', 'equals'], function (value) {

    var compare = (this._flags.deep ? Hoek.deepEqual : function (a, b) { return a === b; });
    return this.assert(compare(this._ref, value), 'equal specified value', this._ref, value);
});


internals.addMethod(['above', 'greaterThan'], function (value) {

    return this.assert(this._ref > value, 'be above ' + value, this._ref);
});


internals.addMethod(['least'], function (value) {

    return this.assert(this._ref >= value, 'be at least ' + value, this._ref);
});


internals.addMethod(['below', 'lessThan'], function (value) {

    return this.assert(this._ref < value, 'be below ' + value, this._ref);
});


internals.addMethod(['most'], function (value) {

    return this.assert(this._ref <= value, 'be at most ' + value, this._ref);
});


internals.addMethod('within', function (start, finish) {

    return this.assert(this._ref >= start && this._ref <= finish, 'be within ' + start + '..' + finish, this._ref);
});


internals.addMethod('about', function (value, delta) {

    Hoek.assert(internals.type(this._ref) === 'number', 'Can only assert about on numbers');
    Hoek.assert(internals.type(value) === 'number' && internals.type(delta) === 'number', 'About assertion requires two number arguments');

    return this.assert(Math.abs(this._ref - value) <= delta, 'be about ' + value + ' \u00b1' + delta, this._ref);
});


internals.addMethod(['instanceof', 'instanceOf'], function (constructor) {

    var name = internals.name(constructor);
    return this.assert(this._ref instanceof constructor, 'be an instance of ' + name);
});


internals.addMethod(['match', 'matches'], function (regex) {

    return this.assert(regex.exec(this._ref), 'match ' + regex);
});


internals.addMethod(['satisfy', 'satisfies'], function (matcher) {

    return this.assert(matcher(this._ref), 'satisfy rule');
});


internals.addMethod(['throw', 'throws'], function (/* [constructor,] message */) {

    Hoek.assert(typeof this._ref === 'function', 'Can only assert throw on functions');
    Hoek.assert(!this._flags.not || !arguments.length, 'Cannot specify arguments when expecting not to throw');

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

    return this.assert(thrown, 'throw an error');
});


internals.display = function (value) {

    var string = NodeUtil.inspect(value);
    if (string.length >= 40) {                         // Keep strings short
        if (typeof value === 'function') {
            return value.name ? '[Function: ' + value.name + ']' : '[Function]';
        }

        if (Array.isArray(value)) {
            return '[Array(' + value.length + ')]';
        }

        if (typeof value === 'object') {
            var keys = Object.keys(value);
            return '{ Object (' + keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ') + ') }';
        }
    }

    return string;
};


internals.name = function (constructor) {

    var name = constructor.name;
    if (!name) {
        var match = /^\s?function ([^(]*)\(/.exec(constructor);
        name = match && match[1] ? match[1] : '';
    }

    return name;
};


internals.natives = {
    '[object Arguments]': 'arguments',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Function]': 'function',
    '[object Number]': 'number',
    '[object RegExp]': 'regexp',
    '[object String]': 'string'
};


internals.type = function (value) {

    if (value === null) {
        return 'null';
    }

    if (value === undefined) {
        return 'undefined';
    }

    if (Buffer.isBuffer(value)) {
        return 'buffer';
    }

    var name = Object.prototype.toString.call(value);
    if (internals.natives[name]) {
        return internals.natives[name];
    }

    if (value === Object(value)) {
        return 'object';
    }

    return typeof value;
};


internals.at = function (error) {

    error = error || new Error();
    var at = error.stack.split('\n').slice(1).filter(internals.filterLocal)[0].match(/^\s*at \(?(.+)\:(\d+)\:(\d+)\)?$/);
    return {
        filename: at[1],
        line: at[2],
        column: at[3]
    };
};
