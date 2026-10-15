import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { BackButton, Field, PrimaryButton, Screen, useStyles } from '../ui';
import { useT } from '../i18n';
import { useApp } from '../store';
import * as haptics from '../haptics';
import { formatPhoneInput, isPhoneComplete } from '../utils';

type Props = {
  onBack?: () => void;
  onForgot: () => void;
  onRegister: () => void;
};

export default function Login({ onBack, onForgot, onRegister }: Props) {
  const styles = useStyles();
  const t = useT();
  const { login } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const pe = isPhoneComplete(phone) ? '' : t('Введите номер полностью');
    const pw = password ? '' : t('Введите пароль');
    setPhoneErr(pe);
    setPassErr(pw);
    if (pe || pw) return void haptics.error();

    setLoading(true);
    const error = await login(phone, password);
    setLoading(false);
    if (error) {
      setPassErr(error);
      haptics.error();
    } else haptics.success(); // при успехе навигатор сам откроет главную
  };

  return (
    <Screen>
      {onBack ? <BackButton onPress={onBack} /> : <Text style={{ height: 68 }} />}

      <Text style={styles.title}>{t('Привет, с возвращением!')}</Text>
      <Text style={styles.subtitle}>{t('Войдите в свой аккаунт.')}</Text>

      <Field
        icon="call"
        placeholder={t('Номер телефона')}
        keyboardType="phone-pad"
        value={phone}
        error={phoneErr}
        onChangeText={(t) => setPhone(formatPhoneInput(t, phone))}
      />
      <Field
        icon="lock-closed"
        password
        placeholder={t('Пароль')}
        value={password}
        error={passErr}
        onChangeText={setPassword}
      />

      <Pressable style={styles.linkRight} onPress={onForgot}>
        <Text style={styles.linkText}>{t('Забыли пароль?')}</Text>
      </Pressable>

      <PrimaryButton title={t('Войти')} onPress={submit} loading={loading} />

      <Text style={styles.grayCenter}>{t('У вас нет аккаунта?')}</Text>
      <Pressable onPress={onRegister}>
        <Text style={styles.purpleCenter}>{t('Зарегистрироваться')}</Text>
      </Pressable>
    </Screen>
  );
}
