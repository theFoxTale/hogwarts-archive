import { NextRequest, NextResponse } from 'next/server';

import { getCharacterById, type Character } from '@api';

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return '';

  const stringValue = String(value);
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

// Преобразование массива в строку (без экранирования)
function arrayToString(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return '';
  return arr.join(', ');
}

function generateCSV(characters: Character[]): string {
  const headers = [
    'Name',
    'House',
    'Species',
    'Gender',
    'Blood Status',
    'Nationality',
    'Born',
    'Died',
    'Patronus',
    'Wands',
    'Jobs',
    'Wiki',
  ];

  const rows = characters.map((character) => {
    return [
      escapeCSV(character.name),
      escapeCSV(character.house),
      escapeCSV(character.species),
      escapeCSV(character.gender),
      escapeCSV(character.blood_status),
      escapeCSV(character.nationality),
      escapeCSV(character.born),
      escapeCSV(character.died),
      escapeCSV(character.patronus),
      escapeCSV(arrayToString(character.wands)),
      escapeCSV(arrayToString(character.jobs)),
      escapeCSV(character.wiki),
    ].join(';');
  });

  return [headers.join(';'), ...rows].join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids: string[] = body.ids;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'No character IDs provided' },
        { status: 400 }
      );
    }

    const characters = await Promise.all(ids.map((id) => getCharacterById(id)));

    const csv = generateCSV(characters);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${ids.length}_magical_beings.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);

    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}
