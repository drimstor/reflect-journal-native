import { useT } from "@/src/shared/lib/hooks";

export const useGetMood = (mood?: string, returnAll = false) => {
  const t = useT();
  const moods = [
    { value: "poor", emoji: "😞", label: t("edit.common.mood.poor") },
    { value: "fair", emoji: "😐", label: t("edit.common.mood.fair") },
    { value: "neutral", emoji: "😊", label: t("edit.common.mood.neutral") },
    { value: "good", emoji: "😄", label: t("edit.common.mood.good") },
    { value: "excellent", emoji: "🤩", label: t("edit.common.mood.excellent") },
  ];

  return returnAll ? moods : moods.find((m) => m.value === mood);
};
