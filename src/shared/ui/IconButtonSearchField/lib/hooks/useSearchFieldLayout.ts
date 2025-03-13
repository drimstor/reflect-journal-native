import { useMemo } from "react";
import { useDeviceStore } from "@/src/shared/store";

interface UseSearchFieldLayoutProps {
  isExpanded: boolean;
  iconWidth?: number;
  padding?: number;
}

export const useSearchFieldLayout = ({
  isExpanded,
  iconWidth = 95,
  padding = 24,
}: UseSearchFieldLayoutProps) => {
  const { window } = useDeviceStore();

  // Расчет ширины поля ввода
  const inputWidth = useMemo(() => {
    return isExpanded ? window.width - iconWidth - padding * 2 : 0;
  }, [isExpanded, window.width, iconWidth, padding]);

  return {
    inputWidth,
  };
};
