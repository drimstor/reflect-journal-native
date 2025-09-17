const {
  withProjectBuildGradle,
  withAppBuildGradle,
} = require("@expo/config-plugins");

/**
 * Config Plugin для решения конфликта Material Design на уровне Gradle
 * Принудительно устанавливает одну версию Material Design для всех зависимостей
 */
function withMaterialConflictResolver(config) {
  console.log("🔧 === MATERIAL CONFLICT RESOLVER ===");

  // Модифицируем project-level build.gradle
  config = withProjectBuildGradle(config, (config) => {
    console.log(
      "📝 Добавляем gradle resolutionStrategy в project build.gradle..."
    );

    const buildGradle = config.modResults.contents;

    // Добавляем resolutionStrategy в allprojects блок
    const resolutionStrategy = `
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url "https://www.jitpack.io" }
    }
    
    // РЕШЕНИЕ КОНФЛИКТА MATERIAL DESIGN
    configurations.all {
        resolutionStrategy {
            // Принудительно используем одну версию Material Design
            force 'com.google.android.material:material:1.11.0'
            
            // Логируем конфликты
            eachDependency { DependencyResolveDetails details ->
                if (details.requested.group == 'com.google.android.material' && details.requested.name == 'material') {
                    println "🔄 MATERIAL CONFLICT RESOLVER: \${details.requested.version} -> 1.11.0"
                    details.useVersion '1.11.0'
                    details.because 'Resolve Material Design version conflict'
                }
            }
        }
    }
}`;

    // Заменяем существующий allprojects блок или добавляем новый
    if (buildGradle.includes("allprojects {")) {
      // Заменяем существующий блок
      const updatedBuildGradle = buildGradle.replace(
        /allprojects\s*\{[^}]*\}/s,
        resolutionStrategy.trim()
      );
      config.modResults.contents = updatedBuildGradle;
    } else {
      // Добавляем новый блок в конец
      config.modResults.contents = buildGradle + "\n\n" + resolutionStrategy;
    }

    console.log("✅ Gradle resolutionStrategy добавлен");
    return config;
  });

  // Модифицируем app-level build.gradle для дополнительных настроек
  config = withAppBuildGradle(config, (config) => {
    console.log("📝 Добавляем дополнительные настройки в app build.gradle...");

    const buildGradle = config.modResults.contents;

    // Добавляем configurations блок для исключения конфликтующих зависимостей
    const configurationsBlock = `
// ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ ДЛЯ РЕШЕНИЯ КОНФЛИКТОВ
configurations {
    all {
        exclude group: 'com.google.android.material', module: 'material', version: '1.12.0'
        
        resolutionStrategy {
            force 'com.google.android.material:material:1.11.0'
        }
    }
}`;

    // Добавляем блок перед dependencies
    if (buildGradle.includes("dependencies {")) {
      const updatedBuildGradle = buildGradle.replace(
        "dependencies {",
        configurationsBlock + "\n\ndependencies {"
      );
      config.modResults.contents = updatedBuildGradle;
    } else {
      config.modResults.contents = buildGradle + "\n\n" + configurationsBlock;
    }

    console.log("✅ App-level конфигурация добавлена");
    return config;
  });

  console.log("✅ === MATERIAL CONFLICT RESOLVER ЗАВЕРШЕН ===");
  return config;
}

module.exports = withMaterialConflictResolver;
