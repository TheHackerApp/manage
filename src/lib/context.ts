export type Scope = AdminScope | UserScope | EventScope;

interface AdminScope {
  readonly kind: 'admin';
}

interface UserScope {
  readonly kind: 'user';
}

interface EventScope {
  readonly kind: 'event';
  readonly event: string;
  readonly organization_id: number;
}

export type User = UnauthenticatedUser | OAuthUser | RegistrationNeededUser | AuthenticatedUser;

interface UnauthenticatedUser {
  readonly type: 'unauthenticated';
}

interface OAuthUser {
  readonly type: 'oauth';
}

interface RegistrationNeededUser {
  readonly type: 'registration-needed';
}

interface AuthenticatedUser {
  readonly type: 'authenticated';
  readonly id: number;
  readonly given_name: string;
  readonly family_name: string;
  readonly email: string;
  readonly role: string | null;
  readonly is_admin: boolean;
}

export interface Error {
  readonly message: string;
}

export type ContextResult = SuccessResult | FailureResult;

interface SuccessResult {
  readonly user: User;
  readonly scope: Scope;
}

interface FailureResult {
  readonly errors: Error[];
}

export const isContextSuccess = (result: ContextResult): result is SuccessResult =>
  'user' in result && 'scope' in result;

export async function loadContext(token: string | undefined, hostname: string): Promise<ContextResult> {
  const headers = new Headers({ Accept: 'application/json', 'Event-Domain': hostname });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let content;
  try {
    const response = await fetch(process.env.API_UPSTREAM + '/me', {
      method: 'GET',
      headers,
    });
    content = await response.text();
  } catch (e) {
    console.error(`[context Failed to load context: ${e}`);
    return { errors: [{ message: 'failed to load context' }] };
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error(`[context] Failed to parse response: ${e} in ${content}`);
    return { errors: [{ message: 'failed to parse response' }] };
  }
}
