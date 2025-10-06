import { createTypedPreviewBlockRenderer } from "@/src/features";
import { PATHS } from "@/src/shared/const/PATHS";
import { StackNavigationProps } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Goal } from "../helpers/goalFilters";

interface GoalItemProps {
  goal: Goal;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const navigation = useNavigation<StackNavigationProps>();
  const { colors, theme } = useThemeStore();

  const onPress = () => {
    navigation.push(PATHS.LIBRARY_ITEM, {
      variant: "Goals",
      item: goal,
      isBottomSheetMountAnimate: true,
    });
  };

  const renderItem = createTypedPreviewBlockRenderer({
    variant: "Goals",
    onPress,
    backgroundColor: theme === "light" ? colors.white : colors.secondary,
  });

  return renderItem({ item: goal });
};

export default GoalItem;
