import React, { FC } from "react";
import { useT } from "@/src/shared/lib/hooks";
import { Button } from "@/src/shared/ui";
import { useThemeStore, useBottomSheetStore } from "@/src/shared/store";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { PATHS } from "@/src/shared/const";
import { getEntitiesIds, Journal } from "@/src/entities";
import {
  useCreateChatMutation,
  useRelateEntitiesMutation,
} from "@/src/entities";
import { EntityType, NavigationProps } from "@/src/shared/model/types";
import { useNavigation } from "@react-navigation/native";

interface CommandWidgetProps {
  currentItem: any;
  parentJournal?: Journal;
  sourceType: EntityType;
}

export const CommandWidget: FC<CommandWidgetProps> = ({
  currentItem,
  parentJournal,
  sourceType,
}) => {
  const t = useT();
  const navigation = useNavigation<NavigationProps>();
  const { colors, theme } = useThemeStore();
  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();
  const [relateEntities, { isLoading: isRelatingEntities }] =
    useRelateEntitiesMutation();

  const { navigateToFlow, setBottomSheetVisible, setFlowData } =
    useBottomSheetStore();

  const commandsConfig = {
    client_create_goal: {
      title: t("commands.createGoal"),
      onPress: () => {
        navigateToFlow("goal", "create");

        setTimeout(() => {
          setBottomSheetVisible(true);

          const params = {
            source_type: sourceType,
            source_id: currentItem.id,
          };

          setFlowData({
            requestAssistantMessage: params,
            requestAssistantMessageStore: params,
          });
        }, 150);
      },
    },
    client_create_chat: {
      title: t("commands.createChat"),
      onPress: () => {
        const foundRelatedChat = parentJournal?.related_entities?.find(
          (entity) => entity.entity_type === ENTITY_NAME.CHAT
        );

        if (foundRelatedChat) {
          const params = {
            item: foundRelatedChat,
            requestAssistantMessage: {
              source_type: sourceType,
              source_id: currentItem.id,
            },
          };

          return navigation.navigate(PATHS.CHAT, params);
        }

        createChat({
          name: `${t("chat.autoName")} "${parentJournal?.name}"`,
          description: t("chat.autoDescription"),
          related_topics: currentItem?.related_topics,
        })
          .unwrap()
          .then((chat) => {
            relateEntities({
              source_type:
                sourceType === ENTITY_NAME.JOURNAL_ENTRY
                  ? ENTITY_NAME.JOURNAL
                  : sourceType,
              source_id: getEntitiesIds(currentItem.id)[0],
              target_type: ENTITY_NAME.CHAT,
              target_id: chat.id,
            })
              .unwrap()
              .then(() => {
                const params = {
                  item: chat,
                  requestAssistantMessage: {
                    source_type: sourceType,
                    source_id: currentItem.id,
                  },
                };

                navigation.navigate(PATHS.CHAT, params);
              });
          });
      },
    },
    client_create_journal: {
      title: t("commands.createJournal"),
      onPress: () => {
        navigation.navigate(PATHS.ADD_ENTRY, {
          variant: ENTITY_NAME.JOURNAL,
        });
      },
    },
  };

  return (
    currentItem?.command &&
    commandsConfig[currentItem?.command as keyof typeof commandsConfig] && (
      <Button
        isLoading={isCreatingChat || isRelatingEntities}
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
