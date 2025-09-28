const ReactCompilerConfig = {
  // Включить компилятор для всех файлов
  sources: (filename) => {
    return filename.indexOf("node_modules") === -1;
  },

  // Настройки оптимизации
  compilationMode: "annotation", // 'annotation' | 'infer' | 'all'

  // Исключения (если нужно отключить для конкретных компонентов)
  // eslintSuppressionRules: ['react-hooks/exhaustive-deps'],

  // Дополнительные настройки
  enableTreatRefLikeIdentifierAsRef: true,
  enableTreatFunctionDepsAsConditional: true,
};

module.exports = ReactCompilerConfig;
