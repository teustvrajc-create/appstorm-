import React, { useState } from 'react';
import { useT } from '../i18n';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton, Field, PrimaryButton, Screen, useStyles } from '../ui';
import { useApp, useTheme } from '../store';
import * as haptics from '../haptics';
import { formatPhoneInput, isPhoneComplete, passwordProblem } from '../utils';

type Props = {
  onBack: () => void;
  onLogin: () => void;
  onRegister: (data: { name: string; phone: string; password: string }) => void;
};

export default function Register({ onBack, onLogin, onRegister }: Props) {
  const styles = useStyles();
  const t = useT();
  const { colors } = useTheme();
  const { hasAccount } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({ name: '', phone: '', password: '' });

  const filled = !!(name && phone && password && agreed);

  const submit = () => {
    const e = {
      name: name.trim().length >= 2 ? '' : t('Введите имя'),
      phone: !isPhoneComplete(phone)
        ? t('Введите номер полностью')
        : hasAccount(phone)
          ? t('Этот номер уже зарегистрирован')
          : '',
      password: passwordProblem(password) ?? '',
    };
    setErrors(e);
    if (e.name || e.phone || e.password) return void haptics.error();
    onRegister({ name: name.trim(), phone, password });
  };

  return (
    <Screen>
      <BackButton onPress={onBack} />

      <Text style={styles.title}>{t('Регистрация')}</Text>
      <Text style={styles.subtitle}>{t('Создайте учетную запись, чтобы продолжить!')}</Text>

      <Field icon="person" placeholder={t('Ваше имя')} value={name} error={errors.name} onChangeText={setName} autoCapitalize="words" />
      <Field
        icon="call"
        placeholder={t('Номер телефона')}
        keyboardType="phone-pad"
        value={phone}
        error={errors.phone}
        onChangeText={(t) => setPhone(formatPhoneInput(t, phone))}
      />
      <Field icon="lock-closed" password placeholder={t('Пароль')} value={password} error={errors.password} onChangeText={setPassword} />

      <Pressable style={styles.agreeRow} onPress={() => setAgreed(!agreed)}>
        <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
          {agreed && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
        </View>
        <Text style={styles.agreeText}>
          {t('Создавая учетную запись, вы соглашаетесь с нашими')}{' '}
          <Text style={{ color: colors.primary }}>{t('Условиями')}</Text> {t('использования.')}
        </Text>
      </Pressable>

      <PrimaryButton title={t('Зарегистрироваться')} onPress={submit} disabled={!filled} />

      <View style={styles.bottomRow}>
        <Text style={[styles.grayCenter, { marginTop: 0 }]}>{t('Уже есть аккаунт?')}</Text>
        <Pressable onPress={onLogin}>
          <Text style={[styles.linkText, { fontSize: 15 }]}>{t('Войти')}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
