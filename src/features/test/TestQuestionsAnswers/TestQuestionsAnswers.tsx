import React, { useState } from "react";
import { View } from "react-native";
import { useT } from "../../../shared/lib/hooks";
import { useThemeStore } from "../../../shared/store";
import { Button, Text, TitleText } from "../../../shared/ui";
import { DotsIcon } from "../../../shared/ui/icons";
import { createStyles } from "./TestQuestionsAnswers.styles";
import { TestQuestionsAnswersProps } from "./model/types";

const TestQuestionsAnswers: React.FC<TestQuestionsAnswersProps> = ({
  questions,
  answers,
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors);
  const [isExpanded, setIsExpanded] = useState(false);

  // Если нет данных - не отображаем компонент
  if (!questions?.length || !answers) {
    return null;
  }

  // Показываем первые 2 вопроса по умолчанию
  const visibleQuestions = isExpanded ? questions : questions.slice(0, 2);

  // Функция для получения текста ответа
  const getAnswerText = (questionIndex: number) => {
    const answer = answers[(questionIndex + 1).toString()];
    if (!answer) return t("test.noAnswer");

    return String(answer);
  };

  return (
    <View style={styles.container}>
      <TitleText
        text={t("test.questionsAndAnswers")}
        textColor={colors.contrast}
        element={<DotsIcon color={colors.contrast} size={22} />}
        variant="subTitle"
        style={styles.titleText}
      />

      {visibleQuestions.map((question, index: number) => {
        const answerText = getAnswerText(index);

        return (
          <View style={styles.questionContainer} key={index}>
            {/* Вопрос */}
            <View style={styles.questionRow}>
              <Text
                size="small"
                color={colors.contrast}
                withOpacity={80}
                font="bold"
                style={styles.label}
              >
                {t("test.question")} №{index + 1}:
              </Text>
              <Text size="medium" color={colors.contrast}>
                {question.question}
              </Text>
            </View>

            {/* Категория (если есть) */}
            {question.category && (
              <View style={styles.questionRow}>
                <Text
                  size="small"
                  color={colors.contrast}
                  withOpacity={80}
                  font="bold"
                  style={styles.label}
                >
                  {t("test.category")}:
                </Text>
                <Text size="medium" color={colors.contrast}>
                  {question.category}
                </Text>
              </View>
            )}

            {/* Ответ пользователя */}
            <View style={styles.questionRow}>
              <Text
                size="small"
                color={colors.contrast}
                withOpacity={80}
                font="bold"
                style={styles.label}
              >
                {t("test.yourAnswer")}:
              </Text>
              <Text size="medium" color={colors.contrast} font="bold">
                {answerText}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Кнопка "Показать больше/меньше" */}
      {questions.length > 2 && (
        <View style={styles.expandButtonContainer}>
          <Button
            size="small"
            onPress={() => setIsExpanded(!isExpanded)}
            backgroundColor={theme === "dark" ? colors.accent : colors.primary}
            textColor={theme === "dark" ? colors.primary : colors.white}
          >
            {isExpanded
              ? t("shared.actions.showLess")
              : t("shared.actions.showMore")}
          </Button>
        </View>
      )}
    </View>
  );
};

export default TestQuestionsAnswers;
