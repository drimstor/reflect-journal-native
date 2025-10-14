import { GoalResponse } from "@/src/entities/goals/model/types";
import { PATHS } from "@/src/shared/const";
import { useGetPadding, useLang, useT } from "@/src/shared/lib/hooks";
import { useScreenInfoStore, useThemeStore } from "@/src/shared/store";
import { NoData, PaddingLayout, TitleText } from "@/src/shared/ui";
import Chip from "@/src/shared/ui/Chip/Chip";
import { ArrowLeftIcon } from "@/src/shared/ui/icons";
import { createStyles } from "@/src/widgets/TasksWidget/TasksWidget.styles";
import GoalItem from "@/src/widgets/TasksWidget/lib/components/GoalItem";
import {
  filterGoalsByStatus,
  getGoalStatusCounts,
  type Goal,
} from "@/src/widgets/TasksWidget/lib/helpers/goalFilters";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { ENTITY_NAME } from "../../shared/const/ENTITIES";

interface TasksWidgetProps {
  /** Внешние данные целей (опционально) */
  data?: GoalResponse;
}

const TasksWidget = ({ data: externalData }: TasksWidgetProps) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const t = useT();
  const { locale } = useLang();
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles();
  const { setNavigationScreenInfo } = useScreenInfoStore();
  const [goalStatusIndex, setGoalStatusIndex] = useState<number>(0);

  // Рефы для скролла
  const scrollViewRef = useRef<ScrollView>(null);
  const chipPositions = useRef<number[]>([]);

  const baseStatuses = useMemo(
    () => [
      {
        title: t("goals.status.toDo"),
        value: "toDo" as const,
      },
      {
        title: t("goals.status.inProgress"),
        value: "inProgress" as const,
      },
      {
        title: t("goals.status.complete"),
        value: "complete" as const,
      },
    ],
    [t, locale]
  );

  // Подсчет количества целей по статусам для отображения в чипах
  const statusCounts = useMemo(() => {
    if (!externalData?.data) return { toDo: 0, inProgress: 0, complete: 0 };
    return getGoalStatusCounts(externalData.data as Goal[]);
  }, [externalData?.data]);

  // Сортировка статусов по количеству (если все по нулям - стандартный порядок)
  const sortedStatuses = useMemo(() => {
    const totalCount = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Если все статусы имеют нулевое количество, возвращаем исходный порядок
    if (totalCount === 0) {
      return baseStatuses;
    }

    // Сортируем по убыванию количества
    return [...baseStatuses].sort((a, b) => {
      return statusCounts[b.value] - statusCounts[a.value];
    });
  }, [statusCounts, baseStatuses]);

  // Фильтрация целей по выбранному статусу
  const filteredGoals = useMemo(() => {
    if (!externalData?.data || !sortedStatuses[goalStatusIndex]) return [];
    return filterGoalsByStatus(
      externalData.data as Goal[],
      sortedStatuses[goalStatusIndex].value
    );
  }, [externalData?.data, goalStatusIndex, sortedStatuses]);

  // Функция для скролла к выбранному чипу
  const scrollToChip = (index: number) => {
    const chipPosition = chipPositions.current[index];
    if (chipPosition !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: chipPosition - 100,
        animated: true,
      });
    }
  };

  // Обработчик нажатия на чип
  const handleChipPress = (index: number) => {
    setGoalStatusIndex(index);
    scrollToChip(index);
  };

  return (
    <>
      <PaddingLayout style={styles.titleBox}>
        <TitleText
          text={t("goals.allGoals")}
          textColor={colors.contrast}
          element={
            <TouchableOpacity
              style={styles.arrowLeftIconBox}
              onPress={() => {
                setNavigationScreenInfo({ name: ENTITY_NAME.GOALS });
                navigation.navigate(PATHS.LIBRARY);
              }}
            >
              <ArrowLeftIcon color={colors.contrast} size={26} />
            </TouchableOpacity>
          }
        />
      </PaddingLayout>

      <View style={styles.chipScrollViewHorizontalBox}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.chipScrollViewHorizontal,
            { paddingHorizontal },
          ]}
        >
          {sortedStatuses.map((status, index) => (
            <TouchableOpacity
              key={status.value}
              onPress={() => handleChipPress(index)}
              onLayout={(event) => {
                const { x } = event.nativeEvent.layout;
                chipPositions.current[index] = x;
              }}
            >
              <Chip
                key={status.value}
                title={`${status.title} (${statusCounts[status.value]})`}
                size="base"
                color={
                  goalStatusIndex === index ? colors.accent : colors.secondary
                }
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <PaddingLayout style={styles.previewBox}>
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => <GoalItem key={goal.id} goal={goal} />)
        ) : (
          <NoData
            type="noGoals"
            onPress={() => {
              setNavigationScreenInfo({ name: ENTITY_NAME.GOALS });
              navigation.navigate(PATHS.ADD_ENTRY);
            }}
          />
        )}
      </PaddingLayout>
    </>
  );
};

export default TasksWidget;
