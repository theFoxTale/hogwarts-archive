import { useAppDispatch, useAppSelector } from '../../store';
import {
  clearAll,
  selectSelectedCount,
  selectSelectedItemsArray,
} from '../../features/selectedItemsSlice';
import { ActionButton, RoundedFrame } from '../../components';
import { FLYOUT_STRINGS } from '../../constants';
import { exportToCSV } from '../../utils';

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
          <ActionButton onClick={handleUnselectAll}>
            {FLYOUT_STRINGS.UNSELECT_ALL}
          </ActionButton>
          <ActionButton onClick={handleDownload}>
            {FLYOUT_STRINGS.DOWNLOAD_CSV}
          </ActionButton>
        </div>
      </div>
    </RoundedFrame>
  );
}
