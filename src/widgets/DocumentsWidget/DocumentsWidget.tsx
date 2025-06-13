import React, { FC } from "react";
import { ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PaddingLayout, TitleText } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useGetPadding, useT } from "@/src/shared/lib/hooks";
import { formatReadingTime } from "@/src/shared/lib/helpers";
import { PATHS } from "@/src/shared/const";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { StackNavigationProps } from "@/src/shared/model/types";
import { ShortPreviewBlock } from "@/src/features";
import { styles } from "./DocumentsWidget.styles";

interface DocumentsWidgetProps {
  /** Данные документов */
  data?: any[];
  /** Функция получения прогресса документа */
  getDocumentProgress: (documentId: string) => number;
}

const DocumentsWidget: FC<DocumentsWidgetProps> = ({
  data,
  getDocumentProgress,
}) => {
  const t = useT();
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const navigation = useNavigation<StackNavigationProps>();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      <PaddingLayout style={styles.titleBox}>
        <TitleText text={t("home.articles")} textColor={colors.contrast} />
      </PaddingLayout>

      <View style={styles.shortPreviewScrollViewHorizontalBox}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.shortPreviewScrollViewHorizontal,
            { paddingHorizontal },
          ]}
        >
          {data.map((document: any) => (
            <ShortPreviewBlock
              key={document.id}
              colors={colors}
              title={document.title}
              progress={getDocumentProgress(document.id)}
              value={document.description.substring(0, 100)}
              caption={formatReadingTime(document?.reading_time || 10, t)}
              opacityCaption={t("shared.info.readingTime") + ": "}
              onPress={() =>
                navigation.push(PATHS.LIBRARY_ITEM, {
                  variant: ENTITY_NAME.DOCUMENT,
                  item: document,
                })
              }
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default DocumentsWidget;
