export class ExportedContent {
    #internals = [];
    #exports = {};
    addExport(name, content) {
        this.#exports[name] = content;
    }
    addInternal(content) {
        this.#internals.push(content);
    }
    export() {
        const keys = Object.keys(this.#exports);
        const lines = keys.reduce((result, entry) => {
            const value = this.#exports[entry];
            if (value.length > 0) {
                result.push(`const ${entry} = ${value}`);
            }
            return result;
        }, []);
        const exportCode = [
            ...this.#internals,
            ...lines,
            `export { ${keys.join(', ')} }`,
        ].join('\n');
        // console.log('[TRANSFORMED]', exportCode)
        return exportCode;
    }
}
//# sourceMappingURL=ExportedContent.js.map