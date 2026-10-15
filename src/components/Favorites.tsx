import React, { useEffect, useState } from 'react';
import { useT } from '../i18n';
import { FlatList, Text } from 'react-native';
import { fetchPlacesByIds, Place } from '../api';
import { EmptyState, TabScreen, useStyles } from '../ui';
import { useApp } from '../store';
import PlaceCard from './PlaceCard';
import { PlaceSkeletonList } from './Skeleton';
import { useToggleFavorite } from '../hooks';

type Props = { onOpenPlace: (id: string) => void };

export default function Favorites({ onOpenPlace }: Props) {
  const styles = useStyles();
  const t = useT();
  const { favorites } = useApp();
  const toggleFavorite = useToggleFavorite();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacesByIds(favorites).then((list) => {
      setPlaces(list);
      setLoading(false);
    });
  }, [favorites]);

  return (
    <TabScreen>
      <Text style={styles.tabTitle}>{t('Избранное')}</Text>
      <Text style={styles.tabSubtitle}>{t('Ваши любимые заведения')}</Text>

      {loading ? (
        <PlaceSkeletonList count={3} />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(p) => p.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState emoji="💜" title={t('Пока ничего нет')} text={t('Нажмите на сердечко у заведения, чтобы добавить его сюда')} />}
          renderItem={({ item }) => (
            <PlaceCard place={item} favorite onPress={() => onOpenPlace(item.id)} onToggleFavorite={() => toggleFavorite(item.id)} />
          )}
        />
      )}
    </TabScreen>
  );
}
