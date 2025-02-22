import { useDeviceStore } from "@/src/shared/store";

const useGetPadding = () => {
  const { window } = useDeviceStore();
  const paddingHorizontal = window.width <= 375 ? 15 : 25;
  return { paddingHorizontal };
};

export default useGetPadding;
