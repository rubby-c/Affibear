import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

const SUBDOMAIN_BLACKLIST = ['api'];

export async function middleware(req) {
    const url = req.nextUrl.clone();

    if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes('_next'))
        return;

    const host = req.headers.get('host');
    const subdomain = GetSubdomain(host);

    if (SUBDOMAIN_BLACKLIST.includes(subdomain)) {
        return;
    }

    if (subdomain === null) {
        const arr = new Headers(req.headers);
        arr.set('x-path', req.nextUrl.pathname);

        return NextResponse.next({
            request: {
                headers: arr
            }
        });
    }

    url.pathname = `/${subdomain}${url.pathname}`;

    return NextResponse.rewrite(url);
}

export const GetSubdomain = (host) => {
    let subdomain = null;

    if (!host && typeof window !== 'undefined') {
        host = window.location.host;
    }
    if (host && host.split('.').length === 3) {
        subdomain = host.split('.')[0];
    }

    return subdomain;
};