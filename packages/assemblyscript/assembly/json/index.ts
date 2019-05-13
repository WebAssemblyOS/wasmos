import { JSONDecoder, JSONEncoder } from "../../node_modules/assemblyscript-json/assembly";
import { JSONHandler } from "../../node_modules/assemblyscript-json/assembly/decoder";

export namespace JSON {
    export enum Val_Type {
        STRING = 0,
        NUMBER = 1,
        BOOL = 2,
        NULL = 3,
        ARRAY = 4,
        OBJECT = 5
    }
    export abstract class Value {
        constructor(public val: string, public type: Val_Type) { }

        static String(str: string): Value {
            return new Str(str)
        }
        static Number(num: i64): Value {
            return new Number(num)
        }
        static Bool(b: bool): Value {
            return new Bool(b)
        }
        static Null(): Value {
            return new Null();
        }
        static Array(): Value {
            return new Arr();
        }
        static Object(): Value {
            return new Object();
        }
    }

    export class Str extends Value {
        constructor(val: string) {
            super(val, Val_Type.STRING);
        }
    }
    export class Number extends Value {
        constructor(public num: i64) {
            //@ts-ignore
            super(num.toString(), Val_Type.NUMBER);
        }
    }

    export class Null extends Value {
        constructor() {
            super("null", Val_Type.NULL);
        }
    }

    export class Bool extends Value {
        constructor(public bool: bool) {
            super(bool ? "true" : "false", Val_Type.BOOL);
        }
    }

    export class Arr extends Value {
        array: Array<Value> = new Array<Value>();
        constructor() {
            super("", Val_Type.ARRAY);
        }
    }

    export class Object extends Value {
        obj: Map<string, Value> = new Map<string, Value>();
        keys: Array<string> = new Array<string>();

        constructor() {
            super("", Val_Type.OBJECT);
        }

        set(key: string, value: Value): void {
            if (!this.obj.has(key)) {
                this.keys.push(key);
            }
            this.obj.set(key, value);
        }

        getString(key: string): string {
            let str = this.obj.get(key).val
            return str;
        }

        getObject(key: string): Object {
            return (this.obj.get(key) as Object);
        }

        getArray(key: string): Array<Value> {
            return (this.obj.get(key) as Arr).array;
        }

        getBool(key: string): bool {
            return (this.obj.get(key) as Bool).bool;
        }

        getNumber(key: string): i64 {
            return (this.obj.get(key) as Number).num;
        }

        getNull(key: string): Value | null {
            let val = this.obj.get(key);
            return val.val == "null" ? null : val;
        }

    }

    export class Handler extends JSONHandler {
        map: Map<string, Value> = new Map<string, Value>();
        stack: Value[];
        constructor() {
            super();
            this.stack = new Array<Value>();
        }

        get peek(): Value {
            return this.stack[this.stack.length - 1];
        }

        setString(name: string, value: string): void {
            let obj: Value = Value.String(value);
            this.addValue(name, obj);
        }

        setBoolean(name: string, value: bool): void {
            let obj = Value.Bool(value);
            this.addValue(name, obj);
        }

        setNull(name: string): void {
            let obj = Value.Null();
            this.addValue(name, obj);
        }

        setInteger(name: string, value: i64): void {
            let obj = Value.Number(value);
            this.addValue(name, obj);
        }

        pushArray(name: string): bool {
            let obj: Value = Value.Array();
            this.addValue(name, obj);
            this.stack.push(obj);
            return true;
        }

        popArray(): void {
            if (this.stack.length > 1) {
                this.stack.pop();
            }
        }

        pushObject(name: string): bool {
            let obj: Value = Value.Object();
            this.addValue(name, obj);
            this.stack.push(obj)
            return true;
        }

        popObject(): void {
            if (this.stack.length > 1)
                this.stack.pop();
        }

        addValue(name: string, obj: Value): void {
            if (name == null && obj.type == Val_Type.OBJECT) {
                this.stack.push(obj);
                return;
            }
            if (this.peek.type == Val_Type.OBJECT) {
                (this.peek as Object).set(name, obj)
            }
            else if (this.peek.type == Val_Type.ARRAY) {
                (this.peek as Arr).array.push(obj);
            }
        }
    }

    export function parse(str: string): Object {
        let buffer: Uint8Array = new Uint8Array(str.lengthUTF8);
        let utf8ptr = str.toUTF8();
        // TODO: std should expose memcpy?
        memory.copy(buffer.buffer.data, utf8ptr, buffer.byteLength);
        let handler = new Handler();
        let decoder: JSONDecoder<JSON.Handler> = new JSONDecoder(handler);
        decoder.deserialize(buffer);
        return handler.peek as Object;

    }
}

//@ts-ignore
// @global
export { JSONDecoder as Decoder, JSONEncoder as Encoder }




