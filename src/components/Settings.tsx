import React, { useState } from 'react';
import { useT } from '../i18n';
import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton, Field, LanguageSwitch, PrimaryButton, Screen, useStyles } from '../ui';
import { ThemeMode, useApp, useTheme } from '../store';
import { passwordProblem } from '../utils';
import { useToast } from '../toast';
import * as haptics from '../haptics';

type Props = { onBack: () => void; onChangeCity: () => void };

const MODES: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: 'Системная' },
  { key: 'light', label: 'Светлая' },
  { key: 'dark', label: 'Тёмная' },
];

export default function Settings({ onBack, onChangeCity }: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();
  const toast = useToast();
  const { user, themeMode, setThemeMode, notifications, setNotifications, changePassword, updateName } = useApp();

  const [name, setName] = useState(user?.name ?? '');
  const [nameErr, setNameErr] = useState('');
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const [errors, setErrors] = useState({ old: '', next: '' });

  const saveName = () => {
    if (name.trim().length < 2) {
      haptics.error();
      return setNameErr(t('Введите имя'));
    }
    setNameErr('');
    updateName(name.trim());
    haptics.success();
    toast(t('Имя сохранено'), 'success');
  };

  const submit = () => {
    const next = passwordProblem(newP) ?? '';
    const old = !next ? changePassword(oldP, newP) ?? '' : '';
    setErrors({ old, next });
    if (next || old) return haptics.error();
    setOldP('');
    setNewP('');
    haptics.success();
    toast(t('Пароль успешно изменён'), 'success');
  };

  return (
    <Screen>
      <BackButton onPress={onBack} />
      <Text style={styles.title}>{t('Настройки')}</Text>

      <Text style={styles.sectionTitle}>{t('Язык')}</Text>
      <View style={{ marginTop: 12, alignItems: 'flex-start' }}>
        <LanguageSwitch />
      </View>

      <View style={styles.group}>
        <Pressable style={styles.row} onPress={onChangeCity}>
          <View style={styles.rowLeft}>
            <Ionicons name="location" size={22} color={colors.primary} />
            <Text style={styles.rowText}>{t('Город')}</Text>
          </View>
          <Text style={styles.rowValue}>{user?.city}  ›</Text>
        </Pressable>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications" size={22} color={colors.primary} />
            <Text style={styles.rowText}>{t('Уведомления')}</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.primary }} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>{t('Тема')}</Text>
      <View style={styles.segmented}>
        {MODES.map((m) => (
          <Pressable key={m.key} style={[styles.segItem, themeMode === m.key && styles.segItemOn]} onPress={() => setThemeMode(m.key)}>
            <Text style={[styles.segText, themeMode === m.key && styles.segTextOn]}>{t(m.label)}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('Профиль')}</Text>
      <Field icon="person" placeholder={t('Ваше имя')} value={name} error={nameErr} onChangeText={setName} autoCapitalize="words" />
      <PrimaryButton title={t('Сохранить')} onPress={saveName} disabled={name.trim() === user?.name} />

      <Text style={styles.sectionTitle}>{t('Смена пароля')}</Text>
      <Field icon="lock-closed" password placeholder={t('Текущий пароль')} value={oldP} error={errors.old} onChangeText={setOldP} />
      <Field icon="lock-closed" password placeholder={t('Новый пароль')} value={newP} error={errors.next} onChangeText={setNewP} />
      <PrimaryButton title={t('Сменить пароль')} onPress={submit} disabled={!oldP || !newP} />
    </Screen>
  );
}
