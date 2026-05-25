import { exportToCSV } from '../utils';
import { CSV_EXPORT } from '../constants';
import { mockHarryCharacter } from './mocks/api.ts';

describe('csvExport', () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let setAttributeSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn>;
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let removeChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:test');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

    const mockLink = {
      href: '',
      setAttribute: vi.fn(),
      click: vi.fn(),
      remove: vi.fn(),
    };
    setAttributeSpy = mockLink.setAttribute;
    clickSpy = mockLink.click;

    vi.spyOn(document, 'createElement').mockReturnValue(
      mockLink as unknown as HTMLElement
    );
    appendChildSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node) => node);
    removeChildSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('generates CSV and triggers download with correct file name', () => {
    exportToCSV([mockHarryCharacter]);

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));

    expect(setAttributeSpy).toHaveBeenCalledWith(
      'download',
      `1${CSV_EXPORT.FILE_NAME}.csv`
    );

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(appendChildSpy).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test');
  });

  test('does nothing if array is empty', () => {
    exportToCSV([]);

    expect(createObjectURLSpy).not.toHaveBeenCalled();
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();

    expect(document.createElement).not.toHaveBeenCalled();
    expect(appendChildSpy).not.toHaveBeenCalled();
    expect(removeChildSpy).not.toHaveBeenCalled();
  });
});
