import React, { useState } from 'react';
import { useT } from '../i18n';
import { LayoutAnimation, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton, PrimaryButton, Screen, useStyles } from '../ui';
import { useTheme } from '../store';
import { CITIES } from '../api';

type Props = {
  onBack: () => void;
  onContinue: (city: string) => void;
  initialCity?: string;
  buttonTitle?: string;
};

export default function SelectCity({
  onBack,
  onContinue,
  initialCity = '',
  buttonTitle = 'Продолжить',
}: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(initialCity);

  return (
    <Screen>
      <BackButton onPress={onBack} />

      <Text style={styles.title}>{t('Выберите город')}</Text>
      <Text style={styles.subtitle}>
        {t('Заведения которые будут показываться вам, будут зависеть от вашего города.')}
      </Text>

      <Pressable style={styles.select} onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen(!open);
        }}>
        <Text style={city ? styles.selectText : styles.selectPlaceholder}>
          {city || t('Выбрать город')}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          {CITIES.map((c) => (
            <Pressable
              key={c}
              style={styles.option}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setCity(c);
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{c}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.bottomArea}>
        <PrimaryButton title={t(buttonTitle)} onPress={() => onContinue(city)} disabled={!city} />
      </View>
    </Screen>
  );
}
