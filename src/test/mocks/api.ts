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

export const mockSearchSecondResponse = {
  items: [
    {
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
