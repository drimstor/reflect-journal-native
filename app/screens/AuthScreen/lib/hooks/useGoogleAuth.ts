import { useSocialAuthMutation } from "@/src/entities";
import { PATHS } from "@/src/shared/const";
import { NavigationProps } from "@/src/shared/model/types";
import { useNavigation } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { GOOGLE_CLIENT_ID } from "../../const/static";
import { Variant } from "../../model/types";

WebBrowser.maybeCompleteAuthSession();

type User = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

export const useGoogleAuth = ({
  setVariant,
  snapToIndex,
}: {
  setVariant: (variant: Variant) => void;
  snapToIndex: (index: number) => void;
}) => {
  const navigation = useNavigation<NavigationProps>();
  const [socialAuthMutation] = useSocialAuthMutation();

  const [request, response, promptAsync] =
    Google.useAuthRequest(GOOGLE_CLIENT_ID);

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  const handleSignInWithGoogle = async () => {
    try {
      if (
        response?.type === "success" &&
        response.authentication?.accessToken
      ) {
        await getUserInfo(response.authentication.accessToken);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user: User = await response.json();

      // Используем новый API endpoint для социальной авторизации
      socialAuthMutation({
        email: user.email,
        auth_type: "google",
        user_id: user.id,
        name: user.given_name || user.name,
        avatar_url: user.picture,
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
          console.error("Google auth error:", error);
          // TODO: Обработать специфичные ошибки (например, "используйте другой способ")
        });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return {
    promptAsync,
  };
};
