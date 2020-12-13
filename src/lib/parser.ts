import { parse } from 'url';

export function parseRequest(url: string) {
    const { pathname } = parse(url || '/', true);

    const arr = (pathname || '/').slice(1).split('.');
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        arr.pop();
        text = arr.join('.');
    }

    return decodeURIComponent(text);
}
