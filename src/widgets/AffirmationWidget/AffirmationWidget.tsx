import { AffirmationResponse } from "@/src/entities/affirmations/model/types";
import { GradientAffirmation } from "@/src/features";
import { useThemeStore } from "@/src/shared/store";
import { KeyIcon } from "@/src/shared/ui/icons";

interface AffirmationWidgetProps {
  data?: AffirmationResponse;
}

const AffirmationWidget = ({ data: externalData }: AffirmationWidgetProps) => {
  const { colors } = useThemeStore();

  return (
    <GradientAffirmation
      value={externalData?.content ?? ""}
      icon={<KeyIcon color={colors.primary} size={54} />}
    />
  );
};

export default AffirmationWidget;
