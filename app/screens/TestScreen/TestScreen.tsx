import { useCreateTestResultMutation, useGetTestQuery } from "@/src/entities";
import { ChatBackground } from "@/src/features";
import { PATHS } from "@/src/shared/const";
import { useT } from "@/src/shared/lib/hooks";
import { StackNavigationProps } from "@/src/shared/model/types";
import {
  useBottomSheetStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  ArrowLeftIcon,
  Button,
  Layout,
  Loader,
  PaddingLayout,
  PlusIcon,
  ProgressBar,
  Text,
} from "@/src/shared/ui";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { ENTITY_NAME } from "../../../src/shared/const/ENTITIES";
import { FormField, Header } from "../../../src/widgets";
import { useTestProgress } from "./lib/hooks/useTestProgress";

const TestScreen = () => {
  const t = useT();
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProps>();
  const { window } = useDeviceStore();
  const { colors, theme } = useThemeStore();
  const { navigateToFlow, setBottomSheetVisible, setFlowData } =
    useBottomSheetStore();

  // Параметры из маршрута
  const { testId } = route.params as { testId: string };

  // API хуки
  const {
    data: test,
    isLoading: isTestLoading,
    error: testError,
  } = useGetTestQuery({ id: testId });
  const [createTestResult, { isLoading: isCreatingTestResult }] =
    useCreateTestResultMutation();

  // Получаем количество вопросов
  const totalQuestions = test?.questions?.length || 0;

  // Хук для работы с прогрессом теста
  const {
    currentQuestionIndex,
    answers,
    isLoaded,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    clearProgress,
    getCurrentAnswer,
    isCurrentAnswerEmpty,
    isFirstQuestion,
    isLastQuestion,
  } = useTestProgress(testId, totalQuestions);

  // Получаем текущий вопрос
  const currentQuestion = test?.questions?.[currentQuestionIndex];
  const progress =
    totalQuestions > 0
      ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
      : 0;

  const title = `${currentQuestionIndex + 1} ${t(
    "shared.info.of"
  )} ${totalQuestions}`;
  const subtitle = currentQuestion?.category;

  // Обработчики
  const handleAnswerChange = (key: string, value: string) => {
    updateAnswer(currentQuestionIndex, value);
  };

  const handleNext = () => {
    // Если пользователь не ввел ответ, показываем подтверждение пропуска
    if (isCurrentAnswerEmpty()) {
      setFlowData({
        onSkip: () => {
          if (isLastQuestion) {
            handleSubmitTest();
          } else {
            goToNextQuestion();
          }
        },
      });
      navigateToFlow("test", "skip");
      requestAnimationFrame(() => {
        setBottomSheetVisible(true);
      });
    } else {
      // Если ответ есть, переходим к следующему вопросу или завершаем тест
      if (isLastQuestion) {
        handleSubmitTest();
      } else {
        goToNextQuestion();
      }
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      if (isCurrentAnswerEmpty()) {
        navigation.goBack();
      } else {
        // Показываем подтверждение выхода из теста
        handleShowExitConfirmation();
      }
    } else {
      goToPreviousQuestion();
    }
  };

  const handleShowExitConfirmation = () => {
    setFlowData({
      onExit: async () => {
        await clearProgress();
        navigation.goBack();
      },
    });
    navigateToFlow("test", "exit");
    requestAnimationFrame(() => {
      setBottomSheetVisible(true);
    });
  };

  // const mockAnswers = {
  //   "1": "Творчество, деньги, технологии",
  //   "10": "Меня бы мотивировало не деградировать. Но всегда бы были новые более глобальные мечты. Я бы наслаждался жизнью в свое удовольствие. Помогал бы людям и благотворительным фондам. Улучшал бы планету и общество ",
  //   "11": "Я всегда стараюсь учиться. Сейчас я работаю в компании, но хотел бы уйти из найма. Поэтому я создаю свое приложение и хочу что бы оно мне дало финансовую независимость. Сейчас мои хобби это смотреть разный контент, например начал смотреть краткие пересказы сериалов, которые я вряд ли бы смотрел полностью. Меня интересуют современные высокие технологии. Учусь в этом направлении в основном сейчас",
  //   "12": "Карьера близка, тело тоже, финансовая составляющая тоже но еще не совсем. Я уже проживаю каждый день как мечтал, единственное что хочется уйти из найма, работать на самого себя и помогать семье. Что бы мама больше не работала и не нуждалась ни в чем",
  //   "13": "Спорт, саморазвитие, самоанализ и рефлексия, иногда созваниваюсь с психологом. Стараюсь оптимизировать все свои процессы, для максимальной эффективности.",
  //   "14": "У меня есть близкий друг, но в последнее время мы не ладим. Очень хорошие отношения с мамой. Есть подруга, но с ней ничего серьезного. Коллеги тоже хорошо относятся как к профессионалу. Есть несколько друзей с которыми поддерживаем связь. Никто не ограничивает, все поддерживают в основном",
  //   "15": "У меня есть навыки в программировании которые мне точно помогут. Есть некоторые связи с ценным опытом в разных сферах. Свободное время тоже есть, работаю всего пару часов в день, остальное время могу тратить на свои проекты. Деньги есть на начальные траты",
  //   "16": "Краткосрочные - запустить свое приложение, в течении 3 месяцев. Долгосрочные - накопить капитал и проинвестировать его. Хотелось бы купить машину и дом.",
  //   "17": "Меня мотивирует прогресс в разных сферах жизни и мысль о том что я могу уйти из найма и работать на себя. И конечно мечтаю о том что бы выйти на пассивный доход и пожить в свое удовольствие и пересмотреть свои цели и жизнь",
  //   "18": "Нетворкинг, эмоциональный интеллект, харизму и общение с людьми",
  //   "19": "Занятие музыкой я откладывал, так как понимаю что для того уровня на котором я бы хотел занимать музыкой я бы очень долго учился и просто выбрал более эффективный путь. Хотя музыка мне нравится в глубине души",
  //   "2": "То что я создаю свой проект",
  //   "20": "Наверное всего понемногу. Мне нравится мысль о том что у меня ничего не было и я достиг чего то. Люблю ставить цели и достигать их и чувствовать удовлетворение после пройденного пути",
  //   "21": "Бывает мысль о том что я не справлюсь с чем то или не смогу один сделать или не смогу конкурировать. Но потом понимаю что все когда то делали что-то в первый раз",
  //   "22": "Если бы у меня было больше денег я бы быстрее двигался к своим целям. Еще не знаю где открыть компанию что бы можно было принимать платежи в приложении и в России и за рубежом",
  //   "23": "Были, мне помогла религия и надежда. Так же меня поддерживала мама",
  //   "24": "Никто на прямую не тормозит. Просто не обращал бы внимание",
  //   "25": "У меня есть перфекционизм и я негодую когда получается что-то не идеально. Но я стараюсь быть к себе менее категоричным. Мне помогает мысль о том что я все равно становлюсь лучше при каждой попытке",
  //   "26": "Программирование, аналитическое мышление, планирование, дисциплина временами. Абстрактное и творческое мышление иногда, когда я придумываю что-то новое",
  //   "27": "Когда я программирую, слушаю музыку, катаюсь на машине или на байке",
  //   "28": "Робототехника, ЛСД",
  //   "29": "Я уже делаю свое приложение и могу сделать много АйТи проектов",
  //   "3": "Робототехникой и искусственным интеллектом ",
  //   "30": "Программирование, так как у него много полезных и интересных применений",
  //   "31": "Половину свободного времени",
  //   "32": "Есть для реализации начальных этапов",
  //   "33": "ИИ что бы быть максимально эффективным",
  //   "34": "Самостоятельно но и конечно перенимать опыт у наставников ",
  //   "35": "Я готов как и раньше делать свое приложение в свободное время",
  //   "36": "Вдохновение, одиночество (так как нет людей которые меня понимают полностью), радость от того что уже достиг",
  //   "37": "Наслаждение и блаженство. Потому что смогу сделать все что пожелаю и дать близким все что им нужно",
  //   "38": "Занимаюсь спортом, веду дневник, встречаюсь с девушкой и общаюсь с людьми",
  //   "39": "Просто декомпозицию задачи и они уже не вызывают такие чувства",
  //   "4": "Когда я создавал что либо или общался с людьми у которых такие же интересы",
  //   "40": "Я бы хотел испытывать спокойствие за будущее и не думать о том что нужно торопиться",
  //   "5": "Без денег, техники и музыки",
  //   "6": "Я бы хотел жить на вилле с бассейном в тропической стране, что бы в ней было много умной техники, я бы создавал роботов и писал программы и создавал продукты которые сделают этот мир лучше",
  //   "7": "Я просыпаюсь, вкусно завтракаю, занимаюсь спортом, боксом, бассейн, потом немного работаю, потом читаю, медитирую, занимаюсь хобби, слушаю музыку, заказываю еду, ложусь спать с девушкой",
  //   "8": "Я бы хотел запустить несколько проектов, которые приносят пользу миру и деньги мне. Что бы у меня был капитал для инвестирования. Построить умный дом. Сделать собственного робота и умного ассистента как джарвис у железного человека",
  //   "9": "Я бы хотел жить в безлюдном месте, но что бы можно было добраться до любого места где есть все необходимое. Что бы были доставки и рестораны со вкусной едой. Что бы можно было кататься на пит байке, водном мотоцикле. ",
  // };

  const handleSubmitTest = async () => {
    if (!test) return;

    try {
      // Передаем объект ответов с индексами как ключами
      await createTestResult({
        test_id: test.id,
        answers,
      })
        .unwrap()
        .then((res) => {
          // Переход к результату
          navigation.replace(PATHS.LIBRARY_ITEM, {
            variant: ENTITY_NAME.TEST_RESULTS,
            item: res,
          });
        });

      // Очищаем прогресс после успешной отправки
      await clearProgress();
    } catch (error) {
      Alert.alert(t("shared.error.title"), t("test.submitError"));
    }
  };

  const currentAnswer = getCurrentAnswer();
  const isLoading = isTestLoading || !isLoaded;

  const [isLoadingTestResult, setIsLoadingTestResult] = useState(false);

  useEffect(() => {
    if (isCreatingTestResult) {
      setTimeout(() => {
        setIsLoadingTestResult(isCreatingTestResult);
      }, 3000);
    }
  }, [isCreatingTestResult]);

  return (
    <Layout style={{ flex: 1 }}>
      <ChatBackground />
      {!isLoadingTestResult && (
        <Header
          title={isLoading ? "" : title}
          subtitle={isLoading ? "" : subtitle}
          leftIcon={{
            icon: <ArrowLeftIcon color={colors.contrast} size={26} />,
            onPress: handlePrevious,
          }}
          rightIcon={{
            icon: (
              <View style={{ transform: [{ rotate: "45deg" }] }}>
                <PlusIcon color={colors.contrast} size={26} />
              </View>
            ),
            onPress: handleShowExitConfirmation,
          }}
        />
      )}
      {isLoadingTestResult || isLoading ? (
        <Loader
          style={{ marginTop: window.height / 5 }}
          size={window.width - 80}
        />
      ) : (
        <>
          <PaddingLayout style={{ marginHorizontal: 65, marginTop: -2 }}>
            <ProgressBar progress={progress} />
          </PaddingLayout>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <PaddingLayout
                style={{
                  marginTop: 30,
                  minHeight: window.height - 200,
                }}
              >
                <Text
                  size="medium"
                  color={colors.contrast}
                  style={{ marginBottom: 6 }}
                >
                  {t("test.question")}:
                </Text>

                <Text color={colors.contrast} size="extraLarge">
                  {currentQuestion?.question}
                </Text>

                <View style={{ marginTop: 30, flex: 1 }}>
                  {/* Поле для ввода ответа */}
                  <FormField
                    value={currentAnswer || ""}
                    onChange={handleAnswerChange}
                    field={{
                      key: "value",
                      type: "textarea",
                      label: `${t("test.yourAnswer")}:`,
                      placeholder: t("test.enterAnswer"),
                    }}
                  />
                </View>

                <View style={{ marginTop: "auto", gap: 10 }}>
                  {!isFirstQuestion && (
                    <Button
                      backgroundColor={colors.alternate}
                      onPress={handlePrevious}
                    >
                      {t("shared.actions.previous")}
                    </Button>
                  )}

                  <Button
                    backgroundColor={
                      theme === "dark" ? colors.accent : colors.primary
                    }
                    textColor={theme === "dark" ? colors.primary : colors.white}
                    onPress={handleNext}
                    isLoading={isCreatingTestResult}
                  >
                    {isLastQuestion
                      ? t("test.submit")
                      : t("shared.actions.next")}
                  </Button>
                </View>
              </PaddingLayout>
            </View>
          </TouchableWithoutFeedback>
        </>
      )}
    </Layout>
  );
};

export default TestScreen;
