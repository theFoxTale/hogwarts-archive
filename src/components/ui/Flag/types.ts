export type ThemeImages = {
  light: string;
  dark: string;
};

export interface FlagImagesSet {
  top: ThemeImages;
  middleBackground: ThemeImages;
  bottom: ThemeImages;
  icon: ThemeImages;
}

export interface FlagProps {
  /** Обработчик клика по флагу */
  onClick: () => void;
  /** Изображения для верхней части */
  topImage: ThemeImages;
  /** Фоновое изображение для средней части (повторяется) */
  middleBackground: ThemeImages;
  /** Изображения для нижней части */
  bottomImage: ThemeImages;
  /** Иконка в центре флага */
  icon: ThemeImages;
  /** Текст на флаге */
  text: string;
  /** Alt-текст для изображений */
  alt: string;
  /** Дополнительный CSS-класс для позиционирования */
  className?: string;
}
