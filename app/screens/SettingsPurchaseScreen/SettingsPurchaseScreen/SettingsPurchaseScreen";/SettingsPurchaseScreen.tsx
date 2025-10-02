import { useT } from "@/src/shared/lib/hooks";
import { SettingsLayout } from "@/src/shared/ui";
import { SubscriptionWidget } from "@/src/widgets/SubscriptionWidget/SubscriptionWidget";

const SettingsPurchaseScreen: React.FC = () => {
  const t = useT();
  return (
    <SettingsLayout title={t("settings.subscription")}>
      <SubscriptionWidget />
    </SettingsLayout>
  );
};

export default SettingsPurchaseScreen;
