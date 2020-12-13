import { extname, join } from 'path'
import { readFileSync } from 'fs'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

global.React = React

export default (entrypoint: string) => {
    const ext = extname(entrypoint)

    switch(ext) {
        case '.html':
            return readFileSync(entrypoint).toString()
        case '.js':
            const component = require(entrypoint).default
            return renderToStaticMarkup(React.createElement(component))
    }

    return ''
}
