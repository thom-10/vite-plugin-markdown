export class ExportedContent {
  #exports: string[] = []
  #contextCode = ''

  addContext (contextCode: string): void {
    this.#contextCode += `${contextCode}\n`
  }

  addExporting (exported: string): void {
    this.#exports.push(exported)
  }

  export (): string {
    return [this.#contextCode, `export { ${this.#exports.join(', ')} }`].join('\n')
  }
}