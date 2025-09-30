import { useT } from "@/src/shared/lib/hooks";
import { SettingsLayout } from "@/src/shared/ui";
import { LanguageView } from "@/src/widgets";

const SettingsLanguageScreen = () => {
  const t = useT();
  return (
    <SettingsLayout title={t("settings.language")}>
      <LanguageView />
    </SettingsLayout>
  );
};

export default SettingsLanguageScreen;
