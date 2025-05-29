export class ExportedContent {
  #exports: Record<string, string> = {}

  addExport (name: string, content: string): void {
    this.#exports[name] = content
  }

  export (): string {
    const keys = Object.keys(this.#exports)
    const lines = keys.map((entry) => {
      const value = this.#exports[entry]

      return `const ${entry} = ${value}`
    })
    const exportCode = [...lines, `export { ${keys.join(', ') } }`].join('\n')
    return exportCode
  }
}