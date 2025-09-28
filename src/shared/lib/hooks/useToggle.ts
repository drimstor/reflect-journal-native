import { useCallback, useState } from "react";

export const useToggle = (initialState: boolean = false) => {
  const [value, setValue] = useState(initialState);

  const toggle = useCallback(
    (hardValue?: boolean) => {
      setValue(hardValue ?? !value);
    },
    [value]
  );

  return {
    value,
    setValue,
    toggle,
  };
};
