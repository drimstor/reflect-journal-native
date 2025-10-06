import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Конфигурация элемента таб-бара
interface TabBarItemConfig {
  isActive: boolean; // активен ли элемент
  lastVisitDate?: string; // дата последнего посещения в формате "YYYY-MM-DD"
  activationType: "daily" | "manual"; // тип активации
}

// Тип для хранения конфигураций элементов
type TabBarItems = Record<string, TabBarItemConfig>;

interface TabBarStore {
  // Существующие поля для анимации
  tabBar: number;
  setTabBar: (value: number) => void;

  // Новая структура для активных элементов
  items: TabBarItems;

  // Методы управления активными элементами
  activateItem: (path: string, type?: "daily" | "manual") => void;
  deactivateItem: (path: string) => void;
  checkDailyActivation: () => void;
  isItemActive: (path: string) => boolean;

  // Устаревшие методы для совместимости (будут удалены позже)
  tabBarActiveItems: string[];
  setTabBarActiveItems: (value: string[]) => void;
}

// Получить текущую дату в формате "YYYY-MM-DD"
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const useTabBarStore = create<TabBarStore>()(
  persist<TabBarStore>(
    (set, get) => ({
      // Существующие поля
      tabBar: 0,
      setTabBar: (value) => set({ tabBar: value }),

      // Новая структура
      items: {},

      // Активировать элемент
      activateItem: (path, type = "manual") =>
        set((state) => ({
          items: {
            ...state.items,
            [path]: {
              isActive: true,
              activationType: type,
              lastVisitDate:
                type === "daily" ? undefined : state.items[path]?.lastVisitDate,
            },
          },
        })),

      // Деактивировать элемент
      deactivateItem: (path) =>
        set((state) => {
          const item = state.items[path];
          if (!item) return state;

          // Для daily элементов обновляем lastVisitDate
          if (item.activationType === "daily") {
            return {
              items: {
                ...state.items,
                [path]: {
                  ...item,
                  isActive: false,
                  lastVisitDate: getTodayDate(),
                },
              },
            };
          }

          // Для manual элементов просто деактивируем
          return {
            items: {
              ...state.items,
              [path]: {
                ...item,
                isActive: false,
              },
            },
          };
        }),

      // Проверить и активировать ежедневные элементы
      checkDailyActivation: () =>
        set((state) => {
          const today = getTodayDate();
          const updatedItems = { ...state.items };
          let hasChanges = false;

          Object.entries(updatedItems).forEach(([path, config]) => {
            if (config.activationType === "daily") {
              // Если нет даты или дата меньше сегодняшней - активируем
              if (!config.lastVisitDate || config.lastVisitDate < today) {
                updatedItems[path] = {
                  ...config,
                  isActive: true,
                };
                hasChanges = true;
              }
            }
          });

          return hasChanges ? { items: updatedItems } : state;
        }),

      // Проверить, активен ли элемент
      isItemActive: (path) => {
        return get().items[path]?.isActive || false;
      },

      // Устаревшие методы для совместимости
      tabBarActiveItems: [],
      setTabBarActiveItems: (value) => set({ tabBarActiveItems: value }),
    }),
    {
      name: "tab-bar-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items } as TabBarStore),
    }
  )
);
