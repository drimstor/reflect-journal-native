import { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { CHARTS } from "../../const/static";
import { FullScreenChartHandle } from "@/src/shared/ui/Charts/FullScreenChart";
import { ChartItem } from "../../model/types";
import { useBottomSheetStore } from "@/src/shared/store";
import { useSharedValue, withSpring } from "react-native-reanimated";

export const useChartManagement = () => {
  const { flowData, setFlowData } = useBottomSheetStore();

  const [mainChart, setMainChart] = useState<string>(CHARTS.INITIAL_CHART);
  const [subChart, setSubChart] = useState("");
  const [currentChart, setCurrentChart] = useState<string>(mainChart);
  const [scrollPosition, setScrollPosition] = useState(0);

  const mainChartRef = useRef<FullScreenChartHandle>(null);
  const subChartRef = useRef<FullScreenChartHandle>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Анимация с использованием Reanimated
  const animationValue = useSharedValue(0);

  const animate = (toValue: number) => {
    animationValue.value = withSpring(toValue, {
      damping: 15,
      stiffness: 100,
    });
  };

  // Применяем выбранный тип диаграммы из flowData
  useEffect(() => {
    if (flowData?.chartType) {
      setMainChart(flowData.chartType);
      setCurrentChart(flowData.chartType);
    }
  }, [flowData?.chartType]);

  // Обработка скролла
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentPosition = event.nativeEvent.contentOffset.y;
      setScrollPosition(currentPosition);
    },
    []
  );

  // Управление фокусом на диаграммах
  const handleSetSubChartFocus = useCallback((index: number) => {
    subChartRef.current?.setFocusedItem(index);
  }, []);

  const handleSetMainChartFocus = useCallback((index: number) => {
    mainChartRef.current?.setFocusedItem(index);
  }, []);

  // Обработка нажатия на элемент диаграммы
  const handleItemPress = (item: ChartItem, currentChartData: ChartItem[]) => {
    // Проверяем, находимся ли мы не в начале прокрутки
    const needsScrollToTop = scrollPosition > CHARTS.SCROLL_THRESHOLD;

    // Если нужно прокрутить к верху, сначала делаем это
    if (needsScrollToTop) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });

      // Выполняем действия после завершения прокрутки
      setTimeout(() => {
        processItemSelection(item, currentChartData);
      }, CHARTS.ANIMATION_DELAY);
    } else {
      // Если мы уже наверху, сразу выполняем действия
      processItemSelection(item, currentChartData);
    }
  };

  // Логика обработки выбора элемента
  const processItemSelection = (
    item: ChartItem,
    currentChartData: ChartItem[]
  ) => {
    if (mainChart === CHARTS.INITIAL_CHART) {
      setSubChart(item.type || "");
      setCurrentChart(item.type || "");
    }

    const index = currentChartData.findIndex(
      (findItem) => findItem.name === item.name
    );

    if (subChart) {
      handleSetSubChartFocus(index);
    } else {
      if (mainChart === CHARTS.INITIAL_CHART) {
        setTimeout(() => {
          animate(1);
        }, CHARTS.ANIMATION_DELAY);
      }
      handleSetMainChartFocus(index);
    }
  };

  // Обработка нажатия кнопки "Назад"
  const handlePressBack = useCallback(() => {
    if (subChart) {
      animate(0);
      setCurrentChart(mainChart);

      setTimeout(() => {
        setSubChart("");
        handleSetSubChartFocus(0);
      }, CHARTS.BACK_ANIMATION_DELAY);
    }
  }, [subChart, mainChart, handleSetSubChartFocus]);

  // Изменение типа диаграммы и сохранение в flowData
  const setChartType = useCallback(
    (type: string) => {
      setFlowData({ chartType: type });
    },
    [setFlowData]
  );

  return {
    mainChart,
    subChart,
    currentChart,
    scrollViewRef,
    mainChartRef,
    subChartRef,
    handleScroll,
    handleItemPress,
    handlePressBack,
    setChartType,
    animationValue,
  };
};
