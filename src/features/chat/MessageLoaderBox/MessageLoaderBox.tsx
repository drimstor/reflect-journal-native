import { View } from "react-native";
import { createStyles } from "./MessageLoaderBox.styles";
import { MessageLoader } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";

const MessageLoaderBox = ({}) => {
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors, theme);
  return (
    <View style={styles.globalBox}>
      <View style={styles.loaderBox}>
        <MessageLoader />
      </View>
    </View>
  );
};

export default MessageLoaderBox;
