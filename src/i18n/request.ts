import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, DEFAULT_TIMEZONE } from './config';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale || DEFAULT_LOCALE;

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
    timeZone: DEFAULT_TIMEZONE,
  };
});
