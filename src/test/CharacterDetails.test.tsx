import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  CharacterDetails,
  ANONYMOUS_DETAILS_IMAGE,
  LOADING_DETAILS,
} from '@features';

import { getCharacterById } from '@api';

vi.mock('../api', () => ({
  getCharacterById: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCharacter = {
  id: '1',
  name: 'Harry Potter',
  house: 'Gryffindor',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/harry.jpg',
  born: '31 July 1980',
  died: null,
  blood_status: 'Half-blood',
  nationality: 'British',
  patronus: 'Stag',
  wands: ['Holly, 11", Phoenix feather'],
  jobs: ['Head of Auror Office'],
  alias_names: [],
};

const renderWithParams = (characterId: string, page: string = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/${page}/${characterId}`]}>
      <Routes>
        <Route path="/:page/:characterId" element={<CharacterDetails />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CharacterDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockNavigate.mockClear();
  });

  test('shows loading indicator while fetching', () => {
    vi.mocked(getCharacterById).mockImplementation(() => new Promise(() => {}));
    renderWithParams('1');
    expect(screen.getByText(LOADING_DETAILS)).toBeInTheDocument();
  });

  test('displays error message when fetch fails', async () => {
    vi.mocked(getCharacterById).mockRejectedValue(new Error('Network error'));
    renderWithParams('1');

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  test('handles not found case (404)', async () => {
    vi.mocked(getCharacterById).mockRejectedValue(
      new Error('Character not found')
    );
    renderWithParams('999');

    await waitFor(() => {
      expect(screen.getByText('Character not found')).toBeInTheDocument();
    });
  });

  test('renders character details correctly', async () => {
    vi.mocked(getCharacterById).mockResolvedValue(mockCharacter);
    renderWithParams('1');

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });
    expect(screen.getByText('Gryffindor')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('31 July 1980')).toBeInTheDocument();
    expect(screen.getByText('Still alive')).toBeInTheDocument();
    expect(screen.getByText('Half-blood')).toBeInTheDocument();
    expect(screen.getByText('British')).toBeInTheDocument();
    expect(screen.getByText('Stag')).toBeInTheDocument();
    expect(screen.getByText('Holly, 11", Phoenix feather')).toBeInTheDocument();
    expect(screen.getByText('Head of Auror Office')).toBeInTheDocument();
  });

  test('uses anonymous image when image is null', async () => {
    const charWithoutImage = { ...mockCharacter, image: null };
    vi.mocked(getCharacterById).mockResolvedValue(charWithoutImage);

    renderWithParams('1');

    await waitFor(() => {
      const img = screen.getByAltText('Harry Potter') as HTMLImageElement;
      expect(img.src).toContain(ANONYMOUS_DETAILS_IMAGE);
    });
  });

  test('handles image error and shows fallback', async () => {
    vi.mocked(getCharacterById).mockResolvedValue(mockCharacter);
    renderWithParams('1');

    const img = await screen.findByAltText('Harry Potter');

    img.dispatchEvent(new Event('error'));
    await waitFor(() => {
      expect(img).toHaveAttribute('src', ANONYMOUS_DETAILS_IMAGE);
    });
  });

  test('does not render optional sections when data missing', async () => {
    const minimalCharacter = {
      id: '2',
      name: 'Dobby',
      house: null,
      species: 'Elf',
      gender: null,
      image: null,
      born: null,
      died: null,
      blood_status: null,
      nationality: null,
      patronus: null,
      wands: [],
      jobs: [],
    };
    vi.mocked(getCharacterById).mockResolvedValue(minimalCharacter);
    renderWithParams('2');

    await waitFor(() => {
      expect(screen.getByText('Dobby')).toBeInTheDocument();
    });

    expect(screen.queryByText('Life')).not.toBeInTheDocument();
    expect(screen.queryByText('Heritage')).not.toBeInTheDocument();
    expect(screen.queryByText('Magic')).not.toBeInTheDocument();
    expect(screen.queryByText('Wand(s)')).not.toBeInTheDocument();
    expect(screen.queryByText('Occupation(s)')).not.toBeInTheDocument();
  });

  test('navigates back to main page when close button clicked', async () => {
    vi.mocked(getCharacterById).mockResolvedValue(mockCharacter);
    renderWithParams('1', '3');

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: '✖' });
    await userEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/3');
  });
});
