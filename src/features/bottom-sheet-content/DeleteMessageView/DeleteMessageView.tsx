import { getMessagesEndpointParams } from "@/src/entities";
import {
  messagesApi,
  useDeleteMessageMutation,
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
  BottomSheetHeader,
  Button,
  Divider,
  PaddingLayout,
  Text,
} from "@/src/shared/ui";
import { useEffect } from "react";

const DeleteMessageView = () => {
  const t = useT();
  const dispatch = useAppDispatch();
  const { colors } = useThemeStore();
  const { navigateToFlow, flowData, setNavigation, setBottomSheetVisible } =
    useBottomSheetStore();
  const [deleteMessage, { isLoading, isSuccess }] = useDeleteMessageMutation();
  const endpointParams = useAppSelector(
    getMessagesEndpointParams(flowData.chatId)
  );

  const handleBack = () => {
    navigateToFlow("common", "list");
  };

  const handleDelete = async () => {
    try {
      if (flowData && flowData.id) {
        await deleteMessage(flowData.id)
          .unwrap()
          .then(() => {
            setTimeout(() => {
              dispatch(
                messagesApi.util.updateQueryData(
                  "getChatMessages",
                  endpointParams as never,
                  (cachedData) => {
                    const newData = cachedData.data.filter(
                      (item) => item._id !== flowData.id
                    );
                    return { ...cachedData, data: newData };
                  }
                )
              );
            }, 3200);
          });
      } else {
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (isSuccess) {
      setNavigation(false, undefined, undefined);
      navigateToFlow("common", "success");
    }
  }, [isSuccess]);

  const handleClose = () => {
    setBottomSheetVisible(false);
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={t("shared.confirmation.title")}
        onClose={handleClose}
        onBack={handleBack}
      />
      <PaddingLayout>
        <Text style={{ fontSize: 16, marginTop: -10 }} color={colors.contrast}>
          {t("shared.confirmation.deleteThisMessage")}
        </Text>
      </PaddingLayout>

      <Divider style={{ marginVertical: 8 }} color={colors.light} />
      <PaddingLayout>
        <Button
          backgroundColor={colors.error}
          textColor={colors.white}
          onPress={handleDelete}
          isLoading={isLoading}
        >
          {t("shared.actions.delete")}
        </Button>
      </PaddingLayout>
    </BottomSheetBox>
  );
};

export default DeleteMessageView;
