import { useT } from "@/src/shared/lib/hooks";
import { EntityType } from "@/src/shared/model/types";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import { Button } from "@/src/shared/ui";
import React, { FC } from "react";

interface CommandWidgetChatProps {
  currentItem: any;
  sourceType: EntityType;
}

export const CommandWidgetChat: FC<CommandWidgetChatProps> = ({
  currentItem,
  sourceType,
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();

  console.log(currentItem?.command);

  const { navigateToFlow, setBottomSheetVisible, setFlowData } =
    useBottomSheetStore();

  const commandsConfig = {
    client_create_goal: {
      title: t("commands.createGoal"),
      onPress: () => {
        navigateToFlow("goal", "create");

        const params = {
          source_type: sourceType,
          source_id: currentItem.id,
        };

        setFlowData({
          requestAssistantMessage: params,
          requestAssistantMessageStore: params,
        });

        requestAnimationFrame(() => {
          setBottomSheetVisible(true);
        });
      },
    },
  };

  return (
    currentItem?.command &&
    commandsConfig[currentItem?.command as keyof typeof commandsConfig] && (
      <Button
        style={{ marginTop: 20 }}
        onPress={() => {
          commandsConfig[
            currentItem?.command as keyof typeof commandsConfig
          ]?.onPress();
        }}
        backgroundColor={theme === "dark" ? colors.accent : colors.primary}
      >
        {
          commandsConfig[currentItem?.command as keyof typeof commandsConfig]
            ?.title
        }
      </Button>
    )
  );
};
