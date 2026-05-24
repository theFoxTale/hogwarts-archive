import { API_CONFIG } from '../constants';
import * as realService from './realService';
import * as mockService from './mockService';

const service = API_CONFIG.USE_MOCK_API ? mockService : realService;

export const searchCharacters = service.searchCharacters;
export const getCharacterById = service.getCharacterById;
