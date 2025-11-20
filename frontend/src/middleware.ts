import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

const AUTH_COOKIE_NAME = 'token';
const AUTH_PATHS = ['/auth/login', '/auth/registration'];
const LOGIN_PATH = '/auth/login';
const DEFAULT_REDIRECT_PATH = '/';

export function middleware(request: NextRequest) {

    // console.log(`>>> Middleware triggered for path: ${request.nextUrl.pathname}`); можно включить для отладки

    const url = request.nextUrl.clone();
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    const isOnAuthPath = AUTH_PATHS.some(path => pathname.startsWith(path));

    // --- Логика для НЕавторизованных пользователей ---
    if (!authToken) {
        if (!isOnAuthPath) {
            url.pathname = LOGIN_PATH;
            if (!AUTH_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
                url.searchParams.set('from', request.nextUrl.pathname);
            } else {
                url.searchParams.delete('from');
            }
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // --- Логика АВТОРИЗОВАННЫХ пользователей ---
    if (authToken) {
        if (isOnAuthPath) {
            url.pathname = DEFAULT_REDIRECT_PATH;
            url.search = '';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
}
