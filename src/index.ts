import {
    BuildOptions,
    download,
    glob,
    createLambda,
    shouldServe,
    AnalyzeOptions,
    FileFsRef
} from '@vercel/build-utils'
import { join, extname, basename, dirname } from 'path'
import cpy from 'cpy'

export const version = 3

export { shouldServe }

export function analyze({ files, entrypoint }: AnalyzeOptions) {
	return files[entrypoint].digest;
}

export const build = async ({
    workPath,
    files,
    entrypoint,
    meta = {},
    config = {}
}: BuildOptions) => {
    await download(files, workPath, meta);

    const entryExt = extname(entrypoint).replace('.', '')
    const devCacheDir = join(workPath, '.vercel', 'cache')
    const distPath = join(devCacheDir, entryExt)


    if (entryExt === 'html') {
        await cpy([join(workPath, entrypoint)], join(distPath, dirname(entrypoint)))
    }

    const output = await createLambda({
        runtime: 'nodejs12.x',
        handler: 'runtime.handler',
        files: {
            'runtime.js': new FileFsRef({
                fsPath: join(__dirname, 'runtime.js')
            }),
            ...(await glob("**", distPath))
        },
        environment: {
            ENTRY_POINT: entryExt === 'tsx' ? `${basename(entrypoint, '.tsx')}.js` : entrypoint,
            IS_DEV: meta.isDev ? '1' : '0'
        }
    })

	return { output };
}
