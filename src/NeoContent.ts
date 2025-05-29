export class NeoContent {
  #exports: Record<string, string> = {}
  // #contextCode: string[] = []

  // addContext (contextCode: string): void {
  //   this.#contextCode.push(contextCode)
  // }

  addExport (name: string, content: string): void {
    this.#exports[name] = content
  }

  export (): string {
    const keys = Object.keys(this.#exports)
    const lines = keys.map((entry) => {
      const value = this.#exports[entry]

      return `const ${entry} = ${value}`
    })

    return [...lines, `export { ${keys.join(', ') } }`].join('\n')
  }
}