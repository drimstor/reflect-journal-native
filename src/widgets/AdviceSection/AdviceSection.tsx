import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import { NoData, PaddingLayout, TitleText } from "@/src/shared/ui";
import { DotsIcon } from "@/src/shared/ui/icons";
import { AdviceWidget } from "@/src/widgets";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { AffirmationResponse } from "../../entities";
import { styles } from "./AdviceSection.styles";

const AdviceSection = ({ data }: { data?: AffirmationResponse }) => {
  const t = useT();
  const { colors } = useThemeStore();
  const { setBottomSheetVisible, navigateToFlow } = useBottomSheetStore();

  // Обработчик открытия фильтра категорий советов
  const handleAdviceDotsPress = () => {
    navigateToFlow("adviceFilter", "categories");
    setBottomSheetVisible(true);
  };

  return (
    <PaddingLayout style={styles.container}>
      <View style={styles.header}>
        <TitleText text={t("home.advice")} textColor={colors.contrast} />
        <TouchableOpacity onPress={handleAdviceDotsPress}>
          <DotsIcon color={colors.contrast} size={26} />
        </TouchableOpacity>
      </View>
      {data ? (
        <AdviceWidget data={data} />
      ) : (
        <View style={{ marginTop: -15 }}>
          <NoData />
        </View>
      )}
    </PaddingLayout>
  );
};

export default AdviceSection;
