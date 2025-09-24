import { useT } from "@/src/shared/lib/hooks";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import {
  AnimatedLoader,
  Layout,
  PaddingLayout,
  useAnimatedLoading,
} from "@/src/shared/ui";
import {
  AdviceSection,
  AffirmationWidget,
  CategoriesWidget,
  DocumentsWidget,
  Header,
  TasksWidget,
  TopicsWidget,
} from "@/src/widgets";
import React, { FC, useEffect } from "react";
import { ScrollView } from "react-native";
import { styles } from "./HomeScreen.styles";
import { useGetDocumentsProgress } from "./lib/hooks/useGetDocumentsProgress";
import { useHomeScreenData } from "./lib/hooks/useHomeScreenData";

interface HomeScreenProps {}

const HomeScreen: FC<HomeScreenProps> = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();

  // Получение всех данных и состояний загрузки
  const { isLoading, data } = useHomeScreenData();

  // Получение прогресса документов
  const { getDocumentProgress } = useGetDocumentsProgress(data?.documents);

  const {
    isLoading: isScreenLoading,
    startLoading: handleScreenLoading,
    animatedStyle,
  } = useAnimatedLoading({ externalIsLoading: isLoading });

  useEffect(() => {
    handleScreenLoading();
  }, []);

  return (
    <Layout>
      <Header title={t("home.title")} />
      {isScreenLoading ? (
        <AnimatedLoader
          isVisible={isScreenLoading}
          animatedStyle={animatedStyle}
          containerStyle={{ minHeight: 1000, paddingTop: 200 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.globalViewHorizontal}
        >
          {/* <PaddingLayout style={styles.globalBox}>
          <GradientPreviewBlock
            colors={colors}
            title="7 tasks to complete today"
            value="You productivity for the day is shown here"
            caption="Complete"
            captionValue="2/7"
          />
        </PaddingLayout> */}

          <PaddingLayout style={styles.globalBox}>
            <AffirmationWidget data={data.affirmation} />
          </PaddingLayout>

          <DocumentsWidget
            data={data.documents}
            getDocumentProgress={getDocumentProgress}
          />

          {/* <PreviewBlock
          backgroundColor={colors.secondary}
          title="Plan for the next month"
          value="Prepare a content plan for Dribbble for September"
          element={
            <Chip
              textColor={colors.white}
              color={colors.error}
              title="High Priority"
            />
          }
          infoBoxes={[
            {
              label: "Due date",
              value: "Aug 25",
              icon: <CalendarIcon color={colors.contrast} />,
            },
            {
              label: "Assigned to",
              value: "Tony Ware",
              icon: <UserBorderIcon color={colors.contrast} />,
            },
          ]}
        /> */}

          <TasksWidget data={data.goals} />

          <AdviceSection data={data.advice} />

          <CategoriesWidget data={data.portrait?.categories} />

          <TopicsWidget data={data.portrait?.topics} />
        </ScrollView>
      )}
    </Layout>
  );
};

export default HomeScreen;
