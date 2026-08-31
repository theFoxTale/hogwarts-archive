'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { FrameButton } from '@ui';
import { Link } from '@/i18n/navigation';

import './error.css';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="route-error">
      <h1 className="route-error__title magic-title">{lang('title')}</h1>
      <p className="magic-subtitle">{lang('description')}</p>
      <div className="route-error__actions">
        <FrameButton className="route-error__button" onClick={reset}>
          {lang('tryAgain')}
        </FrameButton>
        <Link href="/">
          <FrameButton className="route-error__button">
            {lang('home')}
          </FrameButton>
        </Link>
      </div>
    </div>
  );
}
