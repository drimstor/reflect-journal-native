import { useT } from "@/src/shared/lib/hooks";
import { useNotificationInit } from "@/src/shared/lib/hooks/useNotificationInit";
import { useThemeStore } from "@/src/shared/store";
import {
  AnimatedAppearance,
  Chip,
  Loader,
  MenuList,
  Toggle,
} from "@/src/shared/ui";
import { memo, useCallback, useMemo } from "react";
import { createNotificationMenuItems } from "./const/notificationsConfig";

const NotificationsView = () => {
  const t = useT();
  const { colors } = useThemeStore();

  // Используем хук для работы с настройками уведомлений
  const { settings, isLoading, isSaving, updateSetting, isSettingEnabled } =
    useNotificationInit();

  // Создаем конфигурацию пунктов меню
  const notificationMenuItems = useMemo(
    () => createNotificationMenuItems(),
    []
  );

  // Мемоизированные обработчики для предотвращения лишних ререндеров
  const handlePushNotificationToggle = useCallback(
    () => updateSetting("pushNotifications", !settings?.pushNotifications),
    [updateSetting, settings?.pushNotifications]
  );

  const handlePushNotificationChange = useCallback(
    (value: boolean) => updateSetting("pushNotifications", value),
    [updateSetting]
  );

  // Первый блок - главный переключатель Push-уведомлений
  const pushNotificationSettings = useMemo(
    () => [
      {
        text: t("notifications.settings.pushNotifications"),
        onPress: handlePushNotificationToggle,
        element: (
          <Toggle
            size="small"
            label={t("notifications.settings.pushNotifications")}
            value={settings?.pushNotifications}
            onValueChange={handlePushNotificationChange}
            disabled={isSaving}
            style={{ container: { marginRight: -6, marginVertical: -4 } }}
          />
        ),
      },
    ],
    [
      t,
      handlePushNotificationToggle,
      handlePushNotificationChange,
      settings?.pushNotifications,
      isSaving,
    ]
  );

  // Второй блок - регулярные уведомления
  const regularNotificationSettings = useMemo(
    () =>
      notificationMenuItems.map((item) => {
        const handleToggle = () => updateSetting(item.key, !settings[item.key]);
        const handleChange = (value: boolean) => updateSetting(item.key, value);
        const isEnabled = isSettingEnabled(item.key);

        return {
          text: t(item.translationKey),
          onPress: item.isComingSoon || !isEnabled ? undefined : handleToggle,
          isDisabled: !isEnabled,
          element: item.isComingSoon ? (
            <Chip
              title={t("shared.info.soon")}
              color={colors.accent}
              style={{ marginRight: -6, marginVertical: -2 }}
            />
          ) : (
            <Toggle
              size="small"
              style={{ container: { marginRight: -10, marginVertical: -4 } }}
              label={t(item.translationKey)}
              value={settings[item.key]}
              onValueChange={handleChange}
              disabled={isSaving || !isEnabled}
            />
          ),
        };
      }),
    [
      notificationMenuItems,
      t,
      updateSetting,
      settings,
      isSettingEnabled,
      isSaving,
      colors.accent,
    ]
  );

  if (isLoading) {
    return (
      <AnimatedAppearance isInitialVisible>
        <Loader style={{ paddingTop: 100 }} />
      </AnimatedAppearance>
    );
  }

  return (
    <>
      {/* Первый блок - Push-уведомления */}
      <MenuList
        title={t("notifications.settings.pushNotifications")}
        style={{ marginBottom: 20 }}
        items={pushNotificationSettings}
      />
      {/* Второй блок - Регулярные уведомления */}
      <MenuList
        title={t("notifications.settings.regularNotifications")}
        items={regularNotificationSettings}
      />
    </>
  );
};

export default memo(NotificationsView);
