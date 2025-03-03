import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useLoginMutation, useRegisterMutation } from "@/src/entities";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";
import { PATHS } from "@/src/shared/const";
import { useEffect } from "react";
import { GOOGLE_CLIENT_ID } from "../../const/static";

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

export const useGoogleAuth = () => {
  const navigation = useNavigation<NavigationProps>();
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

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

      registerMutation({
        email: `google.${user?.email}`,
        name: user?.name || user?.given_name + " " + user?.family_name,
        avatar_url: user?.picture,
        password: user?.id,
      })
        .unwrap()
        .then(() => {
          navigation.navigate(PATHS.MAIN_STACK);
        })
        .catch((error) => {
          if (error.status === 409) {
            loginMutation({
              email: `google.${user?.email}`,
              password: user?.id,
            })
              .unwrap()
              .then(() => {
                navigation.navigate(PATHS.MAIN_STACK);
              })
              .catch((error) => {
                console.log({ error });
              });
          }
        });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return {
    promptAsync,
  };
};
