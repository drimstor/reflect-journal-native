import { ComponentType, useCallback, useRef, useState } from "react";
import {
  AnimationConfig,
  UseDynamicImportParams,
  UseDynamicImportResult,
} from "./types";

/**
 * Хук для динамического импорта компонентов с анимированным появлением
 *
 * @param importFn - Функция для динамического импорта компонента
 * @param animationConfig - Конфигурация анимации
 * @param autoStart - Автоматически начать импорт при инициализации
 * @param autoShow - Автоматически показать компонент после загрузки
 * @returns Состояние и функции управления динамическим импортом
 */
export const useDynamicImport = <T = any>({
  importFn,
  animationConfig = {},
  autoStart = false,
  autoShow = true,
}: UseDynamicImportParams): UseDynamicImportResult<T> => {
  // Состояние импорта
  const [isStartImport, setIsStartImport] = useState(autoStart);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [Component, setComponent] = useState<ComponentType<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Флаг для предотвращения повторного импорта
  const isImportingRef = useRef(false);
  const isImportedRef = useRef(false);

  // Конфигурация анимации с значениями по умолчанию
  const defaultAnimationConfig: Required<AnimationConfig> = {
    duration: 300,
    durationOut: 300,
    delay: 100,
    targetOpacity: 1,
    isInitialVisible: false,
    ...animationConfig,
  };

  // Начать импорт компонента
  const startImport = useCallback(async () => {
    if (isImportingRef.current || isImportedRef.current) {
      return;
    }

    setIsStartImport(true);
    setIsLoading(true);
    setError(null);
    isImportingRef.current = true;

    try {
      const module = await importFn();
      const ImportedComponent = module.default;

      setComponent(() => ImportedComponent);
      isImportedRef.current = true;

      // Автоматически показать компонент после загрузки
      if (autoShow) {
        setIsVisible(true);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to import component");
      setError(error);
      console.error("Dynamic import error:", error);
    } finally {
      setIsLoading(false);
      isImportingRef.current = false;
    }
  }, [importFn, autoShow]);

  // Показать компонент с анимацией
  const show = useCallback(() => {
    if (!Component && !isLoading && !isImportingRef.current) {
      // Если компонент еще не загружен, начать импорт
      startImport();
    } else if (Component) {
      // Если компонент уже загружен, просто показать
      setIsVisible(true);
    }
  }, [Component, isLoading, startImport]);

  // Скрыть компонент с анимацией
  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Сбросить состояние
  const reset = useCallback(() => {
    setIsStartImport(false);
    setIsLoading(false);
    setIsVisible(false);
    setComponent(null);
    setError(null);
    isImportingRef.current = false;
    isImportedRef.current = false;
  }, []);

  // Автоматический старт при инициализации
  if (
    autoStart &&
    !isImportingRef.current &&
    !isImportedRef.current &&
    !Component
  ) {
    startImport();
  }

  return {
    // Состояние
    isStartImport,
    isLoading,
    isVisible,
    Component,
    error,

    // Действия
    startImport,
    show,
    hide,
    reset,

    // Конфигурация анимации
    animationConfig: defaultAnimationConfig,
  };
};
