// Load modules

var NodeUtil = require('util');
var Hoek = require('hoek');


// Declare internals

var internals = {
    flags: ['deep', 'not', 'once', 'only', 'part'],
    grammar: ['a', 'an', 'and', 'at', 'be', 'have', 'in', 'to'],
    locations: {},
    count: 0
};


exports.expect = function (value, prefix) {

    var at = internals.at();
    var location = at.filename + ':' + at.line + '.' + at.column;
    internals.locations[location] = true;
    ++internals.count;
    return new internals.Assertion(value, prefix, location);
};


exports.incomplete = function () {

    var locations = Object.keys(internals.locations);
    return locations.length ? locations : null;
};


exports.count = function () {

    return internals.count;
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
        this._flags = {};
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

    var method = internals.flags.indexOf(word) !== -1 ? function () { this._flags[word] = !this._flags[word]; return this; }
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

        return this.assert(this._ref === value, 'be ' + name);
    });
});


internals.addMethod(['include', 'includes', 'contain', 'contains'], function (value) {

    return this.assert(Hoek.contain(this._ref, value, this._flags), 'include ' + internals.display(value));
});

internals.addMethod(['endWith', 'endsWith'], function (value) {

    internals.assert(this, typeof this._ref === 'string' && typeof value === 'string', 'Can only assert endsWith on a string, with a string');

    var comparator = this._ref.slice(-value.length);
    return this.assert(comparator === value, 'endWith ' + internals.display(value));
});

internals.addMethod(['startWith', 'startsWith'], function (value) {

    internals.assert(this, typeof this._ref === 'string' && typeof value === 'string', 'Can only assert startsWith on a string, with a string');

    var comparator = this._ref.slice(0, value.length);
    return this.assert(comparator === value, 'startWith ' + internals.display(value));
});


internals.addMethod(['exist', 'exists'], function () {

    return this.assert(this._ref !== null && this._ref !== undefined, 'exist');
});


internals.addMethod('empty', function () {

    internals.assert(this, typeof this._ref === 'object' || typeof this._ref === 'string', 'Can only assert empty on object or string');

    var length = this._ref.length !== undefined ? this._ref.length : Object.keys(this._ref).length;
    return this.assert(!length, 'be empty');
});


internals.addMethod('length', function (size) {

    internals.assert(this, typeof this._ref === 'object' || typeof this._ref === 'string', 'Can only assert empty on object or string');

    var length = this._ref.length !== undefined ? this._ref.length : Object.keys(this._ref).length;
    return this.assert(length === size, 'have a length of ' + size, length);
});


internals.addMethod(['equal', 'equals'], function (value) {

    var compare = (this._flags.deep ? Hoek.deepEqual : function (a, b) { return a === b; });
    return this.assert(compare(this._ref, value), 'equal specified value', this._ref, value);
});


internals.addMethod(['above', 'greaterThan'], function (value) {

    return this.assert(this._ref > value, 'be above ' + value);
});


internals.addMethod(['least', 'min'], function (value) {

    return this.assert(this._ref >= value, 'be at least ' + value);
});


internals.addMethod(['below', 'lessThan'], function (value) {

    return this.assert(this._ref < value, 'be below ' + value);
});


internals.addMethod(['most', 'max'], function (value) {

    return this.assert(this._ref <= value, 'be at most ' + value);
});


internals.addMethod(['within', 'range'], function (from, to) {

    return this.assert(this._ref >= from && this._ref <= to, 'be within ' + from + '..' + to);
});


internals.addMethod('between', function (from, to) {

    return this.assert(this._ref > from && this._ref < to, 'be between ' + from + '..' + to);
});


internals.addMethod('about', function (value, delta) {

    internals.assert(this, internals.type(this._ref) === 'number', 'Can only assert about on numbers');
    internals.assert(this, internals.type(value) === 'number' && internals.type(delta) === 'number', 'About assertion requires two number arguments');

    return this.assert(Math.abs(this._ref - value) <= delta, 'be about ' + value + ' \u00b1' + delta);
});


internals.addMethod(['instanceof', 'instanceOf'], function (type) {

    return this.assert(this._ref instanceof type, 'be an instance of ' + (type.name || 'provided type'));
});


internals.addMethod(['match', 'matches'], function (regex) {

    return this.assert(regex.exec(this._ref), 'match ' + regex);
});


internals.addMethod(['satisfy', 'satisfies'], function (validator) {

    return this.assert(validator(this._ref), 'satisfy rule');
});


internals.addMethod(['throw', 'throws'], function (/* type, message */) {

    internals.assert(this, typeof this._ref === 'function', 'Can only assert throw on functions');
    internals.assert(this, !this._flags.not || !arguments.length, 'Cannot specify arguments when expecting not to throw');

    var type = arguments.length && typeof arguments[0] !== 'string' && !(arguments[0] instanceof RegExp) ? arguments[0] : null;
    var lastArg = arguments[1] || arguments[0];
    var message = typeof lastArg === 'string' || lastArg instanceof RegExp ? lastArg : null;

    var thrown = false;

    try {
        this._ref();
    }
    catch (err) {
        thrown = true;

        if (type) {
            this.assert(err instanceof type, 'throw ' + (type.name || 'provided type'));
        }

        if (message !== null) {
            var error = err.message || '';
            this.assert(typeof message === 'string' ? error === message : error.match(message), 'throw an error with specified message', error, message);
        }

        this.assert(thrown, 'throw an error', err);
    }

    return this.assert(thrown, 'throw an error');
});


internals.display = function (value) {

    var string = NodeUtil.inspect(value);
    if (string.length <= 40) {
        return string;
    }

    if (Array.isArray(value)) {
        return '[Array(' + value.length + ')]';
    }

    if (typeof value === 'object') {
        var keys = Object.keys(value);
        return '{ Object (' + (keys.length > 2 ? (keys.splice(0, 2).join(', ') + ', ...') : keys.join(', ')) + ') }';
    }

    return string.slice(0, 40) + '...\'';
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


internals.assert = function (assertion, condition, error) {

    if (!condition) {
        delete internals.locations[assertion._location];
        Hoek.assert(condition, error);
    }
};
