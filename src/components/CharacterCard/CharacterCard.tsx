import { useNavigate } from 'react-router-dom';
import { GoldCheckbox, RoundedFrame } from '../../components';
import type { Character } from '../../api';

import { useAppDispatch, useAppSelector } from '../../store';
import {
  selectIsSelected,
  toggleSelect,
} from '../../features/selectedItemsSlice';

import './CharacterCard.css';

import defaultFacultyIcon from '../../assets/images/faculties/NoOne.png';
import gryffindorFacultyIcon from '../../assets/images/faculties/Gryffindor.png';
import hufflepuffFacultyIcon from '../../assets/images/faculties/Hufflepuff.png';
import ravenclawFacultyIcon from '../../assets/images/faculties/Ravenclaw.png';
import slytherinFacultyIcon from '../../assets/images/faculties/Slytherin.png';

import defaultGenderIcon from '../../assets/images/gender/Default.png';
import maleGenderIcon from '../../assets/images/gender/Male.png';
import femaleGenderIcon from '../../assets/images/gender/Female.png';

import defaultSpeciesIcon from '../../assets/images/species/Unknown.png';
import humanSpeciesIcon from '../../assets/images/species/Human.png';
import catSpeciesIcon from '../../assets/images/species/Cat.png';
import dogSpeciesIcon from '../../assets/images/species/Dog.png';
import owlSpeciesIcon from '../../assets/images/species/Owl.png';
import phoenixSpeciesIcon from '../../assets/images/species/Phoenix.png';
import witchSpeciesIcon from '../../assets/images/species/Witch.png';
import wizardSpeciesIcon from '../../assets/images/species/Wizard.png';

const getHouseIcon = (house: string | null): string => {
  if (!house) return defaultFacultyIcon;

  const mapping: Record<string, string> = {
    Gryffindor: gryffindorFacultyIcon,
    Hufflepuff: hufflepuffFacultyIcon,
    Ravenclaw: ravenclawFacultyIcon,
    Slytherin: slytherinFacultyIcon,
  };

  return mapping[house] || defaultFacultyIcon;
};

const getGenderIcon = (gender: string | null): string => {
  if (!gender) return defaultGenderIcon;

  const normalized = gender.toLowerCase();
  if (normalized === 'male') return maleGenderIcon;
  if (normalized === 'female') return femaleGenderIcon;

  return defaultGenderIcon;
};

const getSpeciesIcon = (species: string | null): string => {
  if (!species) return defaultSpeciesIcon;

  const normalized =
    species.charAt(0).toUpperCase() + species.slice(1).toLowerCase();

  const mapping: Record<string, string> = {
    Human: humanSpeciesIcon,
    Cat: catSpeciesIcon,
    Dog: dogSpeciesIcon,
    Owl: owlSpeciesIcon,
    Phoenix: phoenixSpeciesIcon,
    Witch: witchSpeciesIcon,
    Wizard: wizardSpeciesIcon,
  };

  return mapping[normalized] || defaultSpeciesIcon;
};

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
              {character.species || 'Unknown'}
            </span>
            <img
              src={getGenderIcon(character.gender)}
              alt={character.gender || 'gender'}
              className="trait-icon"
            />
            <span className="trait__name">{character.gender || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </RoundedFrame>
  );
}
