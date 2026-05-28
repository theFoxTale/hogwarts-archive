import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { OrnateFrame } from '@ui';
import { getCharacterById } from '@api';
import type { Character } from '@api';

import { ANONYMOUS_IMAGE, UI_MESSAGES, DETAILS_STRINGS } from '@constants';

import './CharacterDetails.css';

export function CharacterDetails() {
  const { page = '1', characterId } = useParams<{
    page?: string;
    characterId?: string;
  }>();
  const navigate = useNavigate();

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
    navigate(`/${page}`);
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
          {DETAILS_STRINGS.CLOSE}
        </button>
        <img
          src={character.image || ANONYMOUS_IMAGE}
          onError={(e) => (e.currentTarget.src = ANONYMOUS_IMAGE)}
          alt={character.name}
          className="details-image"
        />
        <h2 className="details-title magic-title">{character.name}</h2>

        <div className="details-section">
          <h3 className="magic-subtitle">{DETAILS_STRINGS.BASIC_INFO}</h3>
          <p>
            <strong>{DETAILS_STRINGS.HOUSE}:</strong>{' '}
            {character.house || DETAILS_STRINGS.UNKNOWN}
          </p>
          <p>
            <strong>{DETAILS_STRINGS.SPECIES}:</strong>{' '}
            {character.species || DETAILS_STRINGS.UNKNOWN}
          </p>
          <p>
            <strong>{DETAILS_STRINGS.GENDER}:</strong>{' '}
            {character.gender || DETAILS_STRINGS.UNKNOWN}
          </p>
        </div>

        {character.born && (
          <div className="details-section">
            <h3 className="magic-subtitle">{DETAILS_STRINGS.LIFE}</h3>
            <p>
              <strong>{DETAILS_STRINGS.BORN}:</strong> {character.born}
            </p>
            <p>
              <strong>{DETAILS_STRINGS.DIED}:</strong>{' '}
              {character.died || DETAILS_STRINGS.STILL_ALIVE}
            </p>
          </div>
        )}

        {(character.blood_status || character.nationality) && (
          <div className="details-section">
            <h3 className="magic-subtitle">{DETAILS_STRINGS.HERITAGE}</h3>
            {character.blood_status && (
              <p>
                <strong>{DETAILS_STRINGS.BLOOD_STATUS}:</strong>{' '}
                {character.blood_status}
              </p>
            )}
            {character.nationality && (
              <p>
                <strong>{DETAILS_STRINGS.NATIONALITY}:</strong>{' '}
                {character.nationality}
              </p>
            )}
          </div>
        )}

        {character.patronus && (
          <div className="details-section">
            <h3 className="magic-subtitle">{DETAILS_STRINGS.MAGIC}</h3>
            <p>
              <strong>{DETAILS_STRINGS.PATRONUS}:</strong> {character.patronus}
            </p>
          </div>
        )}

        {character.wands && character.wands.length > 0 && (
          <div className="details-section">
            <h3 className="magic-subtitle">{DETAILS_STRINGS.WANDS}</h3>
            <ul>
              {character.wands.map((wand, idx) => (
                <li key={idx}>{wand}</li>
              ))}
            </ul>
          </div>
        )}

        {character.jobs && character.jobs.length > 0 && (
          <div className="details-section">
            <h3 className="magic-subtitle">{DETAILS_STRINGS.OCCUPATIONS}</h3>
            <ul>
              {character.jobs.map((job, idx) => (
                <li key={idx}>{job}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </OrnateFrame>
  );
}
