import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { AnimatedDynamicWrapper } from "./AnimatedDynamicWrapper";
import { useDynamicImport } from "./useDynamicImport";

// Пример компонента для динамического импорта
const ExampleDynamicComponent = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => (
  <View style={{ padding: 20, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
    <Text style={{ fontSize: 18, marginBottom: 10 }}>{title}</Text>
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: "#007AFF", padding: 10, borderRadius: 5 }}
    >
      <Text style={{ color: "white", textAlign: "center" }}>Нажми меня</Text>
    </TouchableOpacity>
  </View>
);

// Компонент ошибки
const ErrorComponent = ({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) => (
  <View style={{ padding: 20, backgroundColor: "#ffebee", borderRadius: 10 }}>
    <Text style={{ color: "#c62828", marginBottom: 10 }}>
      Ошибка загрузки: {error.message}
    </Text>
    <TouchableOpacity
      onPress={retry}
      style={{ backgroundColor: "#c62828", padding: 10, borderRadius: 5 }}
    >
      <Text style={{ color: "white", textAlign: "center" }}>Повторить</Text>
    </TouchableOpacity>
  </View>
);

// Пример использования хука
export const ExampleUsage = () => {
  // Инициализация хука с динамическим импортом
  const dynamicImport = useDynamicImport({
    importFn: () => Promise.resolve({ default: ExampleDynamicComponent }),
    animationConfig: {
      duration: 500,
      delay: 200,
      targetOpacity: 1,
    },
    autoStart: false, // Не начинаем импорт автоматически
    autoShow: true, // Показываем автоматически после загрузки
  });

  const handleShowComponent = () => {
    dynamicImport.show(); // Начнет импорт и покажет компонент
  };

  const handleHideComponent = () => {
    dynamicImport.hide(); // Скроет компонент с анимацией
  };

  const handleReset = () => {
    dynamicImport.reset(); // Сбросит состояние
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Пример динамического импорта
      </Text>

      {/* Кнопки управления */}
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
          onPress={handleShowComponent}
          style={{
            backgroundColor: "#4CAF50",
            padding: 15,
            borderRadius: 5,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Показать компонент
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleHideComponent}
          style={{
            backgroundColor: "#FF9800",
            padding: 15,
            borderRadius: 5,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Скрыть компонент
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReset}
          style={{ backgroundColor: "#f44336", padding: 15, borderRadius: 5 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Сбросить</Text>
        </TouchableOpacity>
      </View>

      {/* Информация о состоянии */}
      <View
        style={{
          marginBottom: 20,
          padding: 10,
          backgroundColor: "#e3f2fd",
          borderRadius: 5,
        }}
      >
        <Text>
          Состояние импорта:{" "}
          {dynamicImport.isStartImport ? "Начат" : "Не начат"}
        </Text>
        <Text>Загрузка: {dynamicImport.isLoading ? "Да" : "Нет"}</Text>
        <Text>Видимость: {dynamicImport.isVisible ? "Видим" : "Скрыт"}</Text>
        <Text>
          Компонент загружен: {dynamicImport.Component ? "Да" : "Нет"}
        </Text>
      </View>

      {/* Динамически импортируемый компонент */}
      {dynamicImport.isStartImport && (
        <AnimatedDynamicWrapper
          dynamicImport={dynamicImport}
          componentProps={{
            title: "Динамически загруженный компонент!",
            onPress: () => Alert.alert("Успех", "Компонент работает!"),
          }}
          errorComponent={ErrorComponent}
          fallback={<Text>Загрузка компонента...</Text>}
        />
      )}
    </View>
  );
};

// Пример с автоматическим стартом
export const ExampleAutoStart = () => {
  const dynamicImport = useDynamicImport({
    importFn: () => Promise.resolve({ default: ExampleDynamicComponent }),
    autoStart: true, // Начинаем импорт сразу
    autoShow: true, // Показываем автоматически
  });

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Автоматический импорт
      </Text>

      <AnimatedDynamicWrapper
        dynamicImport={dynamicImport}
        componentProps={{
          title: "Автоматически загруженный компонент",
          onPress: () => dynamicImport.hide(),
        }}
        errorComponent={ErrorComponent}
      />
    </View>
  );
};

// Пример с реальным динамическим импортом (раскомментируйте для использования)
/*
export const ExampleRealImport = () => {
  const dynamicImport = useDynamicImport({
    importFn: () => import('./SomeHeavyComponent'), // Реальный динамический импорт
    animationConfig: {
      duration: 300,
      delay: 100,
    },
  });

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={dynamicImport.show}>
        <Text>Загрузить тяжелый компонент</Text>
      </TouchableOpacity>
      
      <AnimatedDynamicWrapper
        dynamicImport={dynamicImport}
        errorComponent={ErrorComponent}
      />
    </View>
  );
};
*/
