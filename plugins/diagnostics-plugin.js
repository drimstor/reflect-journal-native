const {
  withAndroidManifest,
  withGradleProperties,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Кастомный Expo Config Plugin для диагностики и решения конфликтов Material Design
 */
function withDiagnosticsPlugin(config) {
  console.log("🔧 === ЗАПУСК DIAGNOSTICS PLUGIN ===");

  // Логируем состояние конфигурации
  console.log("📋 Текущая конфигурация Expo:");
  console.log(`- Name: ${config.name}`);
  console.log(`- Version: ${config.version}`);
  console.log(`- SDK Version: ${config.sdkVersion}`);

  // Проверяем переменные окружения
  if (process.env.MATERIAL_CONFLICT_DEBUG === "true") {
    console.log("🚨 MATERIAL_CONFLICT_DEBUG включен");

    // Добавляем диагностические gradle properties
    config = withGradleProperties(config, (config) => {
      console.log("📝 Добавляем диагностические gradle properties...");

      const diagnosticProperties = [
        // Включаем детальное логирование
        { type: "property", key: "org.gradle.logging.level", value: "info" },
        { type: "property", key: "org.gradle.debug", value: "true" },

        // Настройки для решения конфликтов
        {
          type: "property",
          key: "android.enableResourceOptimizations",
          value: "false",
        },
        { type: "property", key: "android.enableJetifier", value: "true" },
        { type: "property", key: "android.useAndroidX", value: "true" },

        // Дополнительные настройки для диагностики
        {
          type: "property",
          key: "org.gradle.configureondemand",
          value: "false",
        },
        { type: "property", key: "org.gradle.parallel", value: "false" },

        // Увеличиваем память для сборки
        {
          type: "property",
          key: "org.gradle.jvmargs",
          value: "-Xmx4096m -XX:MaxMetaspaceSize=1024m",
        },
      ];

      // Добавляем каждое свойство
      diagnosticProperties.forEach((prop) => {
        config.modResults.push(prop);
        console.log(`  ✅ Добавлено: ${prop.key} = ${prop.value}`);
      });

      return config;
    });
  }

  // Создаем диагностический файл
  config = withAndroidManifest(config, async (config) => {
    if (process.env.DIAGNOSTICS_ENABLED === "true") {
      console.log("📊 Создаем диагностический отчет...");

      const diagnosticsReport = {
        timestamp: new Date().toISOString(),
        pluginExecuted: true,
        environment: {
          DIAGNOSTICS_ENABLED: process.env.DIAGNOSTICS_ENABLED,
          BUILD_DEBUG: process.env.BUILD_DEBUG,
          MATERIAL_CONFLICT_DEBUG: process.env.MATERIAL_CONFLICT_DEBUG,
          NODE_ENV: process.env.NODE_ENV,
        },
        config: {
          name: config.name,
          version: config.version,
          sdkVersion: config.sdkVersion,
        },
        plugins:
          config.plugins?.map((plugin) =>
            typeof plugin === "string" ? plugin : plugin[0]
          ) || [],
      };

      // Сохраняем отчет в android папку
      const androidDir = path.join(process.cwd(), "android");
      if (fs.existsSync(androidDir)) {
        const reportPath = path.join(androidDir, "diagnostics-report.json");
        fs.writeFileSync(
          reportPath,
          JSON.stringify(diagnosticsReport, null, 2)
        );
        console.log(`✅ Диагностический отчет сохранен: ${reportPath}`);
      }
    }

    return config;
  });

  console.log("✅ === DIAGNOSTICS PLUGIN ЗАВЕРШЕН ===");
  return config;
}

module.exports = withDiagnosticsPlugin;
