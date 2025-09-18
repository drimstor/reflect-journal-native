import { useDeviceStore } from "@/src/shared/store";

/**
 * Хук для расчета конфигурации карусели с учетом отступов по краям
 * @param sideOffset - отступ по краям в пикселях (по умолчанию 50px)
 * @param offset - смещение прокрутки (по умолчанию 0)
 * @param baseScale - базовый масштаб прокрутки (по умолчанию 1)
 * @returns объект с параметрами parallaxScrollingScale и parallaxScrollingOffset
 */
export const useCarouselConfig = (
  sideOffset = 50,
  offset = 0,
  baseScale = 1
) => {
  const { window } = useDeviceStore();

  // Рассчитываем масштаб на основе ширины экрана и отступов
  // Если ширина экрана 400px и отступы по 50px с каждой стороны,
  // то видимая область будет 300px, что составляет 0.75 от полной ширины
  const calculatedScale =
    ((window.width - sideOffset * 2) / window.width) * baseScale;

  return {
    parallaxScrollingScale: calculatedScale,
    parallaxScrollingOffset: offset,
  };
};
