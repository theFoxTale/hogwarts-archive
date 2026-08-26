import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { OrnateFrame } from '@ui';
import { Character } from '@api';

import { ANONYMOUS_DETAILS_IMAGE } from './constants';

import './CharacterDetails.css';
import { useEffect, useState } from 'react';
import { getCharacterAction } from '@/actions/characters';

interface CharacterDetailsProps {
  characterId: string;
  onClose: () => void;
}

export function CharacterDetails({
  characterId,
  onClose,
}: CharacterDetailsProps) {
  const lang = useTranslations('details');

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getCharacterAction(characterId)
      .then((data) => {
        if (!cancelled) setCharacter(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [characterId]);

  if (isLoading) {
    return <div className="details-loading">{lang('ui.loading')}</div>;
  }

  if (error) {
    return <div className="details-error">{error || lang('ui.error')}</div>;
  }

  if (!character) {
    return <div className="details-empty">{lang('ui.noCharacter')}</div>;
  }

  return (
    <OrnateFrame noInnerPadding>
      <div className="character-details">
        <button className="details-close" onClick={onClose}>
          {lang('ui.close')}
        </button>
        <div
          className="details-image-wrapper"
          style={{ position: 'relative', width: '150px', height: '150px' }}
        >
          <Image
            src={character.image || ANONYMOUS_DETAILS_IMAGE}
            onError={(e) => (e.currentTarget.src = ANONYMOUS_DETAILS_IMAGE)}
            alt={character.name}
            className="details-image"
            fill
            style={{ objectFit: 'cover' }}
            sizes="150px"
          />
        </div>
        <h2 className="details-title magic-title">{character.name}</h2>

        <div className="details-section">
          <h3 className="magic-subtitle">{lang('ui.basicInfo')}</h3>
          <p>
            <strong>{lang('labels.house')}:</strong>{' '}
            {character.house || lang('labels.unknown')}
          </p>
          <p>
            <strong>{lang('labels.species')}:</strong>{' '}
            {character.species || lang('labels.unknown')}
          </p>
          <p>
            <strong>{lang('labels.gender')}:</strong>{' '}
            {character.gender || lang('labels.unknown')}
          </p>
        </div>

        {character.born && (
          <div className="details-section">
            <h3 className="magic-subtitle">{lang('ui.life')}</h3>
            <p>
              <strong>{lang('labels.born')}:</strong> {character.born}
            </p>
            <p>
              <strong>{lang('labels.died')}:</strong>{' '}
              {character.died || lang('labels.stillAlive')}
            </p>
          </div>
        )}

        {(character.blood_status || character.nationality) && (
          <div className="details-section">
            <h3 className="magic-subtitle">{lang('ui.heritage')}</h3>
            {character.blood_status && (
              <p>
                <strong>{lang('labels.bloodStatus')}:</strong>{' '}
                {character.blood_status}
              </p>
            )}
            {character.nationality && (
              <p>
                <strong>{lang('labels.nationality')}:</strong>{' '}
                {character.nationality}
              </p>
            )}
          </div>
        )}

        {character.patronus && (
          <div className="details-section">
            <h3 className="magic-subtitle">{lang('ui.magic')}</h3>
            <p>
              <strong>{lang('labels.patronus')}:</strong> {character.patronus}
            </p>
          </div>
        )}

        {character.wands && character.wands.length > 0 && (
          <div className="details-section">
            <h3 className="magic-subtitle">{lang('ui.wands')}</h3>
            <ul>
              {character.wands.map((wand, idx) => (
                <li key={idx}>{wand}</li>
              ))}
            </ul>
          </div>
        )}

        {character.jobs && character.jobs.length > 0 && (
          <div className="details-section">
            <h3 className="magic-subtitle">{lang('ui.occupations')}</h3>
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
