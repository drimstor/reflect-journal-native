import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { useT } from "@/src/shared/lib/hooks";
import {
  useAppDispatch,
  useThemeStore,
  useBottomSheetStore,
} from "@/src/shared/store";
import { addSnackbar } from "@/src/shared/store";
import {
  ClipboardCheckIcon,
  ClipboardTextIcon,
  EditPencilIcon,
  TrashIcon,
} from "@/src/shared/ui/icons";

export const useLongPressActions = (chatId: string) => {
  const t = useT();
  const dispatch = useAppDispatch();
  const { colors } = useThemeStore();
  const {
    setBottomSheetVisible,
    navigateToFlow,
    setNavigation,
    setActions,
    setFlowData,
  } = useBottomSheetStore();

  const handleLongPress = useCallback(
    (flowData: any) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      const customActionsCommon = {
        text: t("shared.actions.copy"),
        IconComponent: ClipboardTextIcon,
        onPress: () => {
          if (flowData && flowData.text) {
            Clipboard.setStringAsync(flowData.text);
            setBottomSheetVisible(false);

            dispatch(
              addSnackbar({
                text: t("shared.actions.copied"),
                type: "success",
              })
            );
          }
        },
      };

      const customActionsForAssistant = {
        text: t("goals.create"),
        IconComponent: ClipboardCheckIcon,
        onPress: () => {},
      };

      const customActionsForUser = {
        text: t("shared.actions.edit"),
        IconComponent: EditPencilIcon,
        onPress: () => {
          setBottomSheetVisible(false);

          setTimeout(() => {
            navigateToFlow("chat", "edit");
          }, 150);

          setTimeout(() => {
            setBottomSheetVisible(true);
          }, 300);
        },
      };

      const customActionsLastPart = {
        text: t("shared.actions.delete"),
        IconComponent: TrashIcon,
        iconColor: colors.error,
        iconSize: 26,
        onPress: () => {
          navigateToFlow("chat", "delete");
        },
      };

      const customActions =
        flowData.user_id === "assistant"
          ? [
              customActionsCommon,
              customActionsForAssistant,
              customActionsLastPart,
            ]
          : [customActionsCommon, customActionsForUser, customActionsLastPart];

      setActions(customActions);
      setFlowData({ ...flowData, chatId });
      navigateToFlow("common", "list");

      setTimeout(() => {
        setBottomSheetVisible(true);
      }, 150);
    },
    [
      t,
      dispatch,
      colors,
      setBottomSheetVisible,
      navigateToFlow,
      setNavigation,
      setActions,
      setFlowData,
    ]
  );

  return { handleLongPress };
};
