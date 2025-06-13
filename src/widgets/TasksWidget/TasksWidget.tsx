import React, { useState, useMemo, useRef } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { PaddingLayout, TitleText, NoData } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useGetPadding, useT } from "@/src/shared/lib/hooks";
import Chip from "@/src/shared/ui/Chip/Chip";
import { ArrowLeftIcon } from "@/src/shared/ui/icons";
import { createStyles } from "@/src/widgets/TasksWidget/TasksWidget.styles";
import {
  filterGoalsByStatus,
  getGoalStatusCounts,
  type Goal,
} from "@/src/widgets/TasksWidget/lib/helpers/goalFilters";
import { GoalResponse } from "@/src/entities/goals/model/types";
import GoalItem from "@/src/widgets/TasksWidget/lib/components/GoalItem";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { PATHS } from "@/src/shared/const";

interface TasksWidgetProps {
  /** Внешние данные целей (опционально) */
  data?: GoalResponse;
}

const TasksWidget = ({ data: externalData }: TasksWidgetProps) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const t = useT();
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles();

  const [goalStatusIndex, setGoalStatusIndex] = useState<number>(0);

  // Рефы для скролла
  const scrollViewRef = useRef<ScrollView>(null);
  const chipPositions = useRef<number[]>([]);

  const baseStatuses = [
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
  ];

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
              onPress={() => navigation.navigate(PATHS.LIBRARY)}
              // TODO: переключить на цели
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
            onPress={() => navigation.navigate(PATHS.ADD_ENTRY)}
          />
        )}
      </PaddingLayout>
    </>
  );
};

export default TasksWidget;
