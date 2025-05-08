import { useNavigation } from "@react-navigation/native";
import { tokenService } from "@/src/shared/store";
import { useLogoutMutation } from "@/src/entities/auth/api/authApi";
import { PATHS } from "@/src/shared/const";
import { NavigationProps } from "@/src/shared/model/types";

export const useLogOut = () => {
  const [logoutMutation] = useLogoutMutation();
  const navigation = useNavigation<NavigationProps>();

  const logout = async () => {
    const refreshToken = await tokenService.getRefreshToken();
    if (!refreshToken) return;
    await logoutMutation(refreshToken);
    await tokenService.removeTokens();
    navigation.navigate(PATHS.AUTH);
  };

  return logout;
};

export const useLogOutWithNavigation = () => {
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    const refreshToken = await tokenService.getRefreshToken();
    if (!refreshToken) return;
    await logoutMutation(refreshToken);
    await tokenService.removeTokens();
  };

  return logout;
};
