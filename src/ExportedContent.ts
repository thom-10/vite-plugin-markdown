export class ExportedContent {
  #internals: string[] = [];
  #exports: Record<string, string> = {}

  addExport (name: string, content: string): void {
    this.#exports[name] = content
  }
  addInternal (content: string) {
    this.#internals.push(content);
  }

  export (): string {
    const keys = Object.keys(this.#exports)
    const lines = keys.reduce<string[]>((result, entry) => {
      const value = this.#exports[entry]

      if (value.length > 0) {
        result.push(`const ${entry} = ${value}`)
      }
      return result
    }, [])
    const exportCode = [...this.#internals ,...lines, `export { ${keys.join(', ') } }`].join('\n')

    // console.log('[TRANSFORMED]', exportCode)
    return exportCode
  }
}