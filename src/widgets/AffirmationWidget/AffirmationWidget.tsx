import { useThemeStore } from "@/src/shared/store";
import { GradientAffirmation } from "@/src/features";
import { KeyIcon } from "@/src/shared/ui/icons";
import { AffirmationResponse } from "@/src/entities/affirmations/model/types";

interface AffirmationWidgetProps {
  /** Внешние данные аффирмации (опционально) */
  data?: AffirmationResponse;
}

const AffirmationWidget = ({ data: externalData }: AffirmationWidgetProps) => {
  const { colors } = useThemeStore();

  return (
    <GradientAffirmation
      colors={colors}
      value={externalData?.content ?? ""}
      icon={<KeyIcon color={colors.primary} size={54} />}
    />
  );
};

export default AffirmationWidget;
