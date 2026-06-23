import { useTranslations } from 'next-intl';
import { useNavigate } from 'react-router-dom';

import { GoldCheckbox, RoundedFrame } from '@ui';
import type { Character } from '@api';

import { getGenderIcon, getHouseIcon, getSpeciesIcon } from '@utils';
import { ANONYMOUS_CARD_IMAGE } from './constants';

import { useAppDispatch, useAppSelector } from '@store';
import { selectIsSelected, toggleSelect } from '@store/slices';

import './CharacterCard.css';

interface CharacterCardProps {
  character: Character;
  currentPage: number;
}

export function CharacterCard({ character, currentPage }: CharacterCardProps) {
  const lang = useTranslations('common');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(selectIsSelected(character.id));

  const handleCheckboxChange = () => {
    dispatch(toggleSelect(character));
  };

  const handleCardClick = () => {
    navigate(`/${currentPage}/${character.id}`);
  };

  const houseIcon = getHouseIcon(character.house);
  const houseName = character.house || lang('unknown');
  const speciesIcon = getSpeciesIcon(character.species);
  const speciesName = character.species || lang('unknown');
  const genderIcon = getGenderIcon(character.gender);
  const genderName = character.gender || lang('unknown');

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

        {/* Изображение персонажа */}
        <div className="character-card__image">
          <img
            src={character.image || ANONYMOUS_CARD_IMAGE}
            onError={(e) => (e.currentTarget.src = ANONYMOUS_CARD_IMAGE)}
            alt={character.name}
          />
        </div>

        {/* Информация */}
        <div className="character-card__info">
          <div className="character-card__name magic-title-light">
            {character.name}
          </div>
          <div className="character-card__traits">
            {/* Иконка и название факультета */}
            <div className="trait-item">
              <img src={houseIcon} alt={houseName} className="trait-icon" />
              <span className="trait-name">{houseName}</span>
            </div>

            {/* Иконка и название вида */}
            <div className="trait-item">
              <img src={speciesIcon} alt={speciesName} className="trait-icon" />
              <span className="trait-name">{speciesName}</span>
            </div>

            {/* Иконка и название пола */}
            <div className="trait-item">
              <img src={genderIcon} alt={genderName} className="trait-icon" />
              <span className="trait-name">{genderName}</span>
            </div>
          </div>
        </div>
      </div>
    </RoundedFrame>
  );
}
