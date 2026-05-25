import defaultFacultyIcon from '../assets/images/faculties/NoOne.png';
import gryffindorFacultyIcon from '../assets/images/faculties/Gryffindor.png';
import hufflepuffFacultyIcon from '../assets/images/faculties/Hufflepuff.png';
import ravenclawFacultyIcon from '../assets/images/faculties/Ravenclaw.png';
import slytherinFacultyIcon from '../assets/images/faculties/Slytherin.png';

import defaultGenderIcon from '../assets/images/gender/Default.png';
import maleGenderIcon from '../assets/images/gender/Male.png';
import femaleGenderIcon from '../assets/images/gender/Female.png';

import defaultSpeciesIcon from '../assets/images/species/Unknown.png';
import humanSpeciesIcon from '../assets/images/species/Human.png';
import catSpeciesIcon from '../assets/images/species/Cat.png';
import dogSpeciesIcon from '../assets/images/species/Dog.png';
import owlSpeciesIcon from '../assets/images/species/Owl.png';
import phoenixSpeciesIcon from '../assets/images/species/Phoenix.png';
import witchSpeciesIcon from '../assets/images/species/Witch.png';
import wizardSpeciesIcon from '../assets/images/species/Wizard.png';

export function getHouseIcon(house: string | null): string {
  if (!house) return defaultFacultyIcon;

  const mapping: Record<string, string> = {
    Gryffindor: gryffindorFacultyIcon,
    Hufflepuff: hufflepuffFacultyIcon,
    Ravenclaw: ravenclawFacultyIcon,
    Slytherin: slytherinFacultyIcon,
  };

  return mapping[house] || defaultFacultyIcon;
}

export function getGenderIcon(gender: string | null): string {
  if (!gender) return defaultGenderIcon;

  const normalized = gender.toLowerCase();
  if (normalized === 'male') return maleGenderIcon;
  if (normalized === 'female') return femaleGenderIcon;

  return defaultGenderIcon;
}

export function getSpeciesIcon(species: string | null): string {
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
}
