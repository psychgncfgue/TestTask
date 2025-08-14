import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, locales } from './app/constants/locales';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/api/') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return;
    }

    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}`)
    );

    if (pathnameIsMissingLocale) {
        const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;

        const headerLang = req.headers.get('accept-language');
        const browserLocale = headerLang
            ?.split(',')
            .map(lang => lang.split(';')[0].split('-')[0].trim())
            .find(lang => locales.includes(lang));

        const locale = cookieLocale || browserLocale || defaultLocale;

        return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};