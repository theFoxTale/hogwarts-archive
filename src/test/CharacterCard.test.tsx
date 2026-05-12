import { fireEvent, render, screen } from '@testing-library/react';
import { ANONYMOUS_IMAGE } from '../constants';
import { CharacterCard } from '../components';

const mockCharacter = {
  name: 'Luna Lovegood',
  house: 'Ravenclaw',
  species: 'Human',
  gender: 'Female',
  image: null,
};

describe('CharacterCard tests', () => {
  test('renders character name', () => {
    render(<CharacterCard character={mockCharacter} />);
    expect(screen.getByText('Luna Lovegood')).toBeInTheDocument();
  });

  test('renders house, species, gender when provided', () => {
    render(<CharacterCard character={mockCharacter} />);

    expect(screen.getByText(/House:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ravenclaw/i)).toBeInTheDocument();
    expect(screen.getByText(/Species:/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender:/i)).toBeInTheDocument();
    expect(screen.getByText(/Female/i)).toBeInTheDocument();
  });

  test('does not render missing fields', () => {
    const partialCharacter = {
      name: 'Dobby',
      house: null,
      species: 'Elf',
      gender: null,
      image: null,
    };
    render(<CharacterCard character={partialCharacter} />);
    expect(screen.queryByText(/House:/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Species:/i)).toBeInTheDocument();
    expect(screen.getByText(/Elf/i)).toBeInTheDocument();
    expect(screen.queryByText(/Gender:/i)).not.toBeInTheDocument();
  });

  test('uses anonymous image when image is null', () => {
    render(<CharacterCard character={mockCharacter} />);
    const img: HTMLImageElement = screen.getByAltText('Luna Lovegood');
    expect(img.src).toContain(ANONYMOUS_IMAGE);
  });

  test('uses provided image when available', () => {
    const withImage = {
      ...mockCharacter,
      image: 'https://example.com/luna.jpg',
    };
    render(<CharacterCard character={withImage} />);
    const img: HTMLImageElement = screen.getByAltText('Luna Lovegood');
    expect(img.src).toBe('https://example.com/luna.jpg');
  });

  test('uses anonymous image when image loading fails', () => {
    const characterWithBrokenImage = {
      ...mockCharacter,
      image: 'https://invalid.url/broken.jpg',
    };
    render(<CharacterCard character={characterWithBrokenImage} />);
    const img: HTMLImageElement = screen.getByAltText('Luna Lovegood');

    expect(img.src).toBe('https://invalid.url/broken.jpg');

    fireEvent.error(img);
    expect(img.src).toContain(ANONYMOUS_IMAGE);
  });
});
