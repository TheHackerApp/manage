import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import { isContextSuccess, loadContext } from '@/lib/context';

const MAINTENANCE = (process.env.MAINTENANCE ?? '').toLowerCase().charAt(0) === 't';
const SCHEME = process.env.SCHEME === 'production' ? 'https' : 'http';

const INTERNAL_SERVER_ERROR = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"></meta>
    <title>Internal Server Error</title>
  </head>
  <body>
    <h1>Internal Server Error</h1>
    <p>We couldn't process your request, please try again later</p>
  </body>
</html>
`;

export const config: MiddlewareConfig = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};

export async function middleware(request: NextRequest): Promise<NextResponse | undefined> {
  if (MAINTENANCE) return;

  const session = request.cookies.get('session');
  const host = request.headers.get('host')!;

  const context = await loadContext(session?.value, host);
  if (!isContextSuccess(context)) {
    // TODO: gracefully handle unknown event errors
    console.error(`[middleware] failed to get user info:`, context.errors.map((err) => err.message).join(', '));
    return internalServerError();
  }

  if (context.user.type !== 'authenticated') {
    const url = new URL('/login', process.env.NEXT_PUBLIC_ACCOUNTS_URL);
    url.searchParams.set('return-to', `${SCHEME}://${host}`);
    // TODO: handle returning to requested page

    return NextResponse.redirect(url, 302);
  }

  return;
}

function internalServerError(): NextResponse {
  return new NextResponse(INTERNAL_SERVER_ERROR, {
    status: 500,
    headers: { 'Content-Type': 'text/html;charset=utf-8' },
  });
}
