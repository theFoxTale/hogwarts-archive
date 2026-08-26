import { searchCharactersAction } from '@/actions/characters';
import { HomePage } from '@views';

interface PageProps {
  searchParams: Promise<{ page?: string; characterId?: string; q?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const characterId = params.characterId || null;
  const searchQuery = params.q || '';

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
