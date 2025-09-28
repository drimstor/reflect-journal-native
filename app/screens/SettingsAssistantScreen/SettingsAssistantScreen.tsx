import { useT } from "@/src/shared/lib/hooks";
import { SettingsLayout } from "@/src/shared/ui";
import { AssistantView } from "@/src/widgets";
import { useThemeStore } from "../../../src/shared/store";

const SettingsGrowthScreen = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();

  return (
    <SettingsLayout title={t("settings.assistantSettings")}>
      <AssistantView chipColor={theme === "light" && colors.white} />
    </SettingsLayout>
  );
};

export default SettingsGrowthScreen;
