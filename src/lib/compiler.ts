import ts from 'typescript'

export default (outDir: string, rootNames: string[]) => {
    const program = ts.createProgram(rootNames, {
        strict: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        lib: [
            "esnext"
        ],
        jsx: ts.JsxEmit.React,
        outDir
    })

    return program.emit()
}
