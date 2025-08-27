# Настройка голосовой записи

## iOS настройка

### 1. Добавьте разрешения в Info.plist:
```xml
<key>NSSpeechRecognitionUsageDescription</key>
<string>Приложению требуется доступ к распознаванию речи для преобразования голоса в текст</string>
<key>NSMicrophoneUsageDescription</key>
<string>Приложению требуется доступ к микрофону для записи голосовых сообщений</string>
```

### 2. Выполните pod install:
```bash
cd ios && pod install
```

## Android настройка

### 1. Добавьте разрешения в AndroidManifest.xml:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 2. Для Android 6.0+ необходимо запросить разрешения во время выполнения.

## Expo настройка (если используется)

### 1. Добавьте в app.json или app.config.js:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSSpeechRecognitionUsageDescription": "Приложению требуется доступ к распознаванию речи для преобразования голоса в текст",
        "NSMicrophoneUsageDescription": "Приложению требуется доступ к микрофону для записи голосовых сообщений"
      }
    },
    "android": {
      "permissions": ["RECORD_AUDIO"]
    },
    "plugins": [
      "@react-native-voice/voice"
    ]
  }
}
```

### 2. Для Expo managed workflow может потребоваться:
```bash
expo install expo-av
```

## Проверка работы

1. Запустите приложение
2. Откройте чат
3. Нажмите на кнопку прикрепления файлов
4. Нажмите на иконку микрофона
5. Должен появиться блок управления записью снизу
6. Говорите на русском языке
7. Нажмите стоп - в консоли появится распознанный текст

## Возможные проблемы

1. **iOS Simulator**: Распознавание речи может не работать в симуляторе. Тестируйте на реальном устройстве.

2. **Android**: Убедитесь, что у приложения есть разрешение на использование микрофона в настройках устройства.

3. **Язык распознавания**: В коде установлен русский язык (ru-RU). Для изменения языка отредактируйте строки в useVoiceRecording.ts:
   ```typescript
   await Voice.start('en-US'); // Для английского
   ```

4. **Ошибка "No speech input"**: Убедитесь, что устройство подключено к интернету для онлайн распознавания речи.
