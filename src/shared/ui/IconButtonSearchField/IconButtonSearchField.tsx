import { FC, useMemo } from "react";
import {
  StyleProp,
  ViewStyle,
  Animated,
  TextInput,
  Pressable,
} from "react-native";
import { createStyles } from "./IconButtonSearchField.styles";
import { useThemeStore } from "@/src/shared/store";
import { PlusIcon, SearchIcon } from "../icons";
import { useT } from "../../lib/hooks";
import { useAnimation } from "./lib/hooks/useAnimation";
import { useSearchFieldState } from "./lib/hooks/useSearchFieldState";
import { useSearchFieldLayout } from "./lib/hooks/useSearchFieldLayout";

interface IconButtonSearchFieldProps {
  style?: StyleProp<ViewStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
}

const IconButtonSearchField: FC<IconButtonSearchFieldProps> = ({
  style,
  value = "",
  onChangeText,
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const styles = useMemo(() => createStyles(colors, theme), [theme]);

  // Используем хук для управления состоянием поля поиска
  const { inputRef, isExpanded, isFocused, isEmpty, handleToggle } =
    useSearchFieldState({ value, onChangeText });

  // Используем хук для анимации
  const { animatedStyle } = useAnimation(isExpanded);

  // Используем хук для расчета размеров
  const { inputWidth } = useSearchFieldLayout({ isExpanded });

  return (
    <Animated.View style={[styles.globalBox, animatedStyle]}>
      <Pressable onPress={handleToggle} style={[style, styles.pressable]}>
        <SearchIcon color={colors.contrast} />
      </Pressable>

      {isExpanded && (
        <TextInput
          ref={inputRef}
          style={[
            styles.textField,
            { color: colors.contrast },
            { width: inputWidth },
          ]}
          value={value}
          maxLength={50}
          placeholder={t("shared.actions.search") + "..."}
          placeholderTextColor={colors.contrast + "80"}
          onChangeText={onChangeText}
          keyboardType={"default"}
        />
      )}
      {isFocused && !isEmpty && (
        <Pressable onPress={handleToggle} style={[style, styles.pressablePlus]}>
          <PlusIcon size={28} color={colors.contrast} />
        </Pressable>
      )}
    </Animated.View>
  );
};

export default IconButtonSearchField;
