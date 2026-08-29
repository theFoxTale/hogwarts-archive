import { setRequestLocale } from 'next-intl/server';

import { searchCharactersAction } from '@/actions/characters';
import { HomePage } from '@views';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; characterId?: string; q?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const page = parseInt(query.page || '1', 10);
  const characterId = query.characterId || null;
  const searchQuery = query.q || '';

  const data = await searchCharactersAction(searchQuery, page);

  return (
    <HomePage
      initialResults={data.items}
      initialPages={data.pages}
      initialPage={page}
      initialCharacterId={characterId}
      initialSearchQuery={searchQuery}
    />
  );
}
