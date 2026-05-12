import type { Character, PaginationInfo } from '../../api';

export const mockCharacters: Character[] = [
  {
    name: 'Harry Potter',
    house: 'Gryffindor',
    species: 'Human',
    gender: 'Male',
    image: null,
  },
  {
    name: 'Hermione Granger',
    house: 'Gryffindor',
    species: 'Human',
    gender: 'Female',
    image: null,
  },
];

export const mockPaginationInfo: PaginationInfo = {
  pagination: { current: 1, next: 2, records: 10, last: 5 },
  links: { self: '', next: '' },
};

export const mockSearchResponse = {
  items: mockCharacters,
  pages: mockPaginationInfo,
};
