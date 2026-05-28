import { useAppDispatch, useAppSelector } from '@store';
import {
  clearAll,
  selectSelectedCount,
  selectSelectedItemsArray,
} from '@store/slices';
import { FrameButton, RoundedFrame } from '@ui';
import { FLYOUT_STRINGS } from '@constants';
import { exportToCSV } from '@utils';

import './Flyout.css';

export function Flyout() {
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
          {FLYOUT_STRINGS.SELECTED_LABEL} {selectedCount}
        </span>
        <div className="flyout__actions">
          <FrameButton onClick={handleUnselectAll}>
            {FLYOUT_STRINGS.UNSELECT_ALL}
          </FrameButton>
          <FrameButton onClick={handleDownload}>
            {FLYOUT_STRINGS.DOWNLOAD_CSV}
          </FrameButton>
        </div>
      </div>
    </RoundedFrame>
  );
}
