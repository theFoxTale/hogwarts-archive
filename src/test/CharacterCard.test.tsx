import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ANONYMOUS_IMAGE } from '../constants';
import { CharacterCard } from '../components';

const mockCharacter = {
  id: 'luna-1',
  name: 'Luna Lovegood',
  house: 'Ravenclaw',
  species: 'Human',
  gender: 'Female',
  image: null,
};

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('CharacterCard tests', () => {
  test('renders character name', () => {
    renderWithRouter(
      <CharacterCard character={mockCharacter} currentPage={1} />
    );
    expect(screen.getByText('Luna Lovegood')).toBeInTheDocument();
  });

  test('renders house, species, gender when provided', () => {
    renderWithRouter(
      <CharacterCard character={mockCharacter} currentPage={1} />
    );
    expect(screen.getByText(/House:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ravenclaw/i)).toBeInTheDocument();
    expect(screen.getByText(/Species:/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender:/i)).toBeInTheDocument();
    expect(screen.getByText(/Female/i)).toBeInTheDocument();
  });

  test('does not render missing fields', () => {
    const partialCharacter = {
      id: 'dobby-1',
      name: 'Dobby',
      house: null,
      species: 'Elf',
      gender: null,
      image: null,
    };
    renderWithRouter(
      <CharacterCard character={partialCharacter} currentPage={1} />
    );
    expect(screen.queryByText(/House:/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Species:/i)).toBeInTheDocument();
    expect(screen.getByText(/Elf/i)).toBeInTheDocument();
    expect(screen.queryByText(/Gender:/i)).not.toBeInTheDocument();
  });

  test('uses anonymous image when image is null', () => {
    renderWithRouter(
      <CharacterCard character={mockCharacter} currentPage={1} />
    );
    const img: HTMLImageElement = screen.getByAltText('Luna Lovegood');
    expect(img.src).toContain(ANONYMOUS_IMAGE);
  });

  test('uses provided image when available', () => {
    const withImage = {
      ...mockCharacter,
      image: 'https://example.com/luna.jpg',
    };
    renderWithRouter(<CharacterCard character={withImage} currentPage={1} />);
    const img: HTMLImageElement = screen.getByAltText('Luna Lovegood');
    expect(img.src).toBe('https://example.com/luna.jpg');
  });

  test('uses anonymous image when image loading fails', () => {
    const characterWithBrokenImage = {
      ...mockCharacter,
      image: 'https://invalid.url/broken.jpg',
    };
    renderWithRouter(
      <CharacterCard character={characterWithBrokenImage} currentPage={1} />
    );
    const img: HTMLImageElement = screen.getByAltText('Luna Lovegood');
    expect(img.src).toBe('https://invalid.url/broken.jpg');
    fireEvent.error(img);
    expect(img.src).toContain(ANONYMOUS_IMAGE);
  });

  test('navigates to details page with current page when view details button is clicked', () => {
    renderWithRouter(
      <CharacterCard character={mockCharacter} currentPage={3} />
    );
    const button = screen.getByText('View Details');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/details/luna-1?page=3');
  });
});
