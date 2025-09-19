import { useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import { CheckIcon, DirectIcon } from "@/src/shared/ui";
import { BottomSheetAction } from "@/src/shared/ui/BottomSheetContent";
import { useCallback, useMemo } from "react";

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

  const titleActions: BottomSheetAction[] = [
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

  // Функция для открытия списка переключения типов диаграмм
  const openBottomSheetList = useCallback(
    (variant: "title" | "topics" | "categories") => (entities?: string[]) => {
      const listActions = [
        {
          text: t("edit.summaries.create"),
          IconComponent: DirectIcon,
          onPress: () => {
            setFlowData({ variant, entitiesValues: entities });
            navigateToFlow("summary", "create");
          },
        },
      ];

      setActions(variant === "title" ? titleActions : listActions);
      navigateToFlow("common", "list");

      requestAnimationFrame(() => {
        setBottomSheetVisible(true);
      });
    },
    [
      t,
      flowData,
      navigateToFlow,
      setActions,
      setBottomSheetVisible,
      setFlowData,
    ]
  );

  return {
    snapPoints,
    openBottomSheetList,
    colors,
  };
};
