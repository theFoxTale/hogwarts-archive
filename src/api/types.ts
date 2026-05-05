export interface Character {
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

export interface ApiResponse {
  data: CharacterData[];
  meta?: {
    totalCount?: number;
    pageCount?: number;
  };
  links?: {
    self: string;
    first?: string;
    next?: string;
    prev?: string;
    last?: string;
  };
}
