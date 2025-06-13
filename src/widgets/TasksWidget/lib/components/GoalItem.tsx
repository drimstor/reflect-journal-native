import React from "react";
import { TypedPreviewBlock } from "@/src/features";
import { Goal } from "../helpers/goalFilters";
import { PATHS } from "@/src/shared/const/PATHS";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProps } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";

interface GoalItemProps {
  goal: Goal;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const navigation = useNavigation<StackNavigationProps>();
  const { colors, theme } = useThemeStore();

  const onPress = () => {
    navigation.push(PATHS.LIBRARY_ITEM, { variant: "Goals", item: goal });
  };

  const renderItem = TypedPreviewBlock({
    variant: "Goals",
    onPress,
    backgroundColor: theme === "light" ? colors.white : colors.secondary,
  });

  return renderItem({ item: goal });
};

export default GoalItem;
