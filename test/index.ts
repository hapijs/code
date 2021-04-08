import * as Code from '..';
import * as Lab from '@hapi/lab';


const { expect } = Lab.types;


// settings

Code.settings.comparePrototypes = true;
Code.settings.comparePrototypes = false;

Code.settings.truncateMessages = true;
Code.settings.truncateMessages = false;

expect.type<Code.Settings>(Code.settings);
expect.type<boolean>(Code.settings.comparePrototypes);
expect.type<boolean>(Code.settings.truncateMessages);

expect.error(Code.settings.x);
expect.error(Code.settings.comparePrototypes = 1);


// fail()

Code.fail('something is wrong');        // $lab:types:skip$
Code.fail();                            // $lab:types:skip$

expect.type<void>(Code.fail('error'));  // $lab:types:skip$

expect.error(Code.fail(123));


// count()

Code.count();

expect.type<number>(Code.count());

expect.error(Code.count(123));


// incomplete()

Code.incomplete();

expect.type<string[] | null>(Code.incomplete());

expect.error(Code.incomplete(123));


// thrownAt()

Code.thrownAt();
Code.thrownAt(new Error());

const location = Code.thrownAt(new Error('oops'));

expect.type<Code.thrownAt.Location>(location);
expect.type<string>(location.column);
expect.type<string>(location.filename);
expect.type<string>(location.line);

expect.error(Code.thrownAt('abc'));


// expect()

Code.expect(10).to.be.above(5);
Code.expect('abc').to.be.a.string();
Code.expect([1, 2]).to.be.an.array();
Code.expect(20).to.be.at.least(20);
Code.expect('abc').to.have.length(3);
Code.expect('abc').to.be.a.string().and.contain(['a', 'b']);
Code.expect(6).to.be.in.range(5, 6);

Code.expect(10).to.not.be.above(20);
Code.expect([1, 2, 3]).to.shallow.include(3);
Code.expect([1, 1, 2]).to.only.include([1, 2]);
Code.expect([1, 2]).to.once.include([1, 2]);
Code.expect([1, 2, 3]).to.part.include([1, 4]);

Code.expect(10, 'Age').to.be.above(5);

const test = function () {

    return arguments;
};

Code.expect(test()).to.be.arguments();
Code.expect([1, 2]).to.be.an.array();
Code.expect(true).to.be.a.boolean();
Code.expect(new Date()).to.be.a.date();

const err = new Error('Oops an error occurred.');
Code.expect(err).to.be.an.error();
Code.expect(err).to.be.an.error(Error);
Code.expect(err).to.be.an.error('Oops an error occurred.');
Code.expect(err).to.be.an.error(Error, /occurred/);

Code.expect(function () { }).to.be.a.function();
Code.expect(123).to.be.a.number();
Code.expect(/abc/).to.be.a.regexp();
Code.expect('abc').to.be.a.string();
Code.expect({ a: '1' }).to.be.an.object();
Code.expect(true).to.be.true();
Code.expect(false).to.be.false();
Code.expect(null).to.be.null();
Code.expect(undefined).to.be.undefined();

Code.expect('abc').to.include('ab');
Code.expect('abc').to.only.include('abc');
Code.expect('aaa').to.only.include('a');
Code.expect('abc').to.once.include('b');
Code.expect('abc').to.include(['a', 'c']);
Code.expect('abc').to.part.include(['a', 'd']);

Code.expect([1, 2, 3]).to.include(1);
Code.expect([{ a: 1 }]).to.include({ a: 1 });
Code.expect([1, 2, 3]).to.include([1, 2]);
Code.expect([{ a: 1 }]).to.include([{ a: 1 }]);
Code.expect([1, 1, 2]).to.only.include([1, 2]);
Code.expect([1, 2]).to.once.include([1, 2]);
Code.expect([1, 2, 3]).to.part.include([1, 4]);
Code.expect([[1], [2]]).to.include([[1]]);

Code.expect({ a: 1, b: 2, c: 3 }).to.include('a');
Code.expect({ a: 1, b: 2, c: 3 }).to.include(['a', 'c']);
Code.expect({ a: 1, b: 2, c: 3 }).to.only.include(['a', 'b', 'c']);
Code.expect({ a: 1, b: 2, c: 3 }).to.only.include({ a: 1, b: 2, c: 3 });

Code.expect({ a: 1, b: 2, c: 3 }).to.include({ a: 1 });
Code.expect({ a: 1, b: 2, c: 3 }).to.part.include({ a: 1, d: 4 });
Code.expect({ a: [1], b: [2], c: [3] }).to.include({ a: [1], c: [3] });
Code.expect({ a: 1, b: { c: 3, d: 4 } }).to.part.include({ b: { c: 3 } });

interface TestType {
    a: number;
    b?: number;
    c?: number;
    d?: number;
}

interface TestType2 {
    a: number[];
    b?: number[];
    c: number[];
}

Code.expect<TestType>({ a: 1, b: 2, c: 3 }).to.include({ a: 1 });
Code.expect<TestType>({ a: 1, b: 2, c: 3 }).to.include({ c: 3 });
Code.expect<TestType>({ a: 1, b: 2, c: 3 }).to.include({ a: 1, c: 3 });
Code.expect<TestType>({ a: 1, b: 2, c: 3 }).to.part.include({ a: 1, d: 4 });
Code.expect<TestType2>({ a: [1], b: [2], c: [3] }).to.include({ a: [1], c: [3] });

Code.expect('abc').to.startWith('ab');
Code.expect('abc').to.endWith('bc');
Code.expect(4).to.exist();
Code.expect(null).to.not.exist();
Code.expect('').to.be.empty();
Code.expect('abc').to.have.length(3);
Code.expect(5).to.equal(5);
Code.expect({ a: 1 }).to.equal({ a: 1 });
Code.expect([1, 2, 3]).to.equal([1, 2, 3]);
Code.expect(Object.create(null)).to.equal({}, { prototype: false });
Code.expect(5).to.shallow.equal(5);
Code.expect({ a: 1 }).to.not.shallow.equal({ a: 1 });
Code.expect(10).to.be.above(5);
Code.expect(10).to.be.at.least(10);
Code.expect(10).to.be.below(20);
Code.expect(10).to.be.at.most(10);
Code.expect(10).to.be.within(10, 20);
Code.expect(20).to.be.within(10, 20);
Code.expect(15).to.be.between(10, 20);
Code.expect(10).to.be.about(9, 1);
Code.expect(new Date()).to.be.an.instanceof(Date);
Code.expect('a5').to.match(/\w\d/);
Code.expect(['abc', 'def']).to.match(/^[\w\d,]*$/);
Code.expect(1).to.match(/^\d$/);
Code.expect('x').to.satisfy(value => value === 'x');

const rejection = Promise.reject(new Error('Oh no!'));

await expect.type<Promise<any>>(Code.expect(rejection).to.reject('Oh no!'));
await expect.type<Promise<any>>(Code.expect(rejection).rejects('Oh no!'));

class CustomError extends Error { }

const throws = () => {

    throw new CustomError('Oh no!');
};

Code.expect(throws).to.throw(CustomError, 'Oh no!');

const typedRejection = Promise.reject(new CustomError('Oh no!'));
await expect.type<Promise<CustomError>>(Code.expect(typedRejection).to.reject(CustomError, 'Oh no!'));
await expect.type<Promise<CustomError>>(Code.expect(typedRejection).rejects(CustomError, 'Oh no!'));

await expect.type<Promise<null>>(Code.expect(Promise.resolve(true)).to.not.reject());
