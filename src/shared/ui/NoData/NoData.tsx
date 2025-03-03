import { View, ViewStyle } from "react-native";
import { styles } from "./NoData.styles";
import { NoSearchDataImg } from "../assets";
import { ErrorDataImg } from "../assets";
import { NoDataImg } from "../assets";
import Text from "../Text/Text";
import { useT } from "../../lib/hooks";
import { useThemeStore } from "../../store";
import Button from "../Button/Button";

const NoData = ({
  type = "noData",
  onPress,
  style,
}: {
  type?: "noData" | "error" | "noSearch" | "noMessage";
  onPress?: () => void;
  style?: ViewStyle;
}) => {
  const t = useT();
  const { colors } = useThemeStore();

  const config = {
    noData: {
      img: <NoDataImg />,
      title: t("shared.noData.title"),
      description: t("shared.noData.description"),
      buttonText: t("shared.actions.create"),
    },
    error: {
      img: <ErrorDataImg />,
      title: t("shared.noData.errorTitle"),
      description: t("shared.noData.errorDescription"),
      buttonText: t("shared.actions.update"),
    },
    noSearch: {
      img: <NoSearchDataImg />,
      title: t("shared.noData.noSearchTitle"),
      description: t("shared.noData.noSearchDescription"),
      buttonText: t("shared.actions.resetSearch"),
    },
    noMessage: {
      img: <NoDataImg />,
      title: t("shared.noData.noMessageTitle"),
      description: t("shared.noData.noMessageDescription"),
      buttonText: "",
    },
  };

  const button = config[type];

  return (
    <View style={[styles.globalBox, style]}>
      {button.img}
      <Text
        style={styles.title}
        font="bold"
        size="extraLarge"
        color={colors.contrast}
      >
        {button.title}
      </Text>
      <Text color={colors.contrast}>{button.description}</Text>
      {button.buttonText && onPress && (
        <Button
          style={styles.button}
          size="small"
          backgroundColor={colors.contrast}
          onPress={onPress}
        >
          {button.buttonText}
        </Button>
      )}
    </View>
  );
};

export default NoData;
