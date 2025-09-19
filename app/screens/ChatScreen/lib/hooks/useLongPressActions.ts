import { useT } from "@/src/shared/lib/hooks";
import {
  addSnackbar,
  useAppDispatch,
  useBottomSheetStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  ClipboardTextIcon,
  EditPencilIcon,
  TrashIcon,
} from "@/src/shared/ui/icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";

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

      // const customActionsForAssistant = {
      //   text: t("goals.create"),
      //   IconComponent: ClipboardCheckIcon,
      //   onPress: () => {
      //     setBottomSheetVisible(false);

      //     requestAnimationFrame(() => {
      //       navigateToFlow("goal", "create");

      //       const params = {
      //         source_type: flowData.variant,
      //         source_id: flowData.id,
      //       };

      //       setFlowData({
      //         requestAssistantMessage: params,
      //         requestAssistantMessageStore: params,
      //       });

      //       requestAnimationFrame(() => {
      //         setBottomSheetVisible(true);
      //       });
      //     });
      //   },
      // };

      const customActionsForUser = {
        text: t("shared.actions.edit"),
        IconComponent: EditPencilIcon,
        onPress: () => {
          setBottomSheetVisible(false);

          requestAnimationFrame(() => {
            navigateToFlow("chat", "edit");
            setBottomSheetVisible(true);
          });
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
              // customActionsForAssistant,
              customActionsLastPart,
            ]
          : [customActionsCommon, customActionsForUser, customActionsLastPart];

      setActions(customActions);
      setFlowData({ ...flowData, chatId });
      navigateToFlow("common", "list");

      requestAnimationFrame(() => {
        setBottomSheetVisible(true);
      });
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
