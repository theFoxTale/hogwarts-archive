export const PAGINATION_STRINGS = {
  PREVIOUS: '← Previous',
  NEXT: 'Next →',
  PAGE_OF: (current: number, total: number) => `Page ${current} of ${total}`,
} as const;
