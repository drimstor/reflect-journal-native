export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  /** Текущее значение */
  value?: string;
  /** Метка поля */
  label?: string;
  /** Текст-заглушка */
  placeholder?: string;
  /** Вспомогательный текст */
  helperText?: string;
  /** Цвет фона */
  backgroundColor?: string;
  /** Цвет метки */
  labelColor?: string;
  /** Цвет вспомогательного текста */
  helperTextColor?: string;
  /** Обязательное поле */
  required?: boolean;
  /** Опции для выбора */
  options?: SelectOption[];
  /** Обработчик изменения значения */
  onValueChange?: (value: string) => void;
  /** Включен ли компонент */
  enabled?: boolean;
  /** Размер компонента */
  size?: "small" | "medium";
  /** Стили */
}
