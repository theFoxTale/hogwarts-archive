import { useNavigate } from 'react-router-dom';
import { GoldCheckbox, RoundedFrame } from '../../components';
import type { Character } from '../../api';

import { getGenderIcon, getHouseIcon, getSpeciesIcon } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../store';
import { CHARACTER_CARD_STRINGS } from '../../constants';
import {
  selectIsSelected,
  toggleSelect,
} from '../../features/selectedItemsSlice';

import './CharacterCard.css';

interface CharacterCardProps {
  character: Character;
  currentPage: number;
}

export function CharacterCard({ character, currentPage }: CharacterCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(selectIsSelected(character.id));

  const handleCheckboxChange = () => {
    dispatch(toggleSelect(character));
  };

  const handleCardClick = () => {
    navigate(`/${currentPage}/${character.id}`);
  };

  return (
    <RoundedFrame className="variant-paper">
      <div className="character-card" onClick={handleCardClick}>
        {/* Чекбокс */}
        <div className="character-card__checkbox">
          <GoldCheckbox
            checked={isSelected}
            onChange={handleCheckboxChange}
            id={`char-${character.id}`}
          />
        </div>

        {/* Иконка факультета */}
        <div className="character-card__house-icon">
          <img
            src={getHouseIcon(character.house)}
            alt={character.house || 'house'}
          />
        </div>

        {/* Информация */}
        <div className="character-card__info">
          <div className="character-card__name magic-title-light">
            {character.name}
          </div>
          <div className="character-card__traits">
            <img
              src={getSpeciesIcon(character.species)}
              alt={character.species || 'species'}
              className="trait-icon"
            />
            <span className="trait__name">
              {character.species || CHARACTER_CARD_STRINGS.UNKNOWN}
            </span>
            <img
              src={getGenderIcon(character.gender)}
              alt={character.gender || 'gender'}
              className="trait-icon"
            />
            <span className="trait__name">
              {character.gender || CHARACTER_CARD_STRINGS.UNKNOWN}
            </span>
          </div>
        </div>
      </div>
    </RoundedFrame>
  );
}
