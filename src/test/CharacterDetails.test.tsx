import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { CharacterDetails, DETAILS_INFO, DETAILS_STRINGS } from '@features';
import { useGetCharacterByIdQuery } from '@api';

vi.mock('@api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@api')>();
  return {
    ...actual,
    useGetCharacterByIdQuery: vi.fn(),
  };
});

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
  alias_names: ['The Boy Who Lived', 'Undesirable No. 1'],
};

const renderWithRouter = (characterId: string, initialPage = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/${initialPage}/${characterId}`]}>
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
    vi.mocked(useGetCharacterByIdQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter('1');
    expect(screen.getByText(DETAILS_INFO.LOADING)).toBeInTheDocument();
  });

  test('displays error message when fetch fails', async () => {
    vi.mocked(useGetCharacterByIdQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch'),
      refetch: vi.fn(),
    });

    renderWithRouter('999');
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  test('handles not found case (404) when data is null', () => {
    vi.mocked(useGetCharacterByIdQuery).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter('1');

    expect(screen.getByText(DETAILS_INFO.NO_CHARACTER)).toBeInTheDocument();
  });

  test('renders character details correctly', async () => {
    vi.mocked(useGetCharacterByIdQuery).mockReturnValue({
      data: mockCharacter,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter('1');

    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
      expect(screen.getByText('Gryffindor')).toBeInTheDocument();
      expect(screen.getByText('Human')).toBeInTheDocument();
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByAltText('Harry Potter')).toHaveAttribute(
        'src',
        'https://example.com/harry.jpg'
      );
    });

    expect(screen.getByText('31 July 1980')).toBeInTheDocument();
    expect(screen.getByText(DETAILS_STRINGS.STILL_ALIVE)).toBeInTheDocument();

    expect(screen.getByText('Half-blood')).toBeInTheDocument();
    expect(screen.getByText('British')).toBeInTheDocument();

    expect(screen.getByText('Stag')).toBeInTheDocument();

    expect(screen.getByText('Holly, 11", Phoenix feather')).toBeInTheDocument();

    expect(screen.getByText('Head of Auror Office')).toBeInTheDocument();
  });

  test('handles missing optional fields', async () => {
    const characterWithoutOptional = {
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

    vi.mocked(useGetCharacterByIdQuery).mockReturnValue({
      data: characterWithoutOptional,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter('2');
    await waitFor(() => {
      expect(screen.getByText('Dobby')).toBeInTheDocument();
    });

    expect(screen.queryByText(DETAILS_STRINGS.LIFE)).not.toBeInTheDocument();
    expect(
      screen.queryByText(DETAILS_STRINGS.HERITAGE)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(DETAILS_STRINGS.MAGIC)).not.toBeInTheDocument();
    expect(screen.queryByText(DETAILS_STRINGS.WANDS)).not.toBeInTheDocument();
    expect(
      screen.queryByText(DETAILS_STRINGS.OCCUPATIONS)
    ).not.toBeInTheDocument();
  });

  test('navigates back to main page when close button clicked', async () => {
    vi.mocked(useGetCharacterByIdQuery).mockReturnValue({
      data: mockCharacter,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter('1', '3');
    await waitFor(() => {
      expect(screen.getByText('Harry Potter')).toBeInTheDocument();
    });
    const closeButton = screen.getByRole('button', {
      name: DETAILS_STRINGS.CLOSE,
    });
    await userEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/3');
  });

  test('uses anonymous image when image is null', async () => {
    const characterWithoutImage = { ...mockCharacter, image: null };
    vi.mocked(useGetCharacterByIdQuery).mockReturnValue({
      data: characterWithoutImage,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter('1');
    await waitFor(() => {
      const img = screen.getByAltText('Harry Potter') as HTMLImageElement;
      expect(img.src).toContain('placeholder.png');
    });
  });

  test('handles image error and shows fallback', async () => {
    vi.mocked(useGetCharacterByIdQuery).mockReturnValue({
      data: mockCharacter,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithRouter('1');
    const img = await screen.findByAltText('Harry Potter');
    fireEvent.error(img);
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('placeholder.png')
    );
  });
});
