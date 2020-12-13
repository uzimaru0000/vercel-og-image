import { getScreenshot } from './lib/chromium';
import { join } from 'path'
import loader from './lib/loader'

const isDev = process.env.IS_DEV === '1';
const isHtmlDebug = process.env.OG_HTML_DEBUG === '1';

type Event = {
    body: string
}

type Context = {}

export const handler = async (event: Event) => {
    const body = JSON.parse(event.body);
    try {
        const html = loader(join(__dirname, process.env.ENTRY_POINT!))
        if (isHtmlDebug) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/html'
                },
                body: html
            }
        }

        const file = await getScreenshot(html, isDev);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': `image/png`,
                'Cache-Control': `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
            },
            body: file.toString('base64'),
            encoding: 'base64'
        }
    } catch (e) {
        console.log(e)

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/html'
            },
            body: '<h1>Internal Error</h1><p>Sorry, there was a problem</p>'
        }
    }
}
