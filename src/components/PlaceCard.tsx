import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '../api';
import { useStyles } from '../ui';
import { useTheme } from '../store';
import { formatAddress, useT } from '../i18n';

type Props = {
  place: Place;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export default function PlaceCard({ place, favorite, onPress, onToggleFavorite }: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();

  // появление карточки
  const appear = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(appear, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [appear]);

  // «прыжок» сердечка
  const scale = useRef(new Animated.Value(1)).current;
  const pressHeart = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onToggleFavorite();
  };

  return (
    <Animated.View
      style={{
        opacity: appear,
        transform: [{ translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
      }}
    >
      <Pressable style={styles.card} onPress={onPress}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardEmoji}>{place.emoji}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{t(place.name)}</Text>
          <Text style={styles.cardMeta}>
            {t(place.category)} · ⭐ {place.rating.toFixed(1)}
          </Text>
          <Text style={styles.cardAddr} numberOfLines={1}>
            {formatAddress(place, t)}
          </Text>
        </View>
        <Pressable onPress={pressHeart} hitSlop={12}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={favorite ? colors.primary : colors.hint}
            />
          </Animated.View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
