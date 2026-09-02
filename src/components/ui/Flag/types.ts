export type ThemedSrc = {
  light: string;
  dark: string;
};

export type SizedThemedSrc = ThemedSrc & {
  width: number;
  height: number;
};

export interface FlagProps {
  /** Обработчик клика по флагу */
  onClick: () => void;
  /** Изображения для верхней части */
  topImage: SizedThemedSrc;
  /** Фоновое изображение для средней части (повторяется) */
  middleBackground: ThemedSrc;
  /** Изображения для нижней части */
  bottomImage: SizedThemedSrc;
  /** Иконка в центре флага */
  icon: SizedThemedSrc;
  /** Текст на флаге */
  text: string;
  /** Alt-текст для изображений */
  alt: string;
  /** Дополнительный CSS-класс для позиционирования */
  className?: string;
}
