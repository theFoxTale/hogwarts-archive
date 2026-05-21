import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import { getCharacterById } from '../../api';
import type { Character } from '../../api';

import { OrnateFrame } from '../index.ts';
import { ANONYMOUS_IMAGE, UI_MESSAGES } from '../../constants.ts';

import './CharacterDetails.css';

export function CharacterDetails() {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId) return;

    queueMicrotask(() => {
      setLoading(true);
      getCharacterById(characterId)
        .then(setCharacter)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    });
  }, [characterId]);

  const handleClose = () => {
    navigate(`/?page=${page}`);
  };

  if (loading)
    return <div className="details-loading">{UI_MESSAGES.LOADING}</div>;
  if (error) return <div className="details-error">{error}</div>;
  if (!character)
    return <div className="details-empty">Select a character</div>;

  return (
    <OrnateFrame noInnerPadding>
      <div className="character-details">
        <button className="details-close" onClick={handleClose}>
          ✖
        </button>
        <img
          src={character.image || ANONYMOUS_IMAGE}
          onError={(e) => (e.currentTarget.src = ANONYMOUS_IMAGE)}
          alt={character.name}
        />
        <h2>{character.name}</h2>
        <p>
          <strong>House:</strong> {character.house || 'Unknown'}
        </p>
        <p>
          <strong>Species:</strong> {character.species || 'Unknown'}
        </p>
        <p>
          <strong>Gender:</strong> {character.gender || 'Unknown'}
        </p>
      </div>
    </OrnateFrame>
  );
}
