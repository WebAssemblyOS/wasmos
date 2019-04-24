type u32 = number;

export class FileDescriptor {
  constructor(public id: u32, public offset: u32 = 0) {}
}
