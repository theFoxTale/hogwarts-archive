import { NextRequest } from 'next/server';
import { vi } from 'vitest';

import { getCharacterById } from '@api';

vi.mock('@api', () => ({
  getCharacterById: vi.fn(),
}));

import { POST } from '@/app/api/export-csv/route';

const getCharacter = vi.mocked(getCharacterById);

function postCsv(body: unknown) {
  return POST(
    new NextRequest('http://localhost/api/export-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  );
}

describe('POST /api/export-csv', () => {
  beforeEach(() => {
    getCharacter.mockReset();
  });

  test('returns 400 when ids are missing or empty', async () => {
    const empty = await postCsv({ ids: [] });
    expect(empty.status).toBe(400);
    await expect(empty.json()).resolves.toEqual({
      error: 'No character IDs provided',
    });

    const missing = await postCsv({});
    expect(missing.status).toBe(400);
  });

  test('returns CSV with a Wiki column from getCharacterById', async () => {
    getCharacter.mockResolvedValue({
      id: '1',
      name: 'Harry Potter',
      house: 'Gryffindor',
      species: 'Human',
      gender: 'Male',
      image: null,
      born: '31 July 1980',
      died: null,
      blood_status: 'Half-blood',
      nationality: 'British',
      patronus: 'Stag',
      wands: ['Holly, 11", Phoenix feather'],
      jobs: ['Head of Auror Office'],
      wiki: 'https://harrypotter.fandom.com/wiki/Harry_Potter',
    });

    const response = await postCsv({ ids: ['1'] });
    const csv = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/csv');
    expect(response.headers.get('Content-Disposition')).toBe(
      'attachment; filename="1_magical_beings.csv"'
    );
    expect(getCharacter).toHaveBeenCalledWith('1');
    expect(csv.startsWith('Name;House;')).toBe(true);
    expect(csv).toContain('Wiki');
    expect(csv).toContain('Harry Potter');
    expect(csv).toContain('https://harrypotter.fandom.com/wiki/Harry_Potter');
  });
});
