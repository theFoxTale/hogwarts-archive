import { useTranslations } from 'next-intl';

import { useAppDispatch, useAppSelector } from '@store';
import {
  clearAll,
  selectSelectedCount,
  selectSelectedItemsArray,
} from '@store/slices';

import { FrameButton, RoundedFrame } from '@ui';
import { exportToCSV } from '@utils';

import './Flyout.css';

export function Flyout() {
  const lang = useTranslations('flyout');

  const dispatch = useAppDispatch();
  const selectedCount = useAppSelector(selectSelectedCount);
  const selectedItems = useAppSelector(selectSelectedItemsArray);

  if (selectedCount === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearAll());
  };

  const handleDownload = () => {
    exportToCSV(selectedItems);
  };

  return (
    <RoundedFrame className="flyout__frame variant-container">
      <div className="flyout__content">
        <span className="magic-subtitle">
          {lang('selected')} {selectedCount}
        </span>
        <div className="flyout__actions">
          <FrameButton onClick={handleUnselectAll}>
            {lang('unselectAll')}
          </FrameButton>
          <FrameButton onClick={handleDownload}>
            {lang('downloadCSV')}
          </FrameButton>
        </div>
      </div>
    </RoundedFrame>
  );
}
