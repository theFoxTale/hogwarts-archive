import { describe, it, expect } from 'vitest';

import {
  mockSearchCharacters,
  mockGetCharacterById,
} from '../../api/mockService';
import { mockCharacters } from '../../api/mockData';
import { API_CONFIG } from '@api';

describe('mockService', () => {
  describe('searchCharacters', () => {
    it('returns first page of characters when search term is empty', async () => {
      const result = await mockSearchCharacters('');
      expect(result.items).toHaveLength(API_CONFIG.ITEMS_PER_PAGE);
      expect(result.pages?.pagination?.records).toBe(mockCharacters.length);
      expect(result.pages?.pagination?.current).toBe(1);
    });

    it('returns all characters when itemsPerPage is large enough', async () => {
      const result = await mockSearchCharacters('', 1, 100);
      expect(result.items).toHaveLength(mockCharacters.length);
      expect(result.pages).toBeNull();
    });

    it('filters characters by name (case-insensitive)', async () => {
      const result = await mockSearchCharacters('harry');
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Harry Potter');
    });

    it('returns empty array and null pages when no match found', async () => {
      const result = await mockSearchCharacters('Voldemort');
      expect(result.items).toEqual([]);
      expect(result.pages).toBeNull();
    });

    it('paginates results correctly', async () => {
      const result = await mockSearchCharacters('', 1, 3);
      expect(result.items).toHaveLength(3);

      expect(result.items[0].name).toBe('Harry Potter');
      expect(result.items[2].name).toBe('Ron Weasley');

      expect(result.pages?.pagination?.current).toBe(1);
      expect(result.pages?.pagination?.next).toBe(2);
      expect(result.pages?.pagination?.last).toBe(
        Math.ceil(mockCharacters.length / 3)
      );
    });

    it('returns correct second page', async () => {
      const result = await mockSearchCharacters('', 2, 3);
      expect(result.items).toHaveLength(3);

      expect(result.items[0].name).toBe('Draco Malfoy');
      expect(result.items[2].name).toBe('Severus Snape');

      expect(result.pages?.pagination?.current).toBe(2);
      expect(result.pages?.pagination?.prev).toBe(1);
      expect(result.pages?.pagination?.next).toBe(3);
    });

    it('returns null pages when total items fit in one page', async () => {
      const result = await mockSearchCharacters('', 1, 100);
      expect(result.items).toHaveLength(mockCharacters.length);
      expect(result.pages).toBeNull();
    });

    it('respects custom itemsPerPage', async () => {
      const result = await mockSearchCharacters('', 1, 2);
      expect(result.items).toHaveLength(2);
      expect(result.pages?.pagination?.last).toBe(
        Math.ceil(mockCharacters.length / 2)
      );
    });
  });

  describe('getCharacterById', () => {
    it('returns character when id exists', async () => {
      const result = await mockGetCharacterById('1');
      expect(result.id).toBe('1');
      expect(result.name).toBe('Harry Potter');
    });

    it('throws error when character not found', async () => {
      await expect(mockGetCharacterById('not-existed')).rejects.toThrow(
        'No characters match your search.'
      );
    });
  });
});
