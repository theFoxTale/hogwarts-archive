import { useNavigate } from 'react-router-dom';

import type { Character } from '../../api';
import { ANONYMOUS_IMAGE, SEARCH_STRINGS, UI_MESSAGES } from '../../constants';
import { ActionButton, OrnateFrame } from '../../components';

import './CharacterCard.css';
import lineOrnamentIcon from '../../assets/images/character-ornament.png';
import endsOrnamentIcon from '../../assets/images/character-ends-ornament.png';

interface CharacterCardProps {
  character: Character;
  currentPage: number;
}

export function CharacterCard({ character, currentPage }: CharacterCardProps) {
  const { name, house, species, gender, image } = character;
  const hasDetails = !!(house || species || gender);

  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/details/${character.id}?page=${currentPage}`);
  };

  return (
    <OrnateFrame noInnerPadding className="variant-container">
      <div className="character-card">
        <div className="character-image-container">
          <img
            src={image || ANONYMOUS_IMAGE}
            onError={(e) => (e.currentTarget.src = ANONYMOUS_IMAGE)}
            alt={name}
            className="character-image"
          />
        </div>
        <div className="character-info-container">
          <h3 className="character-name" title={name}>
            {name}
          </h3>
          <div className="character__description">
            <img
              src={endsOrnamentIcon}
              alt={SEARCH_STRINGS.SEARCH_PARTS_TOOLTIP}
              className="character__ornament"
            />
            <p className="character__description-text">
              {SEARCH_STRINGS.SEARCH_DESCRIPTION}
            </p>
            <img
              src={endsOrnamentIcon}
              alt={SEARCH_STRINGS.SEARCH_PARTS_TOOLTIP}
              className="character__ornament character__ornament--mirrored"
            />
          </div>
          <img
            src={lineOrnamentIcon}
            alt={SEARCH_STRINGS.SEARCH_LINE_TOOLTIP}
            className="character-ornament"
          />
          <div className="character-details">
            {hasDetails ? (
              <>
                {house && (
                  <p className="character-details-text">
                    <strong>{SEARCH_STRINGS.CARD_HOUSE_LABEL}:</strong> {house}
                  </p>
                )}
                {species && (
                  <p className="character-details-text">
                    <strong>{SEARCH_STRINGS.CARD_SPECIES_LABEL}:</strong>{' '}
                    {species}
                  </p>
                )}
                {gender && (
                  <p className="character-details-text">
                    <strong>{SEARCH_STRINGS.CARD_GENDER_LABEL}:</strong>{' '}
                    {gender}
                  </p>
                )}
              </>
            ) : (
              <p className="character-details-text character-details-text--empty">
                {UI_MESSAGES.NO_DETAILS}
              </p>
            )}
          </div>
          <ActionButton onClick={handleViewDetails}>View Details</ActionButton>
        </div>
      </div>
    </OrnateFrame>
  );
}
