import { useState, useCallback, useRef, useEffect } from "react";

export function useAnimatedShow(
  toggleCallback: () => void,
  initialState = false,
  delay: number = 300
) {
  const [isAnimated, setIsAnimated] = useState(initialState);
  const mountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleWithAnimation = useCallback(() => {
    if (!isAnimated) {
      toggleCallback(); // Монтируем компонент
      mountTimeoutRef.current = setTimeout(() => {
        setIsAnimated(true); // Активируем анимацию через 1мс
      }, 50);
    } else {
      setIsAnimated(false); // Завершаем анимацию
      unmountTimeoutRef.current = setTimeout(() => {
        toggleCallback(); // Через delay скрываем компонент
      }, delay);
    }
  }, [isAnimated, toggleCallback, delay]);

  // Очистка таймеров при размонтировании или повторном запуске
  useEffect(() => {
    return () => {
      if (mountTimeoutRef.current) clearTimeout(mountTimeoutRef.current);
      if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
    };
  }, []);

  return { isAnimated, toggleWithAnimation };
}

export default useAnimatedShow;
