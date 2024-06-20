import { cookies as requestCookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren, ReactNode } from 'react';

const VALID_THEMES = ['light', 'dark'];

const Provider = ({ children }: PropsWithChildren): ReactNode => {
  const cookies = requestCookies();
  const theme = cookies.get('theme')?.value;

  const forcedTheme = theme && VALID_THEMES.includes(theme) ? theme : undefined;
  return (
    <ThemeProvider attribute="class" forcedTheme={forcedTheme}>
      {children}
    </ThemeProvider>
  );
};

export default Provider;
