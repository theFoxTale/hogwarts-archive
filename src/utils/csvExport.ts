import type { Character } from '../api';
import { CSV_EXPORT } from '../constants';

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

export function exportToCSV(characters: Character[]): void {
  if (characters.length === 0) return;

  const headers = ['Name', 'House', 'Species', 'Gender', 'Details URL'];

  const rows = characters.map((myCharacter) => {
    const detailsUrl = `${window.location.origin}/details/${myCharacter.id}`;
    return [
      escapeCSV(myCharacter.name),
      escapeCSV(myCharacter.house),
      escapeCSV(myCharacter.species),
      escapeCSV(myCharacter.gender),
      escapeCSV(detailsUrl),
    ].join(';');
  });

  const csvContent = [headers.join(';'), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;

  const fileName = `${characters.length}${CSV_EXPORT.FILE_NAME}.csv`;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
