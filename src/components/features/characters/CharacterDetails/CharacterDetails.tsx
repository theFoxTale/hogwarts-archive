import { useTranslations } from 'next-intl';
import { useParams, useNavigate } from 'react-router-dom';

import { OrnateFrame } from '@ui';
import { useGetCharacterByIdQuery } from '@api';

import { ANONYMOUS_DETAILS_IMAGE } from './constants';
import './CharacterDetails.css';

export function CharacterDetails() {
  const { page = '1', characterId } = useParams<{
    page?: string;
    characterId?: string;
  }>();
  const navigate = useNavigate();
  const lang = useTranslations('details');

  const {
    data: character,
    isLoading,
    isError,
    error,
  } = useGetCharacterByIdQuery(characterId!, {
    skip: !characterId,
  });

  const handleClose = () => {
    navigate(`/${page}`);
  };

  if (isLoading) {
    return <div className="details-loading">{lang('ui.loading')}</div>;
  }

  if (isError) {
    return (
      <div className="details-error">
        {(error as Error)?.message || lang('ui.error')}
      </div>
    );
  }

  if (!character) {
    return <div className="details-empty">{lang('ui.noCharacter')}</div>;
  }

  return (
    <OrnateFrame noInnerPadding>
      <div className="character-details">
        <button className="details-close" onClick={handleClose}>
          {lang('ui.close')}
        </button>
        <img
          src={character.image || ANONYMOUS_DETAILS_IMAGE}
          onError={(e) => (e.currentTarget.src = ANONYMOUS_DETAILS_IMAGE)}
          alt={character.name}
          className="details-image"
        />
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
