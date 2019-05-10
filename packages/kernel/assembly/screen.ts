
@external("host", "initScreen")
declare function initScreen<T>(view: ViewBuffer<T>): void;

export class Position {
  constructor(public col: i32, public row: i32){}
}

export class ViewBuffer<T> {
  data: Array<T>;
  width: i32;
  start: i32;

  /**
   * Given a buffer of characters
   */
  constructor(data: Array<T>, width: i32, start: i32){
    this.data = data;
    this.width = width;
    this.start = start;
    initScreen(this);
  }


}

export type CharBuffer = ViewBuffer<string>;
