export interface Character {
  id: string;
  name: string;
  house: string | null;
  species: string | null;
  gender: string | null;
  image: string | null;
}

export interface CharacterData {
  id: string;
  type: string;
  attributes: Character;
}

export interface PaginationData {
  current: number;
  prev?: number;
  next?: number;
  last?: number;
  records: number;
}

export interface LinksData {
  self: string;
  first?: string;
  next?: string;
  prev?: string;
  last?: string;
}

export interface PaginationInfo {
  pagination?: PaginationData;
  links?: LinksData;
}

export interface ApiResponse {
  data: CharacterData[];
  meta?: {
    pagination?: PaginationData;
  };
  links?: LinksData;
}
