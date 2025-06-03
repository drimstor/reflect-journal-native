import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text } from "../";
import { createStyles } from "./MoodSelector.styles";
import { useGetMood } from "@/src/entities/journals/lib/hooks/useGetMood";

// Компонент выбора настроения с эмодзи
export const MoodSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  colors: any;
}> = ({ value, onChange, colors }) => {
  const moods = useGetMood(undefined, true);
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {(moods as any[])?.map((mood) => (
        <TouchableOpacity
          key={mood.value}
          style={[
            styles.moodButton,
            value === mood.value && styles.selectedMoodButton,
          ]}
          onPress={() => onChange(mood.value)}
        >
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text
            color={value === mood.value ? colors.accent : colors.contrast}
            style={styles.label}
          >
            {mood.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
