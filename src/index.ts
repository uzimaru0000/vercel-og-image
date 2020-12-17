import {
    BuildOptions,
    glob,
    createLambda,
    shouldServe,
    AnalyzeOptions,
    download,
} from '@vercel/build-utils'
import { join, extname, dirname } from 'path'
import cpy from 'cpy'
import compiler from './lib/compiler'

export const version = 3

export { shouldServe }

export function analyze({ files, entrypoint }: AnalyzeOptions) {
	return files[entrypoint].digest;
}

export const build = async ({
    workPath,
    entrypoint,
    files,
    meta = {}
}: BuildOptions) => {
    const entryExt = extname(entrypoint).replace('.', '')
    const devCacheDir = join(workPath, '.vercel', 'cache')
    const distPath = join(devCacheDir, entryExt)

    await download(files, workPath, meta)

    if (entryExt === 'html') {
        await cpy([join(workPath, entrypoint)], join(distPath, dirname(entrypoint)))
    } else if (entryExt === 'tsx') {
        compiler(join(distPath, dirname(entrypoint)), [join(workPath, entrypoint)])
    }

    const file = {
        ...(await glob("**", distPath)),
        ...(await glob('**', join(__dirname, 'runtime')))
    }

    const output = await createLambda({
        runtime: 'nodejs10.x',
        handler: 'index.handler',
        files: file,
        environment: {
            ENTRY_POINT: entryExt === 'tsx' ? `${entrypoint.replace('.tsx', '')}.js` : entrypoint,
            IS_DEV: meta.isDev ? '1' : '0'
        }
    })

	return { output };
}
