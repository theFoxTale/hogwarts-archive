import type { Character, PaginationInfo } from '../../api';

export const mockHarryCharacter: Character = {
  id: 'harry-1',
  name: 'Harry Potter',
  house: 'Gryffindor',
  species: 'Human',
  gender: 'Male',
  image: null,
};

export const mockHermioneCharacter: Character = {
  id: 'hermione-1',
  name: 'Hermione Granger',
  house: 'Gryffindor',
  species: 'Human',
  gender: 'Female',
  image: null,
};

export const mockCharacters: Character[] = [
  mockHarryCharacter,
  mockHermioneCharacter,
];

export const mockPaginationInfo: PaginationInfo = {
  pagination: { current: 1, next: 2, records: 10, last: 5 },
  links: { self: '', next: '' },
};

export const mockSearchResponse = {
  items: mockCharacters,
  pages: mockPaginationInfo,
};

export const mockSearchSecondResponse = {
  items: [
    {
      id: 'ron-1',
      name: 'Ron',
      house: null,
      species: null,
      gender: null,
      image: null,
    },
  ],
  pages: {
    pagination: {
      current: 2,
      prev: 1,
      next: 3,
      records: 10,
      last: 5,
    },
  },
};

export const emptySearchResult = {
  ok: true,
  json: async () => ({
    data: [],
    meta: {
      pagination: {},
    },
    links: {},
  }),
};
