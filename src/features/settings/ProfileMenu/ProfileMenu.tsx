import { useT } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { Button, Text, UserIcon } from "@/src/shared/ui";
import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SmallLoader } from "../../../shared/ui/Loader/SmallLoader";
import { useAvatarManager } from "./lib/hooks/useAvatarManager";
import { createStyles } from "./ProfileMenu.styles";

const ProfileMenu = () => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const t = useT();

  const {
    avatarUrl,
    userData,
    isUserLoading,
    isLoading,
    handleImagePicker,
    setIsImageLoading,
  } = useAvatarManager({
    quality: 0.8,
    allowsEditing: true,
  });

  return (
    <View style={styles.globalBox}>
      <TouchableOpacity
        style={styles.avatarBox}
        onPress={handleImagePicker}
        disabled={isLoading}
      >
        {!isUserLoading &&
          (avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              onLoadStart={() => setIsImageLoading(true)}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          ) : (
            <UserIcon size={45} color={colors.contrast} />
          ))}
        {isLoading && (
          <View style={styles.imageLoadingOverlay}>
            <SmallLoader color={colors.contrast} />
          </View>
        )}
      </TouchableOpacity>
      <Text color={colors.contrast} size="extraLarge" font="bold">
        {isUserLoading ? " " : userData?.name || t("settings.noName")}
      </Text>
      <Text color={colors.contrast} size="small" withOpacity={70}>
        {isUserLoading ? " " : userData?.email}
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
