import { useState, useCallback } from "react";

export const useToggle = (initialState: boolean = false) => {
  const [value, setValue] = useState(initialState);

  const toggle = useCallback(() => {
    setValue(!value);
  }, [value]);

  return {
    value,
    setValue,
    toggle,
  };
};
