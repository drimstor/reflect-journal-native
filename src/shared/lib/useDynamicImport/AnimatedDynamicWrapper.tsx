import React, { Suspense } from "react";
import AnimatedAppearance from "../../ui/AnimatedAppearance/AnimatedAppearance";
import { AnimatedDynamicWrapperProps } from "./types";

/**
 * Компонент-обертка для анимированного появления динамически импортированных компонентов
 */
export const AnimatedDynamicWrapper = <T extends Record<string, any> = any>({
  dynamicImport,
  componentProps,
  style,
  fallback = null,
  errorComponent: ErrorComponent,
}: AnimatedDynamicWrapperProps<T>) => {
  const {
    isStartImport,
    isVisible,
    Component,
    error,
    animationConfig,
    startImport,
  } = dynamicImport;

  // Если есть ошибка и передан компонент ошибки
  if (error && ErrorComponent) {
    return (
      <AnimatedAppearance
        isVisible={true}
        duration={animationConfig.duration}
        durationOut={animationConfig.durationOut}
        delay={animationConfig.delay}
        targetOpacity={animationConfig.targetOpacity}
        isInitialVisible={animationConfig.isInitialVisible}
        style={style}
      >
        <ErrorComponent error={error} retry={startImport} />
      </AnimatedAppearance>
    );
  }

  // Если импорт не начат, не рендерим ничего
  if (!isStartImport) {
    return null;
  }

  return (
    <Suspense fallback={fallback}>
      {Component && (
        <AnimatedAppearance
          isVisible={isVisible}
          duration={animationConfig.duration}
          durationOut={animationConfig.durationOut}
          delay={animationConfig.delay}
          targetOpacity={animationConfig.targetOpacity}
          isInitialVisible={animationConfig.isInitialVisible}
          style={style}
        >
          <Component {...(componentProps as T)} />
        </AnimatedAppearance>
      )}
    </Suspense>
  );
};
