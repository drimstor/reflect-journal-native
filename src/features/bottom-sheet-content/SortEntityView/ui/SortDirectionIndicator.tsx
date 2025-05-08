import React from "react";
import { View } from "react-native";
import { Text, ArrowRightLongIcon } from "@/src/shared/ui";
import { useT } from "@/src/shared/lib/hooks";
import { SortOrder } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";

interface SortDirectionIndicatorProps {
  sortKey: string;
  sortDirection: SortOrder;
}

const SortDirectionIndicator: React.FC<SortDirectionIndicatorProps> = ({
  sortKey,
  sortDirection,
}) => {
  const t = useT();
  const { colors } = useThemeStore();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Text
        withOpacity={80}
        style={{ fontSize: 10, marginBottom: -4 }}
        color={colors.contrast}
      >
        {t(`sort.${sortKey}-${sortDirection}`)}
      </Text>
      <View
        style={{
          transform: [{ rotate: sortDirection === "asc" ? "90deg" : "270deg" }],
        }}
      >
        <ArrowRightLongIcon color={colors.contrast} size={22} />
      </View>
    </View>
  );
};

export default SortDirectionIndicator;
