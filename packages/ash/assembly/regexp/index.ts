import "allocator/arena";

export class RegExp {
  public text: string;
  constructor(public regexp: string) {}

  match(text: string): i32 {
    this.text = text;
    return this._match(0, 0);
  }

  test(text: string): bool {
    return this.match(text) >= 0;
  }

  /** match: search for regexp anywhere in text
    @r index into regexp
    @t index into text
  */
  private _match(r: i32, t: i32): i32 {
    if (this.regexp.charAt(0) == "^") {
      return this.matchhere(r + 1, t) ? t : -1;
    }
    do {
      if (this.matchhere(r, t)) {
        return t;
      }
    } while (this.text.charAt(t++) != "");
    return -1;
  }

  /* matchhere: search for regexp at beginning of text */
  private matchhere(r: i32, t: i32): bool {
    if (this.regexp.charAt(r) == "") {
      return true;
    }
    if (this.regexp.charAt(r + 1) == "*") {
      return this.matchstar(r, r + 2, t);
    }
    if (this.regexp.charAt(r) == "$" && this.regexp.charAt(r + 1) == "") {
      return this.text.length == t;
    }
    if (
      this.text.charAt(t) != "" &&
      (this.regexp.charAt(r) == "." ||
        this.regexp.charAt(r) == this.text.charAt(t))
    ) {
      return this.matchhere(r + 1, t + 1);
    }
    return false;
  }

  /* matchstar: search for c*regexp at beginning of text */
  private matchstar(c: i32, r: i32, t: i32): bool {
    do {
      if (this.matchhere(r, t)) {
        return true;
      }
    } while (
      this.text.charAt(t) != "" &&
      (this.text.charAt(t++) == this.regexp.charAt(c) ||
        this.regexp.charAt(c) == ".")
    );
    return false;
  }

  toString(): string {
    return this.regexp;
  }
}
