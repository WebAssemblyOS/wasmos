import { RegExp } from "../regexp";

let a: RegExp;
let dot: RegExp;
let star: RegExp;

describe("literals ", (): void => {
  beforeAll(
    (): void => {
      a = new RegExp("a");
    }
  );

  it("test single 'a' with 'a'", (): void => {
    //log<string>("This will log a string");
    // let num = "abc"
    // log<string>(num[0])
    // var t = 0
    // while (num[t++] != "") {
    //   log<string>(num[t])
    // }
    expect<bool>(a.test("a")).toBeTruthy("Just a");
  });

  it("not test 'a' with 'b'", (): void => {
    expect<bool>(a.test("b")).toBeFalsy();
  });

  it("not test 'a' with 'bcdefghijk'", (): void => {
    expect<bool>(a.test("bcdefghijk")).toBeFalsy();
  });

  it("test 'a' with different words containing 'a'", (): void => {
    expect<bool>(a.test("ba")).toBeTruthy();
    expect<bool>(a.test("oeusnotehusntisnothua")).toBeTruthy();
    expect<bool>(a.test("oeusnoteahusntisnothua")).toBeTruthy();
  });

  it("match single 'a' with 'a'", (): void => {
    expect<i32>(a.match("a")).toBe(0);
  });

  it("match 'a' with different words containing 'a'", (): void => {
    expect<i32>(a.match("ba")).toBe(1);
    let str = "oeusnotehusntisnothua";
    expect<i32>(a.match(str)).toBe(str.indexOf("a"));
  });
});

describe("'.'", (): void => {
  beforeAll(
    (): void => {
      star = new RegExp(".*");
      dot = new RegExp(".");
    }
  );

  test(". tests any string", (): void => {
    expect<bool>(dot.test("abe 292 3 ---;; suc")).toBeTruthy();
    expect<i32>(dot.match("abeausntou e288o uc")).toBe(0);
  });

  test(".* matches any string", (): void => {
    expect<bool>(dot.test("abeuc")).toBeTruthy();
    expect<i32>(dot.match("abeuc")).toBe(0);
  });
});
let hatAB: RegExp;
let hatStar: RegExp;
describe("'^'", (): void => {
  beforeAll(
    (): void => {
      hatAB = new RegExp("^ab");
      hatStar = new RegExp("^.*");
    }
  );

  test("Should match strings with 'ab' in front", (): void => {
    expect<bool>(hatAB.test("abcdefg")).toBeTruthy();
    expect<i32>(hatAB.match("abcdefg")).toBe(0);
  });

  test("Should not match strings with 'ab' not in front", (): void => {
    expect<bool>(hatAB.test("cabcdefg")).toBeFalsy();
    expect<i32>(hatAB.match("cabcdefg")).toBe(-1);
  });

  test("'^.*' should match any string", (): void => {
    expect<bool>(hatStar.test("abcdefg")).toBeTruthy();
    expect<i32>(hatStar.match("abcdefg")).toBe(0);
  });
});

let dollarAB: RegExp;
let dollarStar: RegExp;
let hatDollarStar: RegExp;
describe("'$'", (): void => {
  beforeAll(
    (): void => {
      dollarAB = new RegExp("ab$");
      dollarStar = new RegExp(".*$");
      hatDollarStar = new RegExp("^ab.*ab$");
    }
  );

  test("Should match strings with 'ab' at the end", (): void => {
    expect<bool>(dollarAB.test("ab")).toBeTruthy();
    expect<i32>(dollarAB.match("ab")).toBe(0);
    expect<bool>(dollarAB.test("cdefgab")).toBeTruthy();
    expect<i32>(dollarAB.match("abcdeab")).toBe(5);
  });

  test("Should not match strings with 'ab' not at the end", (): void => {
    expect<bool>(dollarAB.test("cabcdefg")).toBeFalsy();
    expect<i32>(dollarAB.match("cabcdefg")).toBe(-1);
  });

  test("'.*$' should match any string", (): void => {
    expect<bool>(dollarStar.test("abcdefg")).toBeTruthy();
  });

  test("'^ab.*ab$' should match any string starting with ab and ending with ab", (): void => {
    expect<bool>(hatDollarStar.test("abcdefgab")).toBeTruthy();
    expect<i32>(hatDollarStar.match("abcdefgab")).toBe(0);
    expect<bool>(hatDollarStar.test("abcdueuaeouaoeuefgab")).toBeTruthy();
    expect<i32>(hatDollarStar.match("abcdouaoeuoeuaoeuefgab")).toBe(0);
    expect<bool>(hatDollarStar.test("abab")).toBeTruthy();
    expect<i32>(hatDollarStar.match("abab")).toBe(0);
  });

  test("'^ab.*ab$' should not match any string not starting with ab and ending with ab", (): void => {
    expect<bool>(hatDollarStar.test("aabcdefgab")).toBeFalsy();
    expect<i32>(hatDollarStar.match("aabcdefgab")).toBe(-1);
    expect<bool>(hatDollarStar.test("abcdueuaeouaoeuefgabb")).toBeFalsy();
    expect<i32>(hatDollarStar.match("abcdouaoeuoeuaoeuefgabb")).toBe(-1);
    expect<bool>(hatDollarStar.test("aabab")).toBeFalsy();
    expect<i32>(hatDollarStar.match("aabab")).toBe(-1);
  });
});
