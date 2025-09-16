import { AttachmentsPopup } from "@/src/features";
import {
  useImagePickerWithActions,
  useT,
  useToggle,
} from "@/src/shared/lib/hooks";
import { ImagePickerResult } from "@/src/shared/lib/hooks/useImagePicker";
import { useThemeStore } from "@/src/shared/store";
import { PlusIcon, SendIcon } from "@/src/shared/ui/icons";
import { ImagePreview } from "@/src/shared/ui/ImagePreview/ImagePreview";
import * as Haptics from "expo-haptics";
import { FC } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import {
  IMessage,
  InputToolbar,
  InputToolbarProps,
} from "react-native-gifted-chat";
import { createStyles } from "./MessageInput.styles";

interface MessageInputProps extends InputToolbarProps<IMessage> {
  text: string;
  onChangeText: (text: string) => void;
  onSend: (images?: ImagePickerResult[]) => void; // Добавляем возможность передачи изображений
}

const MessageInput: FC<MessageInputProps> = ({
  text,
  onChangeText,
  onSend,
  ...props
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors, theme);
  const { value: isAttachmentsVisible, toggle: toggleAttachments } =
    useToggle();

  // Хук для работы с изображениями и обработкой выбора
  const {
    selectedImages,
    removeImage,
    clearImages,
    isLoading,
    handleImagePicker,
  } = useImagePickerWithActions({
    allowsMultipleSelection: true,
    selectionLimit: 5,
    quality: 0.8,
    allowsEditing: false,
  });

  // Обработчик отправки сообщения
  const handleSend = () => {
    if (text.trim() || selectedImages.length > 0) {
      onSend(selectedImages.length > 0 ? selectedImages : undefined);
      clearImages(); // Очищаем выбранные изображения после отправки
    }
  };

  return (
    <View style={styles.container}>
      <InputToolbar
        {...props}
        containerStyle={styles.toolbar}
        renderComposer={() => (
          <View style={styles.composerContainerWrapper}>
            {/* Превью выбранных изображений */}
            {selectedImages.length > 0 && (
              <ImagePreview
                images={selectedImages}
                onRemove={removeImage}
                showRemoveButton={true}
                containerStyle={{ paddingHorizontal: 4 }}
                onMorePress={() => handleImagePicker()}
              />
            )}
            <View style={styles.composerContainer}>
              <TextInput
                placeholder={t("chat.placeholder")}
                placeholderTextColor={colors.contrast + 50}
                style={styles.input}
                value={text}
                onChangeText={onChangeText}
                multiline
              />
              <TouchableOpacity
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
                }
                onPressIn={() => {
                  if (text.trim() || selectedImages.length > 0) {
                    handleSend();
                  } else {
                    toggleAttachments();
                  }
                }}
                style={styles.sendButton}
                disabled={isLoading}
              >
                {text.trim() || selectedImages.length > 0 ? (
                  <SendIcon color={colors.contrastReverse} size={20} />
                ) : (
                  <PlusIcon color={colors.contrastReverse} size={26} />
                )}
              </TouchableOpacity>
              <AttachmentsPopup
                isVisible={isAttachmentsVisible}
                onClose={toggleAttachments}
                onImagePickerPress={handleImagePicker}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MessageInput;
