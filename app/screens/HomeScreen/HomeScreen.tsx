import { FC } from "react";
import { Layout, PaddingLayout, TitleText } from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { useT } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import Chip from "@/src/shared/ui/Chip/Chip";
import { ScrollView, View } from "react-native";
import { styles } from "./HomeScreen.styles";
import {
  CalendarIcon,
  UserBorderIcon,
  ArrowLeftIcon,
} from "@/src/shared/ui/icons";
import { useGetPadding } from "@/src/shared/lib/hooks";
import {
  GradientPreviewBlock,
  ShortPreviewBlock,
  PreviewBlock,
} from "@/src/features";

interface HomeScreenProps {}

const HomeScreen: FC<HomeScreenProps> = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();

  return (
    <Layout>
      <Header title="Dashboard" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.globalViewHorizontal}
      >
        <PaddingLayout style={styles.globalBox}>
          <GradientPreviewBlock
            colors={colors}
            title="7 tasks to complete today"
            value="You productivity for the day is shown here"
            caption="Complete"
            captionValue="2/7"
          />
        </PaddingLayout>

        <PaddingLayout style={styles.titleBox}>
          <TitleText text="Today Tasks" textColor={colors.contrast} />
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
            <ShortPreviewBlock
              colors={colors}
              title="Research plan"
              value="Prepare a research plan for a new project"
              opacityCaption="Due date"
              caption="Aug 25"
            />
            <ShortPreviewBlock
              colors={colors}
              title="Plan next month"
              value="Prepare a content plan for Dribbble for September"
              caption="Today 11:00-12:00"
            />
          </ScrollView>
        </View>

        <PaddingLayout style={styles.titleBox}>
          <TitleText
            text="All Tasks"
            textColor={colors.contrast}
            element={
              <View style={styles.arrowLeftIconBox}>
                <ArrowLeftIcon color={colors.contrast} size={26} />
              </View>
            }
          />
        </PaddingLayout>

        <View style={styles.chipScrollViewHorizontalBox}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.chipScrollViewHorizontal,
              { paddingHorizontal },
            ]}
          >
            <Chip title="To do" size="base" color={colors.accent} />
            <Chip title="In progress" size="base" color={colors.secondary} />
            <Chip title="On review" size="base" color={colors.secondary} />
            <Chip title="Complete" size="base" color={colors.secondary} />
          </ScrollView>
        </View>

        <PaddingLayout style={[styles.previewBox]}>
          <PreviewBlock
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
                icon: (
                  <CalendarIcon variant="outlined" color={colors.contrast} />
                ),
              },
              {
                label: "Assigned to",
                value: "Tony Ware",
                icon: <UserBorderIcon color={colors.contrast} />,
              },
            ]}
          />
          <PreviewBlock
            backgroundColor={colors.secondary}
            title="Plan for the next month"
            value="Prepare a content plan for Dribbble for September"
            element={<Chip color={colors.alternate} title="Priority" />}
            infoBoxes={[
              {
                label: "Due date",
                value: "Aug 25",
                icon: (
                  <CalendarIcon variant="outlined" color={colors.contrast} />
                ),
              },
            ]}
          />
        </PaddingLayout>

        <PaddingLayout style={styles.titleBox}>
          <TitleText
            text="New Insights"
            textColor={colors.contrast}
            element={
              <View style={styles.arrowLeftIconBox}>
                <ArrowLeftIcon color={colors.contrast} size={26} />
              </View>
            }
          />
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
            <ShortPreviewBlock
              colors={colors}
              title="Research plan"
              value="Prepare a research plan for a new project"
              opacityCaption="Due date"
              caption="Aug 25"
            />
            <ShortPreviewBlock
              colors={colors}
              title="Plan next month"
              value="Prepare a content plan for Dribbble for September"
              caption="Today 11:00-12:00"
            />
          </ScrollView>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default HomeScreen;
