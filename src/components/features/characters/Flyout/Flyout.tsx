'use client';

import { useTranslations } from 'next-intl';

import { useAppDispatch, useAppSelector } from '@store';
import {
  clearAll,
  selectSelectedCount,
  selectSelectedItemsArray,
} from '@store/slices';

import { FrameButton, RoundedFrame } from '@ui';

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

  const handleDownload = async () => {
    try {
      const ids = selectedItems.map((item) => item.id);
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(
          'CSV export error:',
          error.error || 'Failed to export CSV'
        );
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      let filename = `${selectedCount}_magical_beings.csv`;
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV download error:', error);
    }
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
