import {
  getEntitiesIds,
  Journal,
  useCreateChatMutation,
  useRelateEntitiesMutation,
} from "@/src/entities";
import { PATHS } from "@/src/shared/const";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { useT } from "@/src/shared/lib/hooks";
import { EntityType, NavigationProps } from "@/src/shared/model/types";
import {
  useBottomSheetStore,
  useScreenInfoStore,
  useThemeStore,
} from "@/src/shared/store";
import { Button } from "@/src/shared/ui";
import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import { View } from "react-native";
import { styles } from "./CommandWidget.styles";
import { createChatConfig } from "./const/static";

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
  const { setNavigationScreenInfo } = useScreenInfoStore();
  const { navigateToFlow, setBottomSheetVisible, setFlowData } =
    useBottomSheetStore();

  // Функции команд с возможностью передачи дополнительных параметров
  const createGoalCommand = (goalName?: string) => () => {
    navigateToFlow("goal", "create");

    setTimeout(() => {
      setBottomSheetVisible(true);

      const params = {
        source_type: sourceType,
        source_id: currentItem.id,
        ...(goalName && { goal_name: goalName }),
      };

      setFlowData({
        requestAssistantMessage: params,
        requestAssistantMessageStore: params,
      });
    }, 150);
  };

  const createChatCommand = () => {
    let findingEntity = null;

    if (sourceType === ENTITY_NAME.JOURNAL_ENTRIES) {
      findingEntity = parentJournal;
    } else {
      findingEntity = currentItem;
    }

    const foundRelatedChat = findingEntity?.related_entities?.find(
      (entity) => entity.entity_type === ENTITY_NAME.CHATS
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

    const config = createChatConfig[sourceType] || createChatConfig.default;

    createChat({
      name: `${t(config.nameKey)} "${findingEntity?.name}"`,
      description: t(config.descriptionKey),
      related_topics:
        sourceType === ENTITY_NAME.JOURNAL_ENTRIES
          ? currentItem?.related_topics
          : currentItem?.related_topics,
    })
      .unwrap()
      .then((chat) => {
        relateEntities({
          source_type:
            sourceType === ENTITY_NAME.JOURNAL_ENTRIES
              ? ENTITY_NAME.JOURNALS
              : sourceType,
          source_id:
            sourceType === ENTITY_NAME.JOURNAL_ENTRIES
              ? getEntitiesIds(currentItem.id)[0]
              : currentItem.id,
          target_type: ENTITY_NAME.CHATS,
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
  };

  const createJournalCommand = () => {
    setNavigationScreenInfo({ name: ENTITY_NAME.JOURNALS });
    navigation.navigate(PATHS.ADD_ENTRY, { variant: ENTITY_NAME.JOURNALS });
  };

  const findTalentCommand = () => {
    navigation.navigate(PATHS.TEST, { testId: "ikigai" });
  };

  const commandsConfig = {
    client_create_goal: {
      title: t("commands.createGoal"),
      onPress: createGoalCommand(),
    },
    client_create_chat: {
      title: t("commands.createChat"),
      onPress: createChatCommand,
    },
    client_create_journal: {
      title: t("commands.createJournal"),
      onPress: createJournalCommand,
    },
    client_create_multi_goal: {
      title: t("commands.createGoal"),
      onPress: createGoalCommand(),
    },
    client_find_talent: {
      title: t("commands.takeTest"),
      onPress: findTalentCommand,
    },
  };

  const arrayFields = ["predict_goals"];
  const arrayCommands = ["client_create_multi_goal"];

  const isArrayType = arrayFields.some(
    (field) =>
      Array.isArray(currentItem?.[field]) && !!currentItem?.[field]?.length
  );

  // Рендер одиночной кнопки
  const renderSingleButton = () => {
    const command = currentItem?.command as keyof typeof commandsConfig;
    const config = commandsConfig[command];

    if (!config) return null;

    return (
      <Button
        key={command}
        isLoading={isCreatingChat || isRelatingEntities}
        onPress={config.onPress}
        backgroundColor={theme === "dark" ? colors.accent : colors.primary}
        isDynamicHeight
      >
        {config.title}
      </Button>
    );
  };

  // Рендер множественных кнопок
  const renderMultipleButtons = () => {
    const command = currentItem?.command as keyof typeof commandsConfig;

    if (!arrayCommands.includes(command)) {
      return renderSingleButton();
    }

    // Находим соответствующее поле с массивом данных
    const arrayField = arrayFields.find(
      (field) =>
        Array.isArray(currentItem?.[field]) && !!currentItem?.[field]?.length
    );

    if (!arrayField) {
      return renderSingleButton();
    }

    const arrayData = currentItem[arrayField];

    return (
      <View style={styles.multipleButtonsContainer}>
        {arrayData.map((item: string, index: number) => {
          let buttonTitle = "";
          let onPressHandler = () => {};

          // Определяем заголовок и обработчик для каждого типа команды
          if (arrayCommands.includes(command)) {
            buttonTitle = `${item}`;
            onPressHandler = createGoalCommand(item);
          } else {
            buttonTitle = `${commandsConfig[command]?.title}: ${item}`;
            onPressHandler = commandsConfig[command]?.onPress || (() => {});
          }

          return (
            <Button
              key={`${command}-${index}`}
              isLoading={isCreatingChat || isRelatingEntities}
              onPress={onPressHandler}
              backgroundColor={
                theme === "dark" ? colors.accent : colors.primary
              }
              isDynamicHeight
            >
              {buttonTitle}
            </Button>
          );
        })}
      </View>
    );
  };

  // Основная логика отображения
  if (
    !currentItem?.command ||
    !commandsConfig[currentItem?.command as keyof typeof commandsConfig]
  ) {
    return null;
  }

  return isArrayType ? renderMultipleButtons() : renderSingleButton();
};
