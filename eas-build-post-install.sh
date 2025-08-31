#!/bin/bash

# EAS Build Hook: Модификация build.gradle после prebuild
echo "🔧 Модифицируем build.gradle для принудительной версии Material Design..."

BUILD_GRADLE_PATH="android/app/build.gradle"

if [ -f "$BUILD_GRADLE_PATH" ]; then
    # Добавляем configurations.all блок в конец файла
    cat >> "$BUILD_GRADLE_PATH" << 'EOF'

configurations.all {
    resolutionStrategy {
        // Исключаем старые support библиотеки
        exclude group: 'com.android.support'
        // Принудительно используем старую версию Material Design
        force 'com.google.android.material:material:1.8.0'
    }
}
EOF
    echo "✅ build.gradle модифицирован успешно"
else
    echo "❌ Файл $BUILD_GRADLE_PATH не найден"
    exit 1
fi
