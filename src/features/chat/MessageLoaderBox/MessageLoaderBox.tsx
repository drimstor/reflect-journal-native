import { useThemeStore } from "@/src/shared/store";
import { MessageLoader } from "@/src/shared/ui";
import { StyleProp, View, ViewStyle } from "react-native";
import { createStyles } from "./MessageLoaderBox.styles";

const MessageLoaderBox = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors, theme);
  return (
    <View style={[styles.globalBox, style]}>
      <View style={styles.loaderBox}>
        <MessageLoader />
      </View>
    </View>
  );
};

export default MessageLoaderBox;
