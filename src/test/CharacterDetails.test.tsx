import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { CharacterDetails } from '@features';
import { getCharacterAction } from '@/actions/characters';
import { DEFAULT_TIMEZONE } from '@/i18n/config';

import enMessages from '../../messages/en.json';

vi.mock('@/actions/characters', () => ({
  getCharacterAction: vi.fn(),
}));

const getCharacter = vi.mocked(getCharacterAction);

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

function renderDetails(characterId = '1', onClose: () => void = vi.fn()) {
  return render(
    <NextIntlClientProvider
      locale="en"
      messages={enMessages}
      timeZone={DEFAULT_TIMEZONE}
    >
      <CharacterDetails characterId={characterId} onClose={onClose} />
    </NextIntlClientProvider>
  );
}

describe('CharacterDetails', () => {
  beforeEach(() => {
    getCharacter.mockReset();
  });

  test('shows loading indicator while fetching', () => {
    getCharacter.mockReturnValue(new Promise(() => {}));
    renderDetails();
    expect(
      screen.getByText('Loading magical record details...')
    ).toBeInTheDocument();
  });

  test('displays error message when fetch fails', async () => {
    getCharacter.mockRejectedValue(new Error('Failed to fetch'));
    renderDetails('999');
    expect(await screen.findByText('Failed to fetch')).toBeInTheDocument();
  });

  test('renders character details from the server action', async () => {
    getCharacter.mockResolvedValue(mockCharacter);
    renderDetails();

    expect(await screen.findByText('Harry Potter')).toBeInTheDocument();
    expect(screen.getByText('Gryffindor')).toBeInTheDocument();
    expect(screen.getByText('31 July 1980')).toBeInTheDocument();
    expect(screen.getByText('Still alive')).toBeInTheDocument();
    expect(screen.getByText('Stag')).toBeInTheDocument();
  });

  test('hides optional sections when fields are missing', async () => {
    getCharacter.mockResolvedValue({
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
    });

    renderDetails('2');
    await screen.findByText('Dobby');

    expect(screen.queryByText('Life')).not.toBeInTheDocument();
    expect(screen.queryByText('Heritage')).not.toBeInTheDocument();
    expect(screen.queryByText('Magic')).not.toBeInTheDocument();
  });

  test('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    getCharacter.mockResolvedValue(mockCharacter);
    renderDetails('1', onClose);

    await screen.findByText('Harry Potter');
    await userEvent.click(screen.getByRole('button', { name: '✖' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('uses placeholder image when image is null', async () => {
    getCharacter.mockResolvedValue({ ...mockCharacter, image: null });
    renderDetails();

    const img = await screen.findByAltText('Harry Potter');
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('placeholder.png')
    );
  });

  test('falls back to placeholder when the image fails to load', async () => {
    getCharacter.mockResolvedValue(mockCharacter);
    renderDetails();

    const img = await screen.findByAltText('Harry Potter');
    fireEvent.error(img);
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('placeholder.png')
    );
  });
});
