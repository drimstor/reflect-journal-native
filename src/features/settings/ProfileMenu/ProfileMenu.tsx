import { View } from "react-native";
import { createStyles } from "./ProfileMenu.styles";
import { Button, Text, UserIcon } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
const ProfileMenu = ({}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const t = useT();

  return (
    <View style={styles.globalBox}>
      <View style={styles.avatarBox}>
        {/* <Image src={avatar} alt="avatar" /> */}
        <UserIcon size={45} color={colors.contrast} />
      </View>
      <Text color={colors.contrast} size="extraLarge" font="bold">
        Username
      </Text>
      <Text color={colors.contrast} size="small" withOpacity={70}>
        email@gmail.com
      </Text>
      <Button
        style={styles.editButton}
        backgroundColor={colors.contrast}
        size="small"
        onPress={() => {}}
      >
        {t("settings.editProfile")}
      </Button>
    </View>
  );
};

export default ProfileMenu;
