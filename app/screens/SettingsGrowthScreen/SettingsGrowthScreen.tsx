import { useT } from "@/src/shared/lib/hooks";
import { SettingsLayout } from "@/src/shared/ui";
import { GrowthPointsView } from "@/src/widgets";
import { useThemeStore } from "../../../src/shared/store";

const SettingsGrowthScreen = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  return (
    <SettingsLayout title={t("settings.growthSettings")}>
      <GrowthPointsView chipColor={theme === "light" && colors.white} />
    </SettingsLayout>
  );
};

export default SettingsGrowthScreen;
