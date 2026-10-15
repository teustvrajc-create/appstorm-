import { useApp } from './store';
import { useToast } from './toast';
import { useT } from './i18n';
import * as haptics from './haptics';

/** Добавить/убрать из избранного + вибрация + тост */
export function useToggleFavorite() {
  const { favorites, toggleFavorite } = useApp();
  const toast = useToast();
  const t = useT();
  return (id: string) => {
    const wasFav = favorites.includes(id);
    toggleFavorite(id);
    haptics.tap();
    toast(wasFav ? t('Удалено из избранного') : t('Добавлено в избранное'), 'info');
  };
}
