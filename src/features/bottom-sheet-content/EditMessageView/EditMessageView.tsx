import { getMessagesEndpointParams } from "@/src/entities";
import {
  messagesApi,
  useUpdateMessageMutation,
} from "@/src/entities/chat/api/messagesApi";
import { useT } from "@/src/shared/lib/hooks";
import {
  useAppDispatch,
  useAppSelector,
  useBottomSheetStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetScrollView,
  Button,
  PaddingLayout,
  TextField,
} from "@/src/shared/ui";
import { useEffect, useState } from "react";

const EditMessageView = () => {
  const t = useT();
  const dispatch = useAppDispatch();
  const { navigateToFlow, flowData, setNavigation, setBottomSheetVisible } =
    useBottomSheetStore();
  const endpointParams = useAppSelector(
    getMessagesEndpointParams(flowData.chatId)
  );
  const { colors, theme } = useThemeStore();
  const [updateMessage, { isLoading, isSuccess }] = useUpdateMessageMutation();
  const [content, setContent] = useState(flowData?.text || "");
  const [error, setError] = useState<string | null>(null);

  // Обработчик изменения текста сообщения
  const handleContentChange = (text: string) => {
    setContent(text);
    if (error) {
      setError(null);
    }
  };

  // Обработчик сохранения изменений
  const handleSubmit = async () => {
    if (!content.trim()) {
      setError(t("shared.validation.required"));
      return;
    }

    try {
      if (flowData && flowData.id) {
        await updateMessage({
          message_id: flowData.id,
          data: { content },
        })
          .unwrap()
          .then(() => {
            dispatch(
              messagesApi.util.updateQueryData(
                "getChatMessages",
                endpointParams as never,
                (cachedData) => {
                  const newData = cachedData.data.map((item) =>
                    item._id === flowData.id
                      ? { ...item, content, text: content }
                      : item
                  );
                  return { ...cachedData, data: newData };
                }
              )
            );
          });
      }
    } catch (err) {
      console.error("Ошибка при редактировании сообщения:", err);
    }
  };

  // Эффект для обработки успешного редактирования
  useEffect(() => {
    if (isSuccess) {
      setNavigation(false, undefined, undefined);
      navigateToFlow("common", "success");
    }
  }, [isSuccess, navigateToFlow, setNavigation]);

  // Обработчик возврата
  const handleBack = () => {
    navigateToFlow("common", "list");
  };

  const handleClose = () => {
    setBottomSheetVisible(false);
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={t("shared.actions.editing")}
        onClose={handleClose}
        onBack={handleBack}
      />
      <BottomSheetScrollView>
        <PaddingLayout style={{ gap: 12 }}>
          <TextField
            label={t("libraryItem.content")}
            value={content}
            onChangeText={handleContentChange}
            backgroundColor={colors.secondary}
            multiline
            helperText={error || ""}
            helperTextColor={error ? colors.error : undefined}
            required={true}
          />
        </PaddingLayout>
        <BottomSheetFooter>
          <Button
            backgroundColor={theme === "dark" ? colors.accent : colors.primary}
            textColor={theme === "dark" ? colors.primary : colors.white}
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            {t("shared.actions.save")}
          </Button>
        </BottomSheetFooter>
      </BottomSheetScrollView>
    </BottomSheetBox>
  );
};

export default EditMessageView;
