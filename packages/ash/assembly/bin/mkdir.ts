export function main(args: string[]): void {
    if (args.length > 1) {
        let result = fs.createDirectory(args[1])
        if (result.failed) {
          Console.error("Failed.")
        }
    }
}
