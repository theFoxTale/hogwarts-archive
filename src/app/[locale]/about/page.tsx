import { getTranslations, setRequestLocale } from 'next-intl/server';

import { OrnateFrame, FrameButton } from '@ui';
import { Link } from '@/i18n/navigation';

import './about.css';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const lang = await getTranslations('about');

  return (
    <div className="about-container">
      <h1 className="about-title magic-title">{lang('header')}</h1>

      <div className="about-frames-container">
        <OrnateFrame className="variant-container">
          <p>{lang('description')}</p>
          <p>
            {lang('courseTitle')}:{' '}
            <a
              href="https://rs.school/react/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang('course')}
            </a>
          </p>
        </OrnateFrame>
        <OrnateFrame className="variant-container">
          <p>
            {lang('authorTitle')}:{' '}
            <a
              href="https://github.com/theFoxTale"
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang('author')}
            </a>
          </p>
        </OrnateFrame>
      </div>

      <Link href="/">
        <FrameButton className="not-found__button">
          {lang('button')}
        </FrameButton>
      </Link>
    </div>
  );
}
