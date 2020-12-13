import { extname, join } from 'path'
import { readFileSync } from 'fs'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as URL from 'url'

global.React = React

export default (entrypoint: string, path: string) => {
    const ext = extname(entrypoint)

    switch(ext) {
        case '.html':
            return readFileSync(entrypoint).toString()
        case '.js':
            const component = require(entrypoint).default
            const props = {
                query: getQuery(path),
                path: URL.parse(path).pathname
            }
            return renderToStaticMarkup(React.createElement(component, props))
    }

    return ''
}

const getQuery = (url: string): { [key: string]: string } => {
    const query =  URL.parse(url).query || '';

    return query.split('&')
        .map(x => x.split('=') as [string, string])
        .reduce((acc, [key, val]) => ({...acc, [key]: val}), {})
}
