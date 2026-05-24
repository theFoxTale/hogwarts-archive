export interface Character {
  id: string;
  name: string;
  house: string | null;
  species: string | null;
  gender: string | null;
  image: string | null;

  // Дополнительные поля для детального просмотра
  born?: string | null;
  died?: string | null;
  blood_status?: string | null;
  nationality?: string | null;
  patronus?: string | null;
  wands?: string[] | null;
  jobs?: string[] | null;
  alias_names?: string[];
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

export interface SearchResponse {
  items: Character[];
  pages: PaginationInfo | null;
}
