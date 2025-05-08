import { useCallback, useMemo } from "react";
import {
  useDeviceStore,
  useBottomSheetStore,
  useThemeStore,
} from "@/src/shared/store";
import { CHARTS } from "../../const/static";
import { useT } from "@/src/shared/lib/hooks";
import { CheckIcon } from "@/src/shared/ui";
import { BottomSheetAction } from "@/src/shared/ui/BottomSheetContent";

export const useChartBottomSheet = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const {
    navigateToFlow,
    setBottomSheetVisible,
    setActions,
    flowData,
    setFlowData,
  } = useBottomSheetStore();

  // Расчет snap points для BottomSheet
  const snapPoints = useMemo(() => {
    return [window.height - 85];
  }, [window.height]);

  // Функция для открытия списка переключения типов диаграмм
  const openChartTypesList = useCallback(() => {
    const actions: BottomSheetAction[] = [
      {
        text: t("overview.chart.popularCategories"),
        IconComponent:
          flowData?.chartType === "top_types" || !flowData?.chartType
            ? CheckIcon
            : undefined,
        onPress: () => {
          setFlowData({ chartType: "top_types" });
          setBottomSheetVisible(false);
        },
      },
      {
        text: t("overview.chart.popularTopics"),
        IconComponent:
          flowData?.chartType === "top_nodes" ? CheckIcon : undefined,
        onPress: () => {
          setFlowData({ chartType: "top_nodes" });
          setBottomSheetVisible(false);
        },
      },
    ];

    setActions(actions);
    navigateToFlow("common", "list");

    setTimeout(() => {
      setBottomSheetVisible(true);
    }, CHARTS.SHEET_OPEN_DELAY);
  }, [
    t,
    flowData,
    navigateToFlow,
    setActions,
    setBottomSheetVisible,
    setFlowData,
  ]);

  return {
    snapPoints,
    openChartTypesList,
    colors,
  };
};
