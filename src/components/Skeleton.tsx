import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { useTheme } from '../store';

/** Мигающий серый блок — «скелет» вместо крутилки */
export function Skeleton({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[{ backgroundColor: colors.field, borderRadius: 12, opacity }, style]} />;
}

export function PlaceSkeletonList({ count = 5 }: { count?: number }) {
  const { colors } = useTheme();
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            marginTop: 12,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Skeleton style={{ width: 64, height: 64, borderRadius: 16, marginRight: 14 }} />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton style={{ width: '60%', height: 16 }} />
            <Skeleton style={{ width: '40%', height: 12 }} />
            <Skeleton style={{ width: '80%', height: 12 }} />
          </View>
        </View>
      ))}
    </View>
  );
}
