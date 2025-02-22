import { useState, useCallback } from "react";

export const useToggle = (initialState: boolean = false) => {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggle = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  return {
    isVisible,
    setIsVisible,
    toggle,
  };
};
