import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPlace, Place } from '../api';
import { BackButton, PrimaryButton, Screen, useStyles } from '../ui';
import { useApp, useTheme } from '../store';
import { useToggleFavorite } from '../hooks';
import { formatAddress, useT } from '../i18n';

type Props = { id: string; onBack: () => void };

export default function Details({ id, onBack }: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();
  const { favorites } = useApp();
  const toggleFavorite = useToggleFavorite();
  const [place, setPlace] = useState<Place | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlace(id).then((p) => {
      setPlace(p);
      setLoading(false);
    });
  }, [id]);

  const isFav = favorites.includes(id);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <BackButton onPress={onBack} />
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={28}
          color={isFav ? colors.primary : colors.hint}
          onPress={() => toggleFavorite(id)}
          style={{ marginBottom: 24 }}
        />
      </View>

      {loading && <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />}

      {place && (
        <>
          <View style={styles.detailHero}>
            <Text style={styles.detailEmoji}>{place.emoji}</Text>
          </View>
          <Text style={styles.detailName}>{t(place.name)}</Text>
          <Text style={styles.detailMeta}>
            {t(place.category)} · ⭐ {place.rating.toFixed(1)}
          </Text>
          <Text style={styles.detailDesc}>{t(place.description)}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={22} color={colors.primary} />
            <Text style={styles.infoText}>{formatAddress(place, t)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={22} color={colors.primary} />
            <Text style={styles.infoText}>{place.phone}</Text>
          </View>

          <PrimaryButton
            title={t('Позвонить')}
            onPress={() => Linking.openURL(`tel:${place.phone.replace(/[^\d+]/g, '')}`)}
          />
        </>
      )}
    </Screen>
  );
}
