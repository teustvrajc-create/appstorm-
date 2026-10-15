import React, { useRef, useState } from 'react';
import { FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LanguageSwitch, PrimaryButton, useStyles } from '../ui';
import { useApp, useTheme } from '../store';
import { useT } from '../i18n';

const SLIDES = [
  { emoji: '🍽️', title: 'Найдите, где поесть', text: 'Кафе, рестораны и чайханы вашего города в одном приложении.' },
  { emoji: '💜', title: 'Сохраняйте любимое', text: 'Добавляйте заведения в избранное, чтобы не потерять их.' },
  { emoji: '🌙', title: 'Удобно в любое время', text: 'Светлая и тёмная темы, русский и казахский языки.' },
];

export default function Onboarding() {
  const styles = useStyles();
  const t = useT();
  const { colors, isDark } = useTheme();
  const { finishOnboarding } = useApp();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const last = index === SLIDES.length - 1;

  const next = () => {
    if (last) finishOnboarding();
    else listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={{ paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={finishOnboarding} hitSlop={10}>
          <Text style={styles.linkText}>{t('Пропустить')}</Text>
        </Pressable>
        <LanguageSwitch />
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' }}>
            <View style={[styles.detailHero, { width: 220, height: 220, borderRadius: 110 }]}>
              <Text style={{ fontSize: 100 }}>{item.emoji}</Text>
            </View>
            <Text style={[styles.centerTitle, { marginTop: 40 }]}>{t(item.title)}</Text>
            <Text style={styles.centerSubtitle}>{t(item.text)}</Text>
          </View>
        )}
      />

      <View style={{ paddingHorizontal: 28, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
        <PrimaryButton title={last ? t('Начать') : t('Далее')} onPress={next} />
      </View>
    </SafeAreaView>
  );
}
