import { useSocialAuthMutation } from "@/src/entities";
import { PATHS } from "@/src/shared/const";
import { NavigationProps } from "@/src/shared/model/types";
import { useNavigation } from "@react-navigation/native";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { Variant } from "../../model/types";

type AppleUser = {
  user: string;
  email?: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
  identityToken?: string;
  authorizationCode?: string;
};

export const useAppleAuth = ({
  setVariant,
  snapToIndex,
}: {
  setVariant: (variant: Variant) => void;
  snapToIndex: (index: number) => void;
}) => {
  const navigation = useNavigation<NavigationProps>();
  const [socialAuthMutation] = useSocialAuthMutation();

  const signInWithApple = async () => {
    try {
      // Проверяем доступность Apple авторизации
      if (Platform.OS !== "ios") {
        console.warn("Apple Sign In is only available on iOS");
        return;
      }

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        console.warn("Apple Sign In is not available on this device");
        return;
      }

      // Запрашиваем авторизацию
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      await handleAppleSignIn(credential);
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        // Пользователь отменил авторизацию
        console.log("Apple Sign In was canceled by user");
        return;
      }
      console.error("Error signing in with Apple:", error);
    }
  };

  const handleAppleSignIn = async (credential: AppleUser) => {
    try {
      // Извлекаем данные пользователя
      const userId = credential.user;
      const email = credential.email || "";
      const name = credential.fullName?.givenName || "User";

      // Используем новый API endpoint для социальной авторизации
      socialAuthMutation({
        email: email,
        auth_type: "apple",
        user_id: userId,
        name: name,
      })
        .unwrap()
        .then(({ is_new_user }) => {
          if (is_new_user) {
            setVariant("profile");
          } else {
            snapToIndex(1);
            setTimeout(() => {
              navigation.navigate(PATHS.MAIN_STACK);
            }, 400);
          }
        })
        .catch((error) => {
          console.error("Apple auth error:", error);
          // TODO: Обработать специфичные ошибки (например, "используйте другой способ")
        });
    } catch (error) {
      console.error("Error handling Apple sign in:", error);
    }
  };

  return {
    signInWithApple,
    isAvailable: Platform.OS === "ios",
  };
};
