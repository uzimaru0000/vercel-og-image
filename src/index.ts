import {
    BuildOptions,
    glob,
    createLambda,
    shouldServe,
    AnalyzeOptions,
} from '@vercel/build-utils'

import { join, extname, basename, dirname } from 'path'
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
    meta = {}
}: BuildOptions) => {
    const entryExt = extname(entrypoint).replace('.', '')
    const devCacheDir = join(workPath, '.vercel', 'cache')
    const distPath = join(devCacheDir, entryExt)

    if (entryExt === 'html') {
        await cpy([join(workPath, entrypoint)], join(distPath, dirname(entrypoint)))
    } else if (entryExt === 'tsx') {
        compiler(distPath, [join(workPath, entrypoint)])
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
            ENTRY_POINT: entryExt === 'tsx' ? `${basename(entrypoint, '.tsx')}.js` : entrypoint,
            IS_DEV: meta.isDev ? '1' : '0'
        }
    })

	return { output };
}
