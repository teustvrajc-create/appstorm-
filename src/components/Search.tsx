import React, { useEffect, useState } from 'react';
import { useT } from '../i18n';
import { FlatList, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPlaces, Place } from '../api';
import { EmptyState, TabScreen, useStyles } from '../ui';
import { useApp, useTheme } from '../store';
import PlaceCard from './PlaceCard';
import { useToggleFavorite } from '../hooks';

type Props = { onOpenPlace: (id: string) => void };

export default function Search({ onOpenPlace }: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();
  const { user, favorites } = useApp();
  const toggleFavorite = useToggleFavorite();
  const [places, setPlaces] = useState<Place[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (user) fetchPlaces(user.city).then(setPlaces);
  }, [user?.city]);

  const q = query.trim().toLowerCase();
  const results = q
    ? places.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    : [];

  return (
    <TabScreen>
      <Text style={styles.tabTitle}>{t('Поиск')}</Text>
      <Text style={styles.tabSubtitle}>{t('Название или категория')}</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.hint} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('Например: кофе')}
          placeholderTextColor={colors.hint}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          q ? (
            <EmptyState emoji="🔍" title={t('Ничего не найдено')} text={t('Попробуйте другой запрос')} />
          ) : (
            <EmptyState emoji="✨" title={t('Начните вводить')} text={t('Результаты появятся по мере ввода')} />
          )
        }
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            favorite={favorites.includes(item.id)}
            onPress={() => onOpenPlace(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </TabScreen>
  );
}
