declare namespace Code {

  interface CodeStatic {
    expect: any;
  }
}

declare var code: Code.CodeStatic;

declare module 'code' {
    export = code;
}
