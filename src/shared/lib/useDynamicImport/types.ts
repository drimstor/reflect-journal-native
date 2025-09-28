import { ComponentType } from "react";

/**
 * Конфигурация для анимации появления
 */
export interface AnimationConfig {
  /** Продолжительность анимации в мс (по умолчанию 300) */
  duration?: number;
  /** Продолжительность анимации скрытия в мс (по умолчанию 300) */
  durationOut?: number;
  /** Задержка перед началом анимации в мс (по умолчанию 100) */
  delay?: number;
  /** Значение непрозрачности после анимации (по умолчанию 1) */
  targetOpacity?: number;
  /** Флаг, указывающий, должно ли содержимое быть видимым изначально */
  isInitialVisible?: boolean;
}

/**
 * Состояние динамического импорта
 */
export interface DynamicImportState<T = any> {
  /** Флаг начала импорта */
  isStartImport: boolean;
  /** Флаг загрузки компонента */
  isLoading: boolean;
  /** Флаг видимости для анимации */
  isVisible: boolean;
  /** Импортированный компонент */
  Component: ComponentType<T> | null;
  /** Ошибка импорта */
  error: Error | null;
}

/**
 * Функции управления динамическим импортом
 */
export interface DynamicImportActions {
  /** Начать импорт компонента */
  startImport: () => void;
  /** Показать компонент с анимацией */
  show: () => void;
  /** Скрыть компонент с анимацией */
  hide: () => void;
  /** Сбросить состояние */
  reset: () => void;
}

/**
 * Результат хука useDynamicImport
 */
export interface UseDynamicImportResult<T = any>
  extends DynamicImportState<T>,
    DynamicImportActions {
  /** Конфигурация анимации */
  animationConfig: Required<AnimationConfig>;
}

/**
 * Параметры хука useDynamicImport
 */
export interface UseDynamicImportParams {
  /** Функция для динамического импорта компонента */
  importFn: () => Promise<{ default: ComponentType<any> }>;
  /** Конфигурация анимации */
  animationConfig?: AnimationConfig;
  /** Автоматически начать импорт при инициализации */
  autoStart?: boolean;
  /** Автоматически показать компонент после загрузки */
  autoShow?: boolean;
}

/**
 * Пропсы для AnimatedDynamicWrapper
 */
export interface AnimatedDynamicWrapperProps<T = any> {
  /** Состояние и действия из хука useDynamicImport */
  dynamicImport: UseDynamicImportResult<T>;
  /** Пропсы для передачи в импортированный компонент */
  componentProps?: T;
  /** Дополнительные стили для контейнера */
  style?: any;
  /** Компонент загрузки (по умолчанию null) */
  fallback?: React.ReactNode;
  /** Компонент ошибки */
  errorComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
}
