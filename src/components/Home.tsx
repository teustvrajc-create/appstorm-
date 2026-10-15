import React, { useCallback, useEffect, useState } from 'react';
import { useT } from '../i18n';
import { FlatList, Pressable, RefreshControl, ScrollView, Text } from 'react-native';
import { CATEGORIES, fetchPlaces, Place } from '../api';
import { EmptyState, TabScreen, useStyles } from '../ui';
import { useApp, useTheme } from '../store';
import PlaceCard from './PlaceCard';
import { PlaceSkeletonList } from './Skeleton';
import { useToggleFavorite } from '../hooks';

type Props = { onOpenPlace: (id: string) => void };

export default function Home({ onOpenPlace }: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();
  const { user, favorites } = useApp();
  const toggleFavorite = useToggleFavorite();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState(t('Все'));

  const load = useCallback(async () => {
    if (!user) return;
    setPlaces(await fetchPlaces(user.city));
    setLoading(false);
  }, [user?.city]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const shown = category === t('Все') ? places : places.filter((p) => p.category === category);

  return (
    <TabScreen>
      <Text style={styles.tabTitle}>{t('Привет,')} {user?.name}! 👋</Text>
      <Text style={styles.tabSubtitle}>📍 {user?.city}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow} style={{ flexGrow: 0 }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} style={[styles.chip, c === category && styles.chipOn]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, c === category && styles.chipTextOn]}>{t(c)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <PlaceSkeletonList />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(p) => p.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          ListEmptyComponent={<EmptyState emoji="🍽️" title={t('Пока пусто')} text={t('В этой категории нет заведений')} />}
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              favorite={favorites.includes(item.id)}
              onPress={() => onOpenPlace(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
    </TabScreen>
  );
}
