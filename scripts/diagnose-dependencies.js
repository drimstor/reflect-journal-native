#!/usr/bin/env node

/**
 * Диагностический скрипт для анализа зависимостей и конфликтов Material Design
 * Запускается перед EAS Build для логирования состояния проекта
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔍 === ДИАГНОСТИКА ЗАВИСИМОСТЕЙ ===");
console.log(`Время: ${new Date().toISOString()}`);
console.log(`Node.js: ${process.version}`);
console.log(`Платформа: ${process.platform}`);

// Проверяем переменные окружения
console.log("\n📋 ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ:");
console.log(`DIAGNOSTICS_ENABLED: ${process.env.DIAGNOSTICS_ENABLED}`);
console.log(`BUILD_DEBUG: ${process.env.BUILD_DEBUG}`);
console.log(`MATERIAL_CONFLICT_DEBUG: ${process.env.MATERIAL_CONFLICT_DEBUG}`);

// Читаем package.json
console.log("\n📦 АНАЛИЗ PACKAGE.JSON:");
const packagePath = path.join(__dirname, "..", "package.json");
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  console.log(`Версия проекта: ${packageJson.version}`);

  // Проверяем resolutions
  if (packageJson.resolutions) {
    console.log("✅ Resolutions найдены:");
    Object.entries(packageJson.resolutions).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } else {
    console.log("❌ Resolutions НЕ найдены");
  }

  // Проверяем overrides
  if (packageJson.overrides) {
    console.log("✅ Overrides найдены:");
    Object.entries(packageJson.overrides).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } else {
    console.log("❌ Overrides НЕ найдены");
  }

  // Потенциальные источники конфликта
  console.log("\n🎯 ПОТЕНЦИАЛЬНЫЕ ИСТОЧНИКИ КОНФЛИКТА:");
  const suspiciousDeps = [
    "react-native-calendars",
    "react-native-gifted-charts",
    "@gorhom/bottom-sheet",
    "react-native-vis-network",
    "react-native-reanimated",
  ];

  suspiciousDeps.forEach((dep) => {
    const version =
      packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    if (version) {
      console.log(`  ✅ ${dep}: ${version}`);
    } else {
      console.log(`  ❌ ${dep}: НЕ НАЙДЕН`);
    }
  });
} else {
  console.log("❌ package.json не найден");
}

// Проверяем app.json
console.log("\n⚙️ АНАЛИЗ APP.JSON:");
const appJsonPath = path.join(__dirname, "..", "app.json");
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

  // Проверяем expo-build-properties
  const buildPropsPlugin = appJson.expo?.plugins?.find(
    (plugin) => Array.isArray(plugin) && plugin[0] === "expo-build-properties"
  );

  if (buildPropsPlugin) {
    console.log("✅ expo-build-properties найден:");
    console.log(JSON.stringify(buildPropsPlugin[1], null, 2));
  } else {
    console.log("❌ expo-build-properties НЕ найден");
  }
} else {
  console.log("❌ app.json не найден");
}

// Проверяем npm ls для Material Design
console.log("\n🔍 АНАЛИЗ УСТАНОВЛЕННЫХ ПАКЕТОВ:");
try {
  console.log('Поиск пакетов с "material" в названии...');
  const npmLs = execSync("npm ls --depth=0 2>/dev/null || true", {
    encoding: "utf8",
  });
  const materialPackages = npmLs
    .split("\n")
    .filter((line) => line.toLowerCase().includes("material"));

  if (materialPackages.length > 0) {
    console.log("📋 Найденные Material пакеты:");
    materialPackages.forEach((pkg) => console.log(`  ${pkg.trim()}`));
  } else {
    console.log("❌ Material пакеты не найдены в прямых зависимостях");
  }
} catch (error) {
  console.log(`❌ Ошибка при анализе пакетов: ${error.message}`);
}

// Проверяем lock файл
console.log("\n🔒 АНАЛИЗ LOCK ФАЙЛА:");
const lockPath = path.join(__dirname, "..", "package-lock.json");
if (fs.existsSync(lockPath)) {
  try {
    const lockContent = fs.readFileSync(lockPath, "utf8");
    const materialMatches = (lockContent.match(/material/gi) || []).length;
    console.log(`✅ package-lock.json найден`);
    console.log(`📊 Упоминаний "material": ${materialMatches}`);

    // Ищем конкретную версию material-1.12.0
    if (lockContent.includes("material-1.12.0")) {
      console.log("🚨 НАЙДЕН material-1.12.0 в lock файле!");
    } else {
      console.log("✅ material-1.12.0 НЕ найден в lock файле");
    }
  } catch (error) {
    console.log(`❌ Ошибка чтения lock файла: ${error.message}`);
  }
} else {
  console.log("❌ package-lock.json не найден");
}

// Проверяем gradle зависимости в node_modules
console.log("\n🔍 АНАЛИЗ GRADLE ЗАВИСИМОСТЕЙ:");
try {
  const gradleFiles = execSync(
    'find node_modules -name "build.gradle" -path "*/android/*" | head -20',
    { encoding: "utf8" }
  )
    .split("\n")
    .filter(Boolean);

  console.log(`📋 Найдено ${gradleFiles.length} gradle файлов`);

  // Ищем упоминания material в gradle файлах
  gradleFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, "utf8");
      const materialMatches = content.match(
        /material.*[0-9]+\.[0-9]+\.[0-9]+/gi
      );
      if (materialMatches) {
        console.log(`🚨 ${file}:`);
        materialMatches.forEach((match) => console.log(`  - ${match}`));
      }
    } catch (err) {
      // Игнорируем ошибки чтения отдельных файлов
    }
  });
} catch (error) {
  console.log(`❌ Ошибка анализа gradle файлов: ${error.message}`);
}

console.log("\n🎯 === ДИАГНОСТИКА ЗАВЕРШЕНА ===");
console.log("Сохраните эти логи для анализа проблемы!");
