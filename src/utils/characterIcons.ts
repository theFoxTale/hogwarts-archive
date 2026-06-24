const defaultFacultyIcon = '/images/faculties/NoOne.png';
const gryffindorFacultyIcon = '/images/faculties/Gryffindor.png';
const hufflepuffFacultyIcon = '/images/faculties/Hufflepuff.png';
const ravenclawFacultyIcon = '/images/faculties/Ravenclaw.png';
const slytherinFacultyIcon = '/images/faculties/Slytherin.png';

const defaultGenderIcon = '/images/gender/Default.png';
const maleGenderIcon = '/images/gender/Male.png';
const femaleGenderIcon = '/images/gender/Female.png';

const defaultSpeciesIcon = '/images/species/Unknown.png';
const humanSpeciesIcon = '/images/species/Human.png';
const catSpeciesIcon = '/images/species/Cat.png';
const dogSpeciesIcon = '/images/species/Dog.png';
const owlSpeciesIcon = '/images/species/Owl.png';
const phoenixSpeciesIcon = '/images/species/Phoenix.png';
const witchSpeciesIcon = '/images/species/Witch.png';
const wizardSpeciesIcon = '/images/species/Wizard.png';

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
