import { useEffect } from "react";

interface UseSnackbarTimersProps {
  onClose: () => void;
  toggleVisible: () => void;
  displayTime?: number;
  animationTime?: number;
}

export const useSnackbarTimers = ({
  onClose,
  toggleVisible,
  displayTime = 5000,
  animationTime = 400,
}: UseSnackbarTimersProps) => {
  useEffect(() => {
    const timer = setTimeout(toggleVisible, displayTime);
    const timer2 = setTimeout(onClose, displayTime + animationTime);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);
};
