import type { Character } from '../api';

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

  const rows = characters.map((char) => {
    const detailsUrl = `${window.location.origin}/details/${char.id}`;
    return [
      escapeCSV(char.name),
      escapeCSV(char.house),
      escapeCSV(char.species),
      escapeCSV(char.gender),
      escapeCSV(detailsUrl),
    ].join(';');
  });

  const csvContent = [headers.join(';'), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'potter_api_characters.csv');

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
