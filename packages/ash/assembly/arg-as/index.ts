/**
 * This class is an argument parser.  Given a string it will create an arguments
 * object to be used by programs.
 */

/**
 * Types of option arguments
 */
enum ArgType {
  /** A boolean flag*/
  Flag = 0,
  /** String */
  String = 1,
  /** 32bit integer */
  Int = 2,
  /** 32bit float */
  Float = 3
}

type Value = i32;

class Argument<T> {
  constructor(public value: T){}
}


class Option {
  private _value: string | null = null;
  constructor(public name: string,
              public type: ArgType,
              public desc: string,
              public optional: bool) {}
  /**
   * Parsed options set the corresponding value.
   */
  set value(val: string | null){
    this._value = val;
  }

  get value(): string | null {
    return this._value;
  }

  parseInt(): i32 {
    return parseI32(this.value!)
  }

  parseFloat(): i32 {
    return parseFloat(this.value!)
  }

  parseBool(): bool {
    return this.value != null;
  }


}


export class Argas {
  desc: string;
  options: Map<string, Option>;
  optionNames: Array<string>;
  input: Array<string>;
  command: string;

  constructor(desc: string){
    this.options = new Map<string, Option>();
    this.input = new Array<string>();
    this.optionNames = new Array<string>();
    this.desc = desc;
  }

  /**
   * Used to add available options to print and to parse
   */
  addOption(name: string, type: ArgType, desc: string,
            _shortName: string = "", optional: boolean = false): void {
    this.optionNames.push(name);
    let shortName = _shortName ? _shortName : name.charAt(0);
    let option = new Option(name, type, desc, optional);
    this.options.set(name, option);
    this.options.set(shortName, option);
  }

  parse(args: string): void {
    let argv: string[] = args.split(" ");
    this.command = argv[0];
    let i: i32 = 1;
    while (i < argv.length){
      if (argv[i].startsWith("-")){
        if (argv[i].startsWith("--")){
           let option = this.options.get(argv[i].substr(2));
           if (option.type == ArgType.Flag){
             option.value = "";
           }else {
             i++;
             if (i == argv.length || argv[i].startsWith("--")){
               abort("Missing argument after " + option.name)
             }else{
               let val: string = argv[i];
               switch (option.type){
                 case ArgType.Int:
                 case ArgType.Float:
                 case ArgType.String: {
                   break;
                 }
                 default: {
                   abort("Argument Type does not exist");
                 }
               }
               option.value = val;
             }
           }
        }else{
          if (argv[i].length > 2){
            for(let j = 1; j < argv[1].length; j++){
              let opt = this.options.get(argv[i].charAt(j));
              if (opt.type != ArgType.Flag){
                abort("can't combine flag options with non-flag options");
              }
            }
          }
        }
      } else {
        this.input.push(argv[i])
      }
      i++;
    }
  }

  /**
   * When --help or -h is passed print out the options.
   */
  toString(): string{
    let descs = new Array<string>();
    descs.push("");
    descs.push("SYNTAX");
    descs.push("\t" + this.desc);
    descs.push("");
    descs.push("OPTIONS");
    for (let i = 0; i < this.optionNames.length; i++){
      let option = this.options.get(this.optionNames[i]);
      descs.push("\t--"+option.name + "\t\t" + option.desc);
    }
    return descs.join("\n");
  }

}
