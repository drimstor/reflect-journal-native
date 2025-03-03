import { FC } from "react";
import {
  Button,
  Layout,
  PaddingLayout,
} from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { useLang, usePrefetch, useT } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { useLogOut } from "@/src/entities";
import { ConvertShapeIcon } from "@/src/shared/ui/icons";

interface ProfileScreenProps {}

const ProfileScreen: FC<ProfileScreenProps> = () => {
  const t = useT();
  const logout = useLogOut();
  const { colors, theme, toggleTheme } = useThemeStore();
  const { toggleLanguage } = useLang();

  return (
    <Layout>
      <Header
        title={t("profile.title")}
        leftIcon={{
          icon: <ConvertShapeIcon color={colors.contrast} />,
          onPress: toggleLanguage,
        }}
        rightIcon={{
          icon: <ConvertShapeIcon color={colors.contrast} />,
          onPress: toggleTheme,
        }}
      />
      <PaddingLayout>
        <Button
          style={{ marginVertical: 20 }}
          backgroundColor={colors.contrast}
          onPress={logout}
        >
          {t("shared.actions.logout")}
        </Button>
      </PaddingLayout>
    </Layout>
  );
};

export default ProfileScreen;
