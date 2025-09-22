export interface MonthYearValue {
  /** День (1-31) */
  day?: number;
  /** Месяц (1-12) */
  month?: number;
  /** Год */
  year?: number;
}

export interface MonthYearPickerProps {
  /** Текущее значение */
  value?: MonthYearValue;
  /** Метка поля */
  label?: string;
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
  /** Обработчик изменения значения */
  onValueChange?: (value: MonthYearValue) => void;
  /** Включен ли компонент */
  enabled?: boolean;
  /** Показывать ли селектор дня */
  showDay?: boolean;
  /** Показывать ли селектор месяца */
  showMonth?: boolean;
  /** Показывать ли селектор года */
  showYear?: boolean;
  /** Минимальный год */
  minYear?: number;
  /** Максимальный год */
  maxYear?: number;
  /** Плейсхолдеры для каждого селекта */
  placeholders?: {
    day?: string;
    month?: string;
    year?: string;
  };
}
