import { useAppDispatch, useAppSelector } from '../../store';
import {
  clearAll,
  selectSelectedCount,
  selectSelectedItemsArray,
} from '../../features/selectedItemsSlice';
import { ActionButton, RoundedFrame } from '../../components';

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
    console.log('CLICK DOWNLOAD with selectedItems: ', selectedItems);
  };

  return (
    <RoundedFrame className="flyout__frame variant-container">
      <div className="flyout__content">
        <span className="flyout__count magic-subtitle">
          Selected: {selectedCount}
        </span>
        <div className="flyout__actions">
          <ActionButton onClick={handleUnselectAll}>Unselect all</ActionButton>
          <ActionButton onClick={handleDownload}>Download CSV</ActionButton>
        </div>
      </div>
    </RoundedFrame>
  );
}
