import { FC } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import {
  InputToolbar,
  InputToolbarProps,
  IMessage,
} from "react-native-gifted-chat";
import { useThemeStore } from "@/src/shared/store";
import { PlusIcon, SendIcon } from "@/src/shared/ui/icons";
import { AttachmentsPopup } from "@/src/features";
import * as Haptics from "expo-haptics";
import { createStyles } from "./MessageInput.styles";
import { useToggle } from "@/src/shared/lib/hooks";

interface MessageInputProps extends InputToolbarProps<IMessage> {
  text: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

const MessageInput: FC<MessageInputProps> = ({
  text,
  onChangeText,
  onSend,
  ...props
}) => {
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors, theme);
  const { value: isAttachmentsVisible, toggle: toggleAttachments } =
    useToggle();

  return (
    <View style={styles.container}>
      <InputToolbar
        {...props}
        containerStyle={styles.toolbar}
        renderComposer={() => (
          <View style={styles.composerContainer}>
            <TextInput
              placeholder="Введите сообщение..."
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
              onPressIn={text.trim() ? onSend : toggleAttachments}
              style={styles.sendButton}
            >
              {text.trim() ? (
                <SendIcon color={colors.contrastReverse} size={20} />
              ) : (
                <PlusIcon color={colors.contrastReverse} size={26} />
              )}
            </TouchableOpacity>
            <AttachmentsPopup
              isVisible={isAttachmentsVisible}
              onClose={toggleAttachments}
            />
          </View>
        )}
      />
    </View>
  );
};

export default MessageInput;
