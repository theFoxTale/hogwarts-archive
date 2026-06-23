import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { GoldCheckbox, RoundedFrame } from '@ui';
import type { Character } from '@api';

import { getGenderIcon, getHouseIcon, getSpeciesIcon } from '@utils';
import { ANONYMOUS_CARD_IMAGE } from './constants';

import { useAppDispatch, useAppSelector } from '@store';
import { selectIsSelected, toggleSelect } from '@store/slices';

import './CharacterCard.css';

interface CharacterCardProps {
  character: Character;
  onSelect: (id: string) => void;
}

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  const lang = useTranslations('common');

  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(selectIsSelected(character.id));

  const handleCheckboxChange = () => {
    dispatch(toggleSelect(character));
  };

  const handleCardClick = () => {
    onSelect(character.id);
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
        <div className="character-card__image" style={{ position: 'relative' }}>
          <Image
            src={character.image || ANONYMOUS_CARD_IMAGE}
            onError={(e) => (e.currentTarget.src = ANONYMOUS_CARD_IMAGE)}
            alt={character.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="60px"
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
              <Image
                src={houseIcon}
                alt={houseName}
                className="trait-icon"
                width={20}
                height={20}
              />
              <span className="trait-name">{houseName}</span>
            </div>

            {/* Иконка и название вида */}
            <div className="trait-item">
              <Image
                src={speciesIcon}
                alt={speciesName}
                className="trait-icon"
                width={20}
                height={20}
              />
              <span className="trait-name">{speciesName}</span>
            </div>

            {/* Иконка и название пола */}
            <div className="trait-item">
              <Image
                src={genderIcon}
                alt={genderName}
                className="trait-icon"
                width={20}
                height={20}
              />
              <span className="trait-name">{genderName}</span>
            </div>
          </div>
        </div>
      </div>
    </RoundedFrame>
  );
}
