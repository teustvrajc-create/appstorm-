import * as Haptics from 'expo-haptics';

// Обёртки: вибрация не должна ронять приложение, если её нет на устройстве
export const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
export const success = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
export const error = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
