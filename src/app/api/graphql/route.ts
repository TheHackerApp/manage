import { cookies as requestCookies } from 'next/headers';

export const runtime = 'edge';

const UPSTREAM_URL = new URL(process.env.API_UPSTREAM + '/graphql');

async function processRequest(request: Request): Promise<Response> {
  const cookies = requestCookies();
  const session = cookies.get('session');

  const headers = new Headers({
    'Accept-Encoding': request.headers.get('accept-encoding') ?? 'identity',
    'Content-Type': request.headers.get('content-type') ?? 'application/json',
  });
  if (session !== undefined) headers.set('Authorization', `Bearer ${session.value}`);

  const slug = request.headers.get('event-slug');
  if (slug !== null) headers.set('event-slug', slug);
  else headers.set('event-domain', request.headers.get('host')!);

  console.log(Object.fromEntries(headers));

  const url = new URL(request.url);
  url.host = UPSTREAM_URL.host;
  url.pathname = UPSTREAM_URL.pathname;

  let response;
  try {
    response = await fetch(url, {
      method: request.method,
      body: request.body,
      headers,
      // @ts-expect-error duplex is needed to make proxying response bodies work, but it is not part of the type
      duplex: 'half',
    });
  } catch (e) {
    return new Response(JSON.stringify({ errors: [{ message: 'fetch failed' }] }));
  }

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-encoding');

  return new Response(response.body, { headers: responseHeaders });
}

export const GET = processRequest;
export const POST = processRequest;
